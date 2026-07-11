-- =============================================================================
-- LMS Apoteker Rahmato / Farma Masterclass
-- Seed Data
--
-- NOTE: Users are NOT seeded here because they require auth.users rows.
--       Create the mentor account via Supabase Auth (email: rahmato.farmasi@gmail.com)
--       and then manually update their profile row's role to 'mentor'.
--       Default student accounts can be created via the app's sign-up flow or
--       the Supabase dashboard.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- GENERATIONS (6 total)
-- ---------------------------------------------------------------------------
INSERT INTO public.generations (id, name, status, year) VALUES
  ('gen1', 'FMC 1.0 (Generasi 1)', 'completed', '2023'),
  ('gen2', 'FMC 2.0 (Generasi 2)', 'completed', '2023'),
  ('gen3', 'FMC 3.0 (Generasi 3)', 'completed', '2024'),
  ('gen4', 'FMC 4.0 (Generasi 4)', 'completed', '2024'),
  ('gen5', 'FMC 5.0 (Generasi 5)', 'completed', '2025'),
  ('gen6', 'FMC 6.0 (Generasi 6)', 'active',    '2025')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- CLASSES
-- ID formula: `${gen.id}-${raw.name.toLowerCase().replace(' ', '-')}`
-- Price: ADVANCE or INTERMEDIATE in name → 750000, else 450000
-- Category: ADVANCE or INTERMEDIATE → 'ADVANCE', else 'REGULER'
-- students_count: fixed representative values (completed gens higher)
-- ---------------------------------------------------------------------------
INSERT INTO public.classes
  (id, generation_id, generation_name, name, category, price, description, materials_count, students_count, playlist_url)
VALUES

-- =========== GEN 1 ===========
('gen1-basic-b',        'gen1', 'FMC 1.0 (Generasi 1)', 'BASIC B',        'REGULER', 450000,
 'Kelas dasar-menengah yang mempelajari prinsip dasar farmakoterapi, konsep pelayanan kefarmasian (pharmaceutical care), kalkulasi farmasi praktis, dispensing obat, serta komunikasi informasi obat untuk meningkatkan kepatuhan pasien.',
 5, 142, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIEbNSAgp3RweTF7LKXFpPRA'),

('gen1-basic-c',        'gen1', 'FMC 1.0 (Generasi 1)', 'BASIC C',        'REGULER', 450000,
 'Kelas dasar-menengah yang mempelajari prinsip dasar farmakoterapi, konsep pelayanan kefarmasian (pharmaceutical care), kalkulasi farmasi praktis, dispensing obat, serta komunikasi informasi obat untuk meningkatkan kepatuhan pasien.',
 5, 138, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIHLfQL-NSwVf90WcwpKSiwM'),

('gen1-intermediate-c', 'gen1', 'FMC 1.0 (Generasi 1)', 'INTERMEDIATE C', 'ADVANCE',  750000,
 'Kelas komprehensif tingkat lanjut yang membahas analisis farmakokinetika klinis, penyesuaian dosis obat kondisi patologis khusus, manajemen interaksi obat kritis, serta studi kasus asuhan kefarmasian tingkat tinggi.',
 5, 155, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIHbPAW0FlRhiiU3iAd65Zm_'),

('gen1-advance-b',      'gen1', 'FMC 1.0 (Generasi 1)', 'ADVANCE B',      'ADVANCE',  750000,
 'Kelas komprehensif tingkat lanjut yang membahas analisis farmakokinetika klinis, penyesuaian dosis obat kondisi patologis khusus, manajemen interaksi obat kritis, serta studi kasus asuhan kefarmasian tingkat tinggi.',
 5, 163, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIGt-l449g96Fw61NztG6XpD'),

-- =========== GEN 2 ===========
('gen2-basic-a',        'gen2', 'FMC 2.0 (Generasi 2)', 'BASIC A',        'REGULER', 450000,
 'Kelas dasar-menengah yang mempelajari prinsip dasar farmakoterapi, konsep pelayanan kefarmasian (pharmaceutical care), kalkulasi farmasi praktis, dispensing obat, serta komunikasi informasi obat untuk meningkatkan kepatuhan pasien.',
 5, 131, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIHUib1qFwgwc3PHGJu2DXkY'),

('gen2-basic-b',        'gen2', 'FMC 2.0 (Generasi 2)', 'BASIC B',        'REGULER', 450000,
 'Kelas dasar-menengah yang mempelajari prinsip dasar farmakoterapi, konsep pelayanan kefarmasian (pharmaceutical care), kalkulasi farmasi praktis, dispensing obat, serta komunikasi informasi obat untuk meningkatkan kepatuhan pasien.',
 5, 127, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIGIF7YcqoM-bnKOXqcCSOCo'),

('gen2-basic-c',        'gen2', 'FMC 2.0 (Generasi 2)', 'BASIC C',        'REGULER', 450000,
 'Kelas dasar-menengah yang mempelajari prinsip dasar farmakoterapi, konsep pelayanan kefarmasian (pharmaceutical care), kalkulasi farmasi praktis, dispensing obat, serta komunikasi informasi obat untuk meningkatkan kepatuhan pasien.',
 5, 145, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIHNYpRf13Z70zQr3Q-YTGq4'),

('gen2-intermediate-a', 'gen2', 'FMC 2.0 (Generasi 2)', 'INTERMEDIATE A', 'ADVANCE',  750000,
 'Kelas komprehensif tingkat lanjut yang membahas analisis farmakokinetika klinis, penyesuaian dosis obat kondisi patologis khusus, manajemen interaksi obat kritis, serta studi kasus asuhan kefarmasian tingkat tinggi.',
 5, 152, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIF5jX6utBbacthTc-jluI3W'),

('gen2-intermediate-b', 'gen2', 'FMC 2.0 (Generasi 2)', 'INTERMEDIATE B', 'ADVANCE',  750000,
 'Kelas komprehensif tingkat lanjut yang membahas analisis farmakokinetika klinis, penyesuaian dosis obat kondisi patologis khusus, manajemen interaksi obat kritis, serta studi kasus asuhan kefarmasian tingkat tinggi.',
 5, 148, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIEooxHyk1EOXn0SKVshV3lE'),

('gen2-intermediate-c', 'gen2', 'FMC 2.0 (Generasi 2)', 'INTERMEDIATE C', 'ADVANCE',  750000,
 'Kelas komprehensif tingkat lanjut yang membahas analisis farmakokinetika klinis, penyesuaian dosis obat kondisi patologis khusus, manajemen interaksi obat kritis, serta studi kasus asuhan kefarmasian tingkat tinggi.',
 5, 161, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIFsHb_mhurLG1sSt-jc-DBy'),

('gen2-advance-a',      'gen2', 'FMC 2.0 (Generasi 2)', 'ADVANCE A',      'ADVANCE',  750000,
 'Kelas komprehensif tingkat lanjut yang membahas analisis farmakokinetika klinis, penyesuaian dosis obat kondisi patologis khusus, manajemen interaksi obat kritis, serta studi kasus asuhan kefarmasian tingkat tinggi.',
 5, 134, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIGKP8D4ePFhQoZqThGZPGxz'),

('gen2-advance-b',      'gen2', 'FMC 2.0 (Generasi 2)', 'ADVANCE B',      'ADVANCE',  750000,
 'Kelas komprehensif tingkat lanjut yang membahas analisis farmakokinetika klinis, penyesuaian dosis obat kondisi patologis khusus, manajemen interaksi obat kritis, serta studi kasus asuhan kefarmasian tingkat tinggi.',
 5, 157, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIGFU4wq4kHSS9bjJY9TPH40'),

-- =========== GEN 3 ===========
('gen3-paket-a',        'gen3', 'FMC 3.0 (Generasi 3)', 'PAKET A',        'REGULER', 450000,
 'Kelas dasar-menengah yang mempelajari prinsip dasar farmakoterapi, konsep pelayanan kefarmasian (pharmaceutical care), kalkulasi farmasi praktis, dispensing obat, serta komunikasi informasi obat untuk meningkatkan kepatuhan pasien.',
 5, 139, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIH3C6HYiKZRqA3EN9uBWhb2'),

('gen3-paket-b',        'gen3', 'FMC 3.0 (Generasi 3)', 'PAKET B',        'REGULER', 450000,
 'Kelas dasar-menengah yang mempelajari prinsip dasar farmakoterapi, konsep pelayanan kefarmasian (pharmaceutical care), kalkulasi farmasi praktis, dispensing obat, serta komunikasi informasi obat untuk meningkatkan kepatuhan pasien.',
 5, 121, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIFVLmlbkIEQBUXnf-CRxDci'),

('gen3-paket-c',        'gen3', 'FMC 3.0 (Generasi 3)', 'PAKET C',        'REGULER', 450000,
 'Kelas dasar-menengah yang mempelajari prinsip dasar farmakoterapi, konsep pelayanan kefarmasian (pharmaceutical care), kalkulasi farmasi praktis, dispensing obat, serta komunikasi informasi obat untuk meningkatkan kepatuhan pasien.',
 5, 143, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIF0VyHyWo9pogR8XpEOJjPp'),

-- =========== GEN 4 ===========
('gen4-paket-a',        'gen4', 'FMC 4.0 (Generasi 4)', 'PAKET A',        'REGULER', 450000,
 'Kelas dasar-menengah yang mempelajari prinsip dasar farmakoterapi, konsep pelayanan kefarmasian (pharmaceutical care), kalkulasi farmasi praktis, dispensing obat, serta komunikasi informasi obat untuk meningkatkan kepatuhan pasien.',
 5, 149, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIGFU4wq4kHSS9bjJY9TPH40'),

('gen4-paket-b',        'gen4', 'FMC 4.0 (Generasi 4)', 'PAKET B',        'REGULER', 450000,
 'Kelas dasar-menengah yang mempelajari prinsip dasar farmakoterapi, konsep pelayanan kefarmasian (pharmaceutical care), kalkulasi farmasi praktis, dispensing obat, serta komunikasi informasi obat untuk meningkatkan kepatuhan pasien.',
 5, 133, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIHlHCCKTTKaL94zvNYtDpOD'),

('gen4-paket-c',        'gen4', 'FMC 4.0 (Generasi 4)', 'PAKET C',        'REGULER', 450000,
 'Kelas dasar-menengah yang mempelajari prinsip dasar farmakoterapi, konsep pelayanan kefarmasian (pharmaceutical care), kalkulasi farmasi praktis, dispensing obat, serta komunikasi informasi obat untuk meningkatkan kepatuhan pasien.',
 5, 128, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIGnhANYUUu_V9f91UYK030P'),

-- =========== GEN 5 ===========
('gen5-paket-a',        'gen5', 'FMC 5.0 (Generasi 5)', 'PAKET A',        'REGULER', 450000,
 'Kelas dasar-menengah yang mempelajari prinsip dasar farmakoterapi, konsep pelayanan kefarmasian (pharmaceutical care), kalkulasi farmasi praktis, dispensing obat, serta komunikasi informasi obat untuk meningkatkan kepatuhan pasien.',
 5, 136, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIHKlIe1zPh-sr_Rt6p3dHvx'),

('gen5-paket-b',        'gen5', 'FMC 5.0 (Generasi 5)', 'PAKET B',        'REGULER', 450000,
 'Kelas dasar-menengah yang mempelajari prinsip dasar farmakoterapi, konsep pelayanan kefarmasian (pharmaceutical care), kalkulasi farmasi praktis, dispensing obat, serta komunikasi informasi obat untuk meningkatkan kepatuhan pasien.',
 5, 125, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIFfrTZ58DvIEih0WX3HDX3S'),

('gen5-paket-c',        'gen5', 'FMC 5.0 (Generasi 5)', 'PAKET C',        'REGULER', 450000,
 'Kelas dasar-menengah yang mempelajari prinsip dasar farmakoterapi, konsep pelayanan kefarmasian (pharmaceutical care), kalkulasi farmasi praktis, dispensing obat, serta komunikasi informasi obat untuk meningkatkan kepatuhan pasien.',
 5, 140, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIEnfKYEUfjrrc0YEoP8keVI'),

-- =========== GEN 6 (active) ===========
('gen6-reguler-a',      'gen6', 'FMC 6.0 (Generasi 6)', 'REGULER A',      'REGULER', 450000,
 'Kelas dasar-menengah yang mempelajari prinsip dasar farmakoterapi, konsep pelayanan kefarmasian (pharmaceutical care), kalkulasi farmasi praktis, dispensing obat, serta komunikasi informasi obat untuk meningkatkan kepatuhan pasien.',
 5, 72, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIElUteGx0fEvi0s9tDct2Zz'),

('gen6-reguler-b',      'gen6', 'FMC 6.0 (Generasi 6)', 'REGULER B',      'REGULER', 450000,
 'Kelas dasar-menengah yang mempelajari prinsip dasar farmakoterapi, konsep pelayanan kefarmasian (pharmaceutical care), kalkulasi farmasi praktis, dispensing obat, serta komunikasi informasi obat untuk meningkatkan kepatuhan pasien.',
 5, 68, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIGo4Pd84-pLf4Vy-pu9bVOz'),

('gen6-reguler-c',      'gen6', 'FMC 6.0 (Generasi 6)', 'REGULER C',      'REGULER', 450000,
 'Kelas dasar-menengah yang mempelajari prinsip dasar farmakoterapi, konsep pelayanan kefarmasian (pharmaceutical care), kalkulasi farmasi praktis, dispensing obat, serta komunikasi informasi obat untuk meningkatkan kepatuhan pasien.',
 5, 75, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIGW8a1j5bx0IBU3q0m5zTvp'),

('gen6-advance-a',      'gen6', 'FMC 6.0 (Generasi 6)', 'ADVANCE A',      'ADVANCE',  750000,
 'Kelas komprehensif tingkat lanjut yang membahas analisis farmakokinetika klinis, penyesuaian dosis obat kondisi patologis khusus, manajemen interaksi obat kritis, serta studi kasus asuhan kefarmasian tingkat tinggi.',
 5, 58, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIHq1W-wpDZbk002m8GdB1eI'),

('gen6-advance-b',      'gen6', 'FMC 6.0 (Generasi 6)', 'ADVANCE B',      'ADVANCE',  750000,
 'Kelas komprehensif tingkat lanjut yang membahas analisis farmakokinetika klinis, penyesuaian dosis obat kondisi patologis khusus, manajemen interaksi obat kritis, serta studi kasus asuhan kefarmasian tingkat tinggi.',
 5, 63, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIHtFaG7K0egizihjo0PsAnz'),

('gen6-advance-c',      'gen6', 'FMC 6.0 (Generasi 6)', 'ADVANCE C',      'ADVANCE',  750000,
 'Kelas komprehensif tingkat lanjut yang membahas analisis farmakokinetika klinis, penyesuaian dosis obat kondisi patologis khusus, manajemen interaksi obat kritis, serta studi kasus asuhan kefarmasian tingkat tinggi.',
 5, 55, 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIEnTLMeoIFOs2R5ezMY19tT')

ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- QUIZZES — two shared templates, one per category
-- Each class gets its own quiz row referencing these questions via quiz_id
-- ---------------------------------------------------------------------------

-- We seed one quiz per active class (gen6) plus placeholders for all.
-- Practical approach: seed the two canonical quiz templates, then in the app
-- each class references 'quiz-reguler' or 'quiz-advance' based on category.
-- The class_id column stores the actual class when a quiz attempt is linked.

-- Reguler quiz (applies to all REGULER classes)
INSERT INTO public.quizzes (id, class_id, title, passing_score) VALUES
  ('quiz-reguler', 'gen6-reguler-a', 'Evaluasi Komprehensif Kelas Reguler', 75),
  ('quiz-advance',  'gen6-advance-a', 'Evaluasi Klinis Kelas Advance',       75)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- QUIZ QUESTIONS — Reguler (5 questions)
-- ---------------------------------------------------------------------------
INSERT INTO public.quiz_questions (id, quiz_id, question, options, correct_option, explanation, order_index) VALUES

('q-reg1', 'quiz-reguler',
 'Metode konseling yang melibatkan tiga pertanyaan kunci ("Three Prime Questions") bertujuan untuk menggali pemahaman pasien tentang obat. Tiga pertanyaan tersebut menanyakan hal berikut, KECUALI...',
 '["Bagaimana penjelasan dokter tentang kegunaan obat ini?","Bagaimana cara dokter menjelaskan penggunaan obat ini?","Apa efek samping berbahaya yang diberitahukan dokter kepada Anda?","Bagaimana penjelasan dokter tentang harapan setelah minum obat ini?"]',
 2,
 'Three Prime Questions mencakup: 1. Apa yang dikatakan dokter tentang obat Anda (kegunaan/tujuan)? 2. Bagaimana cara minum/menggunakannya? 3. Apa yang diharapkan setelah menggunakannya? Menanyakan efek samping secara terpisah tidak termasuk dalam format standar TPQ awal.',
 0),

('q-reg2', 'quiz-reguler',
 'Seorang pasien anak (BB 12 kg) didiagnosis demam dan diresepkan Paracetamol sirup (120 mg/5 mL) dengan dosis 10 mg/kgBB per kali pemberian. Berapa volume (mL) sirup sekali minum?',
 '["2.5 mL","5.0 mL","7.5 mL","10 mL"]',
 1,
 'Dosis sekali minum = 12 kg x 10 mg/kg = 120 mg. Sediaan sirup memiliki kadar 120 mg per 5 mL. Maka, pasien membutuhkan tepat 5 mL sekali pemberian.',
 1),

('q-reg3', 'quiz-reguler',
 'Sesuai dengan pedoman BUD (Beyond Use Date) USP <795>, sediaan puyer/kapsul racikan kering non-air yang diracik dari tablet paten dengan ED 2 tahun lagi memiliki BUD maksimal selama...',
 '["14 Hari","30 Hari","6 Bulan","1 Tahun"]',
 2,
 'Berdasarkan USP <795>, sediaan non-air padat racikan dari obat jadi pabrikan memiliki BUD maksimal 25% dari waktu kedaluwarsa tersisa atau 6 bulan, mana yang lebih cepat. Karena 25% dari 2 tahun adalah 6 bulan, maka BUD-nya maksimal 6 bulan.',
 2),

('q-reg4', 'quiz-reguler',
 'Manakah dari obat berikut yang termasuk dalam golongan Obat Wajib Apoteker (OWA No. 1) yang dapat diserahkan langsung oleh Apoteker tanpa resep dokter untuk pengobatan maag akut?',
 '["Famotidine","Lansoprazole","Sucralfate","Metoclopramide"]',
 0,
 'Famotidine (antagonis H2) termasuk dalam daftar OWA No. 1 dengan batas maksimal 10 tablet per penyerahan. Sedangkan PPI generasi baru atau obat saluran pencernaan lain memiliki regulasi rujukan resep yang berbeda atau masuk golongan obat keras umum.',
 3),

('q-reg5', 'quiz-reguler',
 'Asuhan kefarmasian (Pharmaceutical care) berpusat pada pencapaian hasil terapi yang optimal. Jika pasien diresepkan Amoxicillin namun berhenti minum setelah hari ke-2 karena merasa sudah sembuh, masalah terapi obat (DTP) yang terjadi adalah...',
 '["Terapi tanpa indikasi","Ketidakpatuhan pasien (Non-compliance)","Efek samping obat","Pemilihan obat tidak tepat"]',
 1,
 'Menghentikan pengobatan antibiotik secara sepihak sebelum habis dikategorikan sebagai ketidakpatuhan pasien (non-compliance) yang berisiko memicu resistensi bakteri.',
 4)

ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- QUIZ QUESTIONS — Advance (5 questions)
-- ---------------------------------------------------------------------------
INSERT INTO public.quiz_questions (id, quiz_id, question, options, correct_option, explanation, order_index) VALUES

('q-adv1', 'quiz-advance',
 'Pasien laki-laki 72 tahun (BB 60 kg) dengan Serum Kreatinin 2.0 mg/dL diresepkan antibiotik Gentamicin. Hitung klirens kreatinin (CrCl) pasien menggunakan rumus Cockcroft-Gault.',
 '["15.4 mL/menit","28.3 mL/menit","42.5 mL/menit","56.0 mL/menit"]',
 1,
 'CrCl = ((140 - 72) x 60) / (72 x 2.0) = (68 x 60) / 144 = 4080 / 144 = 28.33 mL/menit.',
 0),

('q-adv2', 'quiz-advance',
 'Penggunaan antibiotik aminoglikosida pada pasien gangguan fungsi ginjal dengan metode interval diperpanjang memanfaatkan sifat farmakodinamika khas obat ini, yaitu...',
 '["Time-dependent killing","Concentration-dependent killing & Post-Antibiotic Effect (PAE) yang panjang","Synergistic interaction dengan NSAID","Penurunan ikatan protein plasma"]',
 1,
 'Aminoglikosida memiliki aktivitas pembunuhan bakteri yang bergantung pada konsentrasi puncak (concentration-dependent) dan efek pasca-antibiotik (PAE) yang lama, memungkinkan pemberian dosis tunggal harian yang tinggi bahkan dengan klirens kreatinin rendah dengan memperpanjang interval pemberian.',
 1),

('q-adv3', 'quiz-advance',
 'Pada studi klinis PATHWAY-2 untuk penatalaksanaan Hipertensi Resisten, obat manakah yang terbukti secara signifikan paling efektif sebagai terapi tambahan keempat (lini ke-4)?',
 '["Amlodipine","Spironolactone","Clonidine","Furosemide"]',
 1,
 'Studi PATHWAY-2 membuktikan bahwa antagonis aldosteron Spironolactone (12.5-50 mg/hari) adalah obat tambahan lini keempat yang paling efektif untuk mengontrol hipertensi resisten dibandingkan plasebo, bisoprolol, atau doxazosin.',
 2),

('q-adv4', 'quiz-advance',
 'Manakah dari kombinasi obat berikut yang memiliki interaksi farmakodinamik sinergis yang sangat kritis terhadap risiko hiperkalemia berat jika tidak dimonitor ketat?',
 '["Lisinopril + Spironolactone","Atorvastatin + Clopidogrel","Metformin + Glimepiride","Ciprofloxacin + Antasida"]',
 0,
 'Kombinasi ACE-Inhibitor (Lisinopril) dengan Aldosterone Antagonist (Spironolactone) sama-sama menghambat sekresi aldosteron, secara langsung menurunkan ekskresi kalium ginjal, sehingga meningkatkan risiko hiperkalemia yang berbahaya pada jantung.',
 3),

('q-adv5', 'quiz-advance',
 'Indeks terapi sempit (Narrow Therapeutic Index) memerlukan monitoring terapeutik obat (TDM). Di antara obat kardiovaskular berikut, yang paling mendesak diawasi kadarnya untuk menghindari toksisitas aritmia fatal adalah...',
 '["Bisoprolol","Digoxin","Captopril","Valsartan"]',
 1,
 'Digoxin memiliki indeks terapi sempit (rentang terapeutik 0.5 - 2.0 ng/mL). Kadar di atas 2.0 ng/mL dapat memicu toksisitas glikosida berupa mual berat, gangguan penglihatan warna kuning-hijau, hingga aritmia jantung yang berakibat kematian.',
 4)

ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- DEFAULT FORUM POSTS
-- NOTE: We cannot seed forum_posts/replies without real auth.users rows.
--       The user_id column references profiles.id which references auth.users.id.
--       After creating users via Supabase Auth, run this block with their real UUIDs:
--
-- Example (replace UUIDs with real values from your Supabase Auth dashboard):
--
-- INSERT INTO public.forum_posts (id, class_id, user_id, title, content, created_at) VALUES
--   ('11111111-0000-0000-0000-000000000001', 'gen6-reguler-a', '<siti-uuid>',
--    'Pertanyaan mengenai BUD Puyer racikan jika tablet aslinya tidak punya info kedaluwarsa lengkap',
--    'Assalamu alaikum sejawat, izin bertanya. Pada racikan puyer anak, jika kita menggunakan tablet yang diambil dari strip/blister luar namun tanggal kedaluwarsanya terpotong atau tidak terbaca dengan jelas, bagaimana cara kita menetapkan Beyond Use Date yang aman? Terima kasih.',
--    '2026-07-05T10:30:00Z');
--
-- INSERT INTO public.forum_replies (id, post_id, user_id, content, created_at) VALUES
--   ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '<rahmato-uuid>',
--    'Wa alaikumussalam Wr Wb Siti. Pertanyaan praktis yang sangat bagus! Secara aturan professional, bila kedaluwarsa bahan obat asal tidak diketahui dengan pasti, kita dilarang berasumsi. Sebaiknya ganti dengan strip baru yang tanggal kedaluwarsanya terbaca jelas demi keamanan pasien. Namun bila dalam situasi darurat dan sediaannya homogen stabil, jangan menetapkan BUD melebihi batas terpendek, bahkan idealnya tidak direkomendasikan meracik obat tanpa kepastian ED. Utamakan Patient Safety.',
--    '2026-07-05T14:15:00Z');
--
-- INSERT INTO public.forum_posts (id, class_id, user_id, title, content, created_at) VALUES
--   ('11111111-0000-0000-0000-000000000002', 'gen6-advance-a', '<farhan-uuid>',
--    'Interaksi Ceftriaxone & Kalsium Intravena pada Pasien Geriatri ICU',
--    'Dokter sejawat dan Apoteker Rahmato, saya sempat membaca literatur mengenai kontraindikasi pemberian Ceftriaxone bersamaan dengan cairan infus yang mengandung Kalsium (seperti Ringer Laktat) karena risiko presipitasi kalsium-ceftriaxone yang mematikan pada paru dan ginjal anak-anak. Apakah kejadian presipitasi ini juga sangat berisiko terjadi pada pasien dewasa/geriatri di ICU? Bagaimana pencegahannya?',
--    '2026-07-06T08:20:00Z');
--
-- INSERT INTO public.forum_replies (id, post_id, user_id, content, created_at) VALUES
--   ('22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000002', '<rahmato-uuid>',
--    'Salam dr. Farhan. Betul sekali. Pada neonatus, kontraindikasinya mutlak (tidak boleh diberikan bersamaan maupun bergantian meskipun lewat line berbeda). Pada pasien dewasa/geriatri, presipitasi masih bisa terjadi di dalam sirkulasi darah. Rekomendasinya: gunakan line infus yang berbeda jika terpaksa memberikan kedua zat tersebut, dan pastikan dilakukan pembilasan (flushing) dengan cairan NaCl fisiologis 0.9% secara adekuat di antara kedua infus jika menggunakan saluran yang sama.',
--    '2026-07-06T11:05:00Z'),
--   ('22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000002', '<budi-uuid>',
--    'Terima kasih penjelasannya Pak Rahmato. Diskusi ini sangat membuka mata kami yang bertugas di bangsal pelayanan intensif.',
--    '2026-07-06T13:45:00Z');
-- ---------------------------------------------------------------------------
