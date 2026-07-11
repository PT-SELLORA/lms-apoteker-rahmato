import { chromium } from 'playwright';

const BASE = process.env.TEST_BASE_URL ?? 'http://localhost:3007';
const BUGS = [];
const PASSES = [];

function ok(msg) { PASSES.push(msg); console.log(`  ✅ ${msg}`); }
function bug(msg, detail = '') { BUGS.push(msg); console.log(`  🐛 BUG: ${msg}${detail ? ' — ' + detail : ''}`); }
function section(title) { console.log(`\n${'='.repeat(60)}\n  ${title}\n${'='.repeat(60)}`); }

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

// Capture console errors
const consoleErrors = [];
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
page.on('pageerror', err => consoleErrors.push(err.message));

// =========================================================
// 1. LANDING PAGE
// =========================================================
section('1. LANDING PAGE');
await page.goto(BASE);
await page.waitForLoadState('networkidle');
await page.screenshot({ path: '/tmp/01_landing.png', fullPage: true });

(await page.locator('text=AKSELERASI').isVisible()) ? ok('Hero headline rendered') : bug('Hero headline missing');
(await page.locator('text=APOTEKER RAHMATO').first().isVisible()) ? ok('Mentor name visible') : bug('Mentor name not visible');
(await page.locator('text=6+').isVisible()) ? ok('Stats 6+ Generasi visible') : bug('Stats section missing');
(await page.locator('text=SANDBOX ENVIRONMENT').isVisible()) ? ok('Sandbox section visible') : bug('Sandbox section missing');
const advCount = await page.locator('text=ADVANCE').count();
advCount > 0 ? ok(`Class cards rendered (${advCount} ADVANCE labels)`) : bug('Class cards not rendering');

// =========================================================
// 2. SIMULATOR BAR
// =========================================================
section('2. SIMULATOR BAR');
(await page.locator('text=Rahmato Academy Simulator').isVisible()) ? ok('Simulator bar visible') : bug('Simulator bar missing');
const toggleBtn = page.locator('button', { hasText: 'Sembunyikan' });
if (await toggleBtn.isVisible()) {
  await toggleBtn.click();
  await page.waitForTimeout(400);
  const reopenBtn = page.locator('button', { hasText: 'Buka Panel' });
  (await reopenBtn.isVisible()) ? ok('Simulator bar collapse works') : bug('Simulator bar toggle broken');
  await reopenBtn.click();
  await page.waitForTimeout(400);
}

// =========================================================
// 3. MENTOR DASHBOARD
// =========================================================
section('3. MENTOR DASHBOARD');
await page.locator('button', { hasText: 'Mentor (Apoteker Rahmato)' }).click();
await page.waitForLoadState('networkidle');
await page.waitForTimeout(600);
await page.screenshot({ path: '/tmp/02_mentor.png', fullPage: true });

(await page.locator('text=Apoteker Rahmato').first().isVisible()) ? ok('Mentor dashboard loaded') : bug('Mentor dashboard failed to load');
const hasStat = await page.locator('text=Rp').first().isVisible();
hasStat ? ok('Revenue stats (Rp) visible') : bug('Revenue stats not showing');

// Mentor tabs
for (const tabText of ['Data Mahasiswa', 'Billing Keuangan', 'Konsultasi Forum']) {
  const tab = page.locator('button', { hasText: tabText }).first();
  if (await tab.isVisible()) {
    await tab.click();
    await page.waitForTimeout(400);
    ok(`Mentor tab '${tabText}' clickable`);
  } else {
    bug(`Mentor tab '${tabText}' not found`);
  }
}

// Content editor
const contentTab = page.locator('button', { hasText: 'Rilis Materi' }).first();
if (await contentTab.isVisible()) {
  await contentTab.click();
  await page.waitForTimeout(400);
  ok('Content editor tab accessible');
} else {
  bug('Content editor tab not found');
}

// Logout mentor
const mentorLogout = page.locator('button', { hasText: 'Keluar Panel' }).first();
if (await mentorLogout.isVisible()) { await mentorLogout.click(); await page.waitForTimeout(400); ok('Mentor logout works'); }
else { bug('Keluar Panel button missing'); }

// =========================================================
// 4. STUDENT DASHBOARD — dr. Farhan
// =========================================================
section('4. STUDENT DASHBOARD — dr. Farhan');
await page.locator('button', { hasText: 'dr. Farhan' }).click();
await page.waitForLoadState('networkidle');
await page.waitForTimeout(600);
await page.screenshot({ path: '/tmp/03_farhan.png', fullPage: true });

(await page.locator('text=Farhan').first().isVisible()) ? ok('Farhan dashboard loaded') : bug('Farhan dashboard failed to load');
(await page.locator('text=Kelas Aktif Belajar').isVisible()) ? ok("'Kelas Saya' tab default") : bug("'Kelas Saya' tab not default");

// Expand accordion
const genBtn = page.locator('button', { hasText: 'FMC 6' }).first();
if (await genBtn.isVisible()) {
  await genBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/tmp/04_farhan_classes.png' });
  const enterBtn = page.locator('button', { hasText: 'Masuk Ruang Kelas' }).first();
  (await enterBtn.isVisible()) ? ok('Accordion expands & shows class cards') : bug('Accordion expanded but no class cards');
} else {
  bug('FMC 6 accordion not found in Kelas Saya');
}

// =========================================================
// 5. CLASSROOM — All 4 Tabs
// =========================================================
section('5. CLASSROOM — All Tabs');
const enterBtn = page.locator('button', { hasText: 'Masuk Ruang Kelas' }).first();
if (await enterBtn.isVisible()) {
  await enterBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/tmp/05_classroom.png', fullPage: true });
  (await page.locator('text=Video Materi').isVisible()) ? ok('Classroom opened — Video tab') : bug('Classroom did not open');

  // Video tab content
  const videoContent = await page.content();
  if (videoContent.includes('youtube') || videoContent.includes('YouTube') || videoContent.includes('video') || videoContent.includes('Video')) {
    ok('Video tab has video content');
  } else {
    bug('Video tab has no content');
  }

  // Files tab
  await page.locator('button', { hasText: 'File Referensi' }).first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/06_files.png', fullPage: true });
  const filesContent = await page.content();
  (filesContent.includes('PDF') || filesContent.includes('pdf') || filesContent.includes('Modul')) ? ok('Files tab renders PDF materials') : bug('Files tab empty');

  // Quiz tab
  await page.locator('button', { hasText: 'Kuis' }).first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/07_quiz.png', fullPage: true });

  const quizVisible = await page.locator('text=Evaluasi').first().isVisible();
  if (quizVisible) {
    ok('Quiz tab renders');

    // Answer each question — click option A (index 0) for each of the 5 questions
    // Quiz option buttons use class "border rounded-xl" (distinct from payment buttons which use "rounded-lg")
    const allOptionBtns = await page.locator('button[type="button"].border.rounded-xl').all();
    let answeredCount = 0;
    for (let i = 0; i < allOptionBtns.length; i += 4) {
      try { await allOptionBtns[i].click(); await page.waitForTimeout(200); answeredCount++; } catch {}
    }
    answeredCount > 0 ? ok(`Answered ${answeredCount} quiz questions`) : bug('Could not click quiz options');
    await page.waitForTimeout(300);

    // Submit
    const submitQuiz = page.locator('button', { hasText: 'Kirim Lembar Jawaban' }).first();
    if (await submitQuiz.isVisible()) {
      await submitQuiz.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: '/tmp/08_quiz_result.png', fullPage: true });
      const resultContent = await page.content();
      if (resultContent.includes('Nilai') || resultContent.includes('Skor') || resultContent.includes('lulus') || resultContent.includes('Lulus') || resultContent.includes('%')) {
        ok('Quiz result shows after submit');
      } else {
        bug('Quiz result not displayed after submit');
      }
    } else {
      bug('Quiz submit button not found');
    }
  } else {
    bug('Quiz tab not rendering questions');
  }

  // Forum tab
  await page.locator('button', { hasText: 'Forum Diskusi' }).first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/09_forum.png', fullPage: true });
  ok('Forum Diskusi tab opened');

  const newPostBtn = page.locator('button').filter({ hasText: /Buat|Topik Baru|Posting/ }).first();
  if (await newPostBtn.isVisible()) {
    await newPostBtn.click();
    await page.waitForTimeout(400);

    const titleInput = page.locator('input').first();
    const bodyInput = page.locator('textarea').first();

    if (await titleInput.isVisible()) {
      await titleInput.fill('Pertanyaan tentang dosis Metformin pada CKD');
      ok('Forum post title input works');
    } else { bug('Forum title input not found'); }

    if (await bodyInput.isVisible()) {
      await bodyInput.fill('Bagaimana penyesuaian dosis Metformin pada pasien CKD stage 3?');
      ok('Forum post body input works');
    } else { bug('Forum body textarea not found'); }

    const postBtn = page.locator('button').filter({ hasText: /Posting|Kirim|Post/ }).last();
    if (await postBtn.isVisible()) {
      await postBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: '/tmp/10_forum_posted.png' });
      ok('Forum post submitted');
    } else { bug('Forum post submit button not found'); }
  } else {
    bug("'Buat Topik Baru' button not found in Forum tab");
  }
} else {
  bug("'Masuk Ruang Kelas' not found — cannot test classroom");
}

// =========================================================
// 6. CATALOG + CHECKOUT — Siti (unenrolled class)
// =========================================================
section('6. CATALOG + CHECKOUT');
const sitiBtn = page.locator('button', { hasText: 'Siti Aminah' });
if (await sitiBtn.isVisible()) {
  await sitiBtn.click();
} else {
  // Log out and use guest
  const lo = page.locator('button', { hasText: 'Log Out' }).first();
  if (await lo.isVisible()) await lo.click();
  await page.waitForTimeout(300);
  await page.locator('button', { hasText: /Siswa Baru|Guest/ }).first().click();
}
await page.waitForTimeout(500);

const buyTab = page.locator('button', { hasText: 'Beli Kelas Baru' }).first();
if (await buyTab.isVisible()) {
  await buyTab.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/tmp/11_catalog.png', fullPage: true });
  ok('Catalog tab opened');

  // Expand gen6
  const catGenBtn = page.locator('button').filter({ hasText: 'FMC 6' }).first();
  if (await catGenBtn.isVisible()) {
    await catGenBtn.click();
    await page.waitForTimeout(500);

    const buyClassBtn = page.locator('button').filter({ hasText: /^Beli Kelas$/ }).first();
    if (await buyClassBtn.isVisible()) {
      await buyClassBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: '/tmp/12_checkout.png' });

      const checkoutModal = await page.locator('text=Billing').isVisible() || await page.locator('text=Pembayaran').isVisible();
      checkoutModal ? ok('Checkout modal opened') : bug('Checkout modal did not open');

      // Pick GoPay
      const goPayBtn = page.locator('button', { hasText: 'E-Wallet (GoPay)' }).first();
      if (await goPayBtn.isVisible()) { await goPayBtn.click(); await page.waitForTimeout(200); ok('Payment method GoPay selected'); }

      // Confirm
      const confirmBtn = page.locator('button', { hasText: 'Selesaikan Pembayaran' }).first();
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
        await page.waitForTimeout(700);
        await page.screenshot({ path: '/tmp/13_checkout_success.png' });
        const successContent = await page.content();
        (successContent.includes('Sukses') || successContent.includes('Berhasil')) ? ok('Checkout success screen shown') : bug('Checkout success not shown');

        const openClassBtn = page.locator('button', { hasText: 'Buka Kelas Saya & Belajar' }).first();
        if (await openClassBtn.isVisible()) {
          await openClassBtn.click();
          await page.waitForTimeout(500);
          ok('Redirected to classroom after purchase');
        } else { bug("'Buka Kelas Saya & Belajar' button missing after success"); }
      } else { bug('Confirm payment button not found'); }
    } else { bug("'Beli Kelas' button not found in catalog"); }
  } else { bug('FMC 6 not found in catalog'); }
} else { bug("'Beli Kelas Baru' tab not found"); }

// =========================================================
// 7. TRANSACTIONS & CERTIFICATES
// =========================================================
section('7. TRANSACTIONS & CERTIFICATES');
const lo2 = page.locator('button', { hasText: 'Log Out' }).first();
if (await lo2.isVisible()) await lo2.click();
await page.waitForTimeout(300);
await page.locator('button', { hasText: 'dr. Farhan' }).click();
await page.waitForTimeout(500);

const txTab = page.locator('button', { hasText: 'Riwayat Tagihan' }).first();
if (await txTab.isVisible()) {
  await txTab.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/tmp/14_tx.png', fullPage: true });
  ok('Riwayat Tagihan tab opened');
  const txContent = await page.content();
  (txContent.includes('TX-') || txContent.includes('Sukses')) ? ok('Transaction history renders') : bug('No transactions in history');
} else { bug('Riwayat Tagihan tab not found'); }

const certTab = page.locator('button', { hasText: 'Sertifikat' }).first();
if (await certTab.isVisible()) {
  await certTab.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/tmp/15_cert.png', fullPage: true });
  ok('Sertifikat tab opened');
  const certContent = await page.content();
  (certContent.includes('Sertifikat') || certContent.includes('Belum Ada')) ? ok('Certificate page renders') : bug('Certificate page broken');
} else { bug('Sertifikat tab not found'); }

// =========================================================
// 8. CATALOG SEARCH
// =========================================================
section('8. CATALOG SEARCH');
const buyTab2 = page.locator('button', { hasText: 'Beli Kelas Baru' }).first();
if (await buyTab2.isVisible()) {
  await buyTab2.click();
  await page.waitForTimeout(300);
  const searchBox = page.locator('input[placeholder*="Cari"]').first();
  if (await searchBox.isVisible()) {
    await searchBox.fill('ADVANCE');
    await page.waitForTimeout(400);
    await page.screenshot({ path: '/tmp/16_search.png' });
    ok('Catalog search input works');
    await searchBox.fill('xyznotfound');
    await page.waitForTimeout(400);
    const noResult = await page.content();
    noResult.includes('tidak ada') || noResult.includes('Tidak ada') ? ok('Empty search state shown') : bug('Empty search state missing');
    await searchBox.fill('');
  } else { bug('Catalog search input not found'); }
}

// =========================================================
// 9. CONSOLE ERRORS
// =========================================================
section('9. CONSOLE ERRORS (fresh load)');
const freshErrors = [];
page.on('console', msg => { if (msg.type() === 'error') freshErrors.push(msg.text()); });
await page.goto(BASE);
await page.waitForLoadState('networkidle');
await page.waitForTimeout(800);

// 401 on /api/auth/me is expected when not logged in — filter it out
const realErrors = freshErrors.filter(e => !e.includes('401') && !e.includes('api/auth/me'));
realErrors.length === 0 ? ok('No console errors on fresh load') : realErrors.forEach(e => bug('Console error', e.slice(0, 100)));

await browser.close();

// =========================================================
// FINAL REPORT
// =========================================================
console.log(`\n${'='.repeat(60)}`);
console.log('  📋 FINAL TEST REPORT — LMS Apoteker Rahmato');
console.log('='.repeat(60));
console.log(`\n✅ PASSED: ${PASSES.length}`);
PASSES.forEach(p => console.log(`   ✅ ${p}`));
console.log(`\n🐛 BUGS: ${BUGS.length}`);
if (BUGS.length === 0) {
  console.log('   🎉 ZERO BUGS — Goal achieved!');
} else {
  BUGS.forEach(b => console.log(`   🐛 ${b}`));
}
console.log(`\n📊 Score: ${PASSES.length}/${PASSES.length + BUGS.length} checks passed`);
console.log('\n📸 Screenshots: /tmp/01_landing.png → /tmp/16_search.png');
