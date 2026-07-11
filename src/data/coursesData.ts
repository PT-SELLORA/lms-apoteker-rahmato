import { Generation, Class, Material, ForumPost, Quiz, User, Transaction, QuizAttempt } from '../types';
import playlistsData from './playlists.json';

export const MENTOR_RAHMATO: User = {
  id: 'mentor-rahmato',
  name: 'Apoteker Rahmato',
  email: 'rahmato.farmasi@gmail.com',
  role: 'mentor',
  avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=60',
  profession: 'Apoteker',
  enrolledClasses: [],
  completedClasses: [],
};

// Generasi 1 sampai 6
export const GENERATIONS: Generation[] = [
  { id: 'gen1', name: 'FMC 1.0 (Generasi 1)', status: 'completed', year: '2023' },
  { id: 'gen2', name: 'FMC 2.0 (Generasi 2)', status: 'completed', year: '2023' },
  { id: 'gen3', name: 'FMC 3.0 (Generasi 3)', status: 'completed', year: '2024' },
  { id: 'gen4', name: 'FMC 4.0 (Generasi 4)', status: 'completed', year: '2024' },
  { id: 'gen5', name: 'FMC 5.0 (Generasi 5)', status: 'completed', year: '2025' },
  { id: 'gen6', name: 'FMC 6.0 (Generasi 6)', status: 'active', year: '2025' },
];

interface RawClassData {
  name: string;
  playlistUrl: string;
}

export const GENERATION_CLASSES_MAP: Record<string, RawClassData[]> = {
  gen1: [
    { name: 'BASIC B', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIEbNSAgp3RweTF7LKXFpPRA' },
    { name: 'BASIC C', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIHLfQL-NSwVf90WcwpKSiwM' },
    { name: 'INTERMEDIATE C', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIHbPAW0FlRhiiU3iAd65Zm_' },
    { name: 'ADVANCE B', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIGt-l449g96Fw61NztG6XpD' },
  ],
  gen2: [
    { name: 'BASIC A', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIHUib1qFwgwc3PHGJu2DXkY' },
    { name: 'BASIC B', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIGIF7YcqoM-bnKOXqcCSOCo' },
    { name: 'BASIC C', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIHNYpRf13Z70zQr3Q-YTGq4' },
    { name: 'INTERMEDIATE A', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIF5jX6utBbacthTc-jluI3W' },
    { name: 'INTERMEDIATE B', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIEooxHyk1EOXn0SKVshV3lE' },
    { name: 'INTERMEDIATE C', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIFsHb_mhurLG1sSt-jc-DBy' },
    { name: 'ADVANCE A', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIGKP8D4ePFhQoZqThGZPGxz' },
    { name: 'ADVANCE B', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIGFU4wq4kHSS9bjJY9TPH40' },
  ],
  gen3: [
    { name: 'PAKET A', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIH3C6HYiKZRqA3EN9uBWhb2' },
    { name: 'PAKET B', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIFVLmlbkIEQBUXnf-CRxDci' },
    { name: 'PAKET C', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIF0VyHyWo9pogR8XpEOJjPp' },
  ],
  gen4: [
    { name: 'PAKET A', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIGFU4wq4kHSS9bjJY9TPH40' },
    { name: 'PAKET B', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIHlHCCKTTKaL94zvNYtDpOD' },
    { name: 'PAKET C', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIGnhANYUUu_V9f91UYK030P' },
  ],
  gen5: [
    { name: 'PAKET A', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIHKlIe1zPh-sr_Rt6p3dHvx' },
    { name: 'PAKET B', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIFfrTZ58DvIEih0WX3HDX3S' },
    { name: 'PAKET C', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIEnfKYEUfjrrc0YEoP8keVI' },
  ],
  gen6: [
    { name: 'REGULER A', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIElUteGx0fEvi0s9tDct2Zz' },
    { name: 'REGULER B', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIGo4Pd84-pLf4Vy-pu9bVOz' },
    { name: 'REGULER C', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIGW8a1j5bx0IBU3q0m5zTvp' },
    { name: 'ADVANCE A', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIHq1W-wpDZbk002m8GdB1eI' },
    { name: 'ADVANCE B', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIHtFaG7K0egizihjo0PsAnz' },
    { name: 'ADVANCE C', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIEnTLMeoIFOs2R5ezMY19tT' },
  ],
};

// Generates classes for each generation dynamically
export const generateClasses = (): Class[] => {
  const classes: Class[] = [];

  GENERATIONS.forEach((gen) => {
    const rawClasses = GENERATION_CLASSES_MAP[gen.id] || [
      { name: 'REGULER A', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIElUteGx0fEvi0s9tDct2Zz' },
      { name: 'REGULER B', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIGo4Pd84-pLf4Vy-pu9bVOz' },
      { name: 'REGULER C', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIGW8a1j5bx0IBU3q0m5zTvp' },
      { name: 'ADVANCE A', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIHq1W-wpDZbk002m8GdB1eI' },
      { name: 'ADVANCE B', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIHtFaG7K0egizihjo0PsAnz' },
      { name: 'ADVANCE C', playlistUrl: 'https://www.youtube.com/playlist?list=PLrMxIk7FCUIEnTLMeoIFOs2R5ezMY19tT' },
    ];

    rawClasses.forEach((raw) => {
      const isAdvance = raw.name.toUpperCase().includes('ADVANCE') || raw.name.toUpperCase().includes('INTERMEDIATE');
      const basePrice = isAdvance ? 750000 : 450000;
      // Completed generations have more students
      const baseStudents = gen.status === 'completed'
        ? Math.floor(Math.random() * 50) + 120
        : Math.floor(Math.random() * 80) + 50;

      classes.push({
        id: `${gen.id}-${raw.name.toLowerCase().replace(' ', '-')}`,
        generationId: gen.id,
        generationName: gen.name,
        name: raw.name,
        category: isAdvance ? 'ADVANCE' : 'REGULER',
        price: basePrice,
        description: isAdvance
          ? `Kelas komprehensif tingkat lanjut yang membahas analisis farmakokinetika klinis, penyesuaian dosis obat kondisi patologis khusus, manajemen interaksi obat kritis, serta studi kasus asuhan kefarmasian tingkat tinggi.`
          : `Kelas dasar-menengah yang mempelajari prinsip dasar farmakoterapi, konsep pelayanan kefarmasian (pharmaceutical care), kalkulasi farmasi praktis, dispensing obat, serta komunikasi informasi obat untuk meningkatkan kepatuhan pasien.`,
        materialsCount: 5,
        studentsCount: baseStudents,
        playlistUrl: raw.playlistUrl,
      });
    });
  });

  return classes;
};

export const INITIAL_CLASSES = generateClasses();

// Materials template that applies to any class
export const getMaterialsForClass = (classId: string, className: string): Material[] => {
  const isAdvance = className.toUpperCase().includes('ADVANCE') || className.toUpperCase().includes('INTERMEDIATE');
  const classData = INITIAL_CLASSES.find(c => c.id === classId);
  const playlistUrl = classData?.playlistUrl || '';
  
  const videos = (playlistsData as Record<string, {id: string, title: string, duration: number}[]>)[playlistUrl] || [];
  
  const videoMaterials: Material[] = videos.map((v, i) => {
    const mins = Math.floor(v.duration / 60);
    return {
      id: v.id, // Use actual youtube ID as material ID for ease of use
      classId,
      title: v.title,
      type: 'video',
      description: `Materi video pembelajaran: ${v.title}. Dibimbing langsung oleh Apoteker Rahmato.`,
      durationOrPages: `${mins} Menit`,
      content: `### Panduan Pembelajaran Video\n\n[VIDEO PEMBELAJARAN TERSEDIA]\nDurasi Pembelajaran: ${mins} Menit\nDibimbing langsung oleh: **Apoteker Rahmato**\n\nMateri ini merupakan bagian dari silabus ${className}.`,
      youtubeId: v.id
    };
  });

  // [MOCK DATA] Seeded for demo — replace with Supabase query when backend ready
  const extraMaterials: Material[] = isAdvance ? [
    {
      id: `${classId}-mat-intro-pdf`,
      classId,
      title: 'Advanced Clinical Pharmacy Manual',
      type: 'pdf',
      description: 'Panduan komprehensif farmasi klinis tingkat lanjut: farmakokinetika, TDM, dan manajemen terapi kritis.',
      durationOrPages: '48 Halaman',
      content: `### Advanced Clinical Pharmacy Manual\n\nPada pasien dengan gangguan fungsi ginjal, terjadi penurunan laju filtrasi glomerulus (GFR) yang berdampak signifikan pada eliminasi obat.\n\n#### Rumus Cockcroft-Gault:\n\`\`\`\nCrCl (pria) = ((140 - usia) x BB) / (72 x SCr)\nCrCl (wanita) = CrCl pria x 0.85\n\`\`\`\n\n#### Strategi Penyesuaian Dosis:\n1. **Dose Reduction** — interval tetap, dosis dikurangi\n2. **Interval Extension** — dosis tetap, jarak diperpanjang (cocok untuk aminoglikosida)\n\n#### Vancomycin TDM:\n- Target AUC/MIC 400–600 mg·h/L (ASHP/IDSA 2020)\n- Monitoring: peak 1–2 jam post-infus, trough 30 menit pre-dosis\n\nSelalu konsultasikan dengan tim farmasi klinis untuk TDM kompleks.`,
    },
    {
      id: `${classId}-mat-icu-protocols-pdf`,
      classId,
      title: 'ICU Drug Protocols — High-Alert Medications',
      type: 'pdf',
      description: 'Protokol obat high-alert di ICU: vasopressor, sedasi, antikoagulan, dan nutrisi parenteral.',
      durationOrPages: '36 Halaman',
      content: `### ICU Drug Protocols\n\n#### High-Alert Medications (ISMP):\n- **Vasopressor:** Norepinefrin, Dopamin — titrasi berbasis MAP target >65 mmHg\n- **Sedasi:** Propofol, Midazolam — RASS score target -2 sampai 0\n- **Antikoagulan:** Heparin unfractionated — monitoring aPTT 60–100 detik\n- **Insulin infus:** Target glukosa ICU 140–180 mg/dL (NICE-SUGAR)\n\n#### Parenteral Nutrition Calculation:\n- Kalori: 25–30 kkal/kgBB/hari\n- Protein: 1.2–2.0 g/kgBB/hari\n- Fase akut awal: permissive underfeeding 70–80% target\n\nSemua obat IV di ICU wajib double-check oleh dua petugas sebelum pemberian.`,
    },
    {
      id: `${classId}-mat-midterm-quiz`,
      classId,
      title: 'Evaluasi Mid-Modul Advance',
      type: 'quiz',
      description: 'Ujian tengah modul untuk memastikan pemahaman materi farmakokinetika dan terapi kritis sebelum lanjut ke sesi berikutnya.',
      durationOrPages: '5 Pertanyaan',
      content: `Ujian mid-modul ini mencakup materi ICU pharmacy, Vancomycin TDM, farmakokinetika klinik, dan kalkulasi dosis renal. Pilih satu jawaban paling tepat.`,
    },
  ] : [
    {
      id: `${classId}-mat-intro-pdf`,
      classId,
      title: 'Modul 1: Dasar Farmasi Klinis',
      type: 'pdf',
      description: 'Panduan dasar pelayanan kefarmasian: pharmaceutical care, dispensing SOP, dan komunikasi informasi obat.',
      durationOrPages: '32 Halaman',
      content: `### Dasar Pelayanan Kefarmasian (Pharmaceutical Care)\n\nPelayanan Kefarmasian adalah pelayanan langsung dan bertanggung jawab kepada pasien dengan maksud mencapai hasil yang pasti untuk meningkatkan mutu kehidupan pasien.\n\n#### Drug Therapy Problems (DTPs) menurut PCNE:\n- Terapi tidak efektif\n- Efek samping obat\n- Overdosis / Underdosis\n- Ketidakpatuhan pasien\n- Indikasi tidak diobati\n\n#### Three Prime Questions Counseling:\n1. Apa yang dokter katakan tentang kegunaan obat ini?\n2. Bagaimana cara menggunakannya?\n3. Apa yang diharapkan setelah menggunakannya?\n\nSebagai apoteker, kita wajib menerapkan patient-centered care di setiap interaksi.`,
    },
    {
      id: `${classId}-mat-eso-pdf`,
      classId,
      title: 'Panduan ESO Reporting & Swamedikasi',
      type: 'pdf',
      description: 'Panduan lengkap pelaporan Efek Samping Obat (MESO) ke BPOM dan prinsip swamedikasi aman.',
      durationOrPages: '24 Halaman',
      content: `### Panduan MESO Reporting\n\n#### Langkah Pelaporan e-MESO BPOM:\n1. Akses eMESO.pom.go.id\n2. Login dengan akun tenaga kesehatan\n3. Isi formulir: data pasien (anonim), obat tersangka, reaksi, kronologi\n4. Submit dan simpan nomor laporan\n\n#### Red Flag Swamedikasi (WAJIB RUJUK):\n- Demam >3 hari tidak membaik\n- Dahak kuning/hijau (infeksi bakteri)\n- Sesak napas atau nyeri dada\n- Pasien lansia, DM, imunokompromi\n- Anak <2 tahun dengan demam\n\n#### Prinsip Swamedikasi Aman:\nHanya untuk self-limiting disease ringan <3 hari. Lebih dari itu, edukasi dan rujuk ke dokter.`,
    },
    {
      id: `${classId}-mat-midterm-quiz`,
      classId,
      title: 'Evaluasi Mid-Modul Reguler',
      type: 'quiz',
      description: 'Ujian tengah modul untuk memastikan pemahaman materi dasar farmasi klinis sebelum lanjut ke studi kasus.',
      durationOrPages: '5 Pertanyaan',
      content: `Ujian mid-modul mencakup materi pharmaceutical care, kalkulasi dosis, dispensing, dan konseling pasien. Pilih satu jawaban paling tepat.`,
    },
  ];

  return [
    extraMaterials[0], // intro pdf
    ...videoMaterials,
    extraMaterials[1], // second pdf
    extraMaterials[2], // mid-term quiz
    {
      id: `${classId}-mat-quiz`,
      classId,
      title: isAdvance ? 'Evaluasi Akhir Advance Module' : 'Evaluasi Akhir Modul',
      type: 'quiz',
      description: 'Lakukan evaluasi pemahaman modul dengan mengerjakan ujian studi kasus nyata. Kelulusan minimum adalah nilai 75.',
      durationOrPages: '5 Pertanyaan',
      content: `Ujian ini menguji seluruh kompetensi materi yang sudah dibahas pada video modul. Selesaikan studi kasus di bawah ini dengan memilih satu jawaban paling tepat.`
    }
  ];
};

export const QUIZ_TEMPLATES: Record<string, Quiz> = {
  reguler: {
    id: 'quiz-reguler',
    classId: '',
    title: 'Evaluasi Komprehensif Kelas Reguler',
    passingScore: 75,
    questions: [
      {
        id: 'q-reg1',
        question: 'Metode konseling yang melibatkan tiga pertanyaan kunci ("Three Prime Questions") bertujuan untuk menggali pemahaman pasien tentang obat. Tiga pertanyaan tersebut menanyakan hal berikut, KECUALI...',
        options: [
          'Bagaimana penjelasan dokter tentang kegunaan obat ini?',
          'Bagaimana cara dokter menjelaskan penggunaan obat ini?',
          'Apa efek samping berbahaya yang diberitahukan dokter kepada Anda?',
          'Bagaimana penjelasan dokter tentang harapan setelah minum obat ini?'
        ],
        correctOption: 2,
        explanation: 'Three Prime Questions mencakup: 1. Apa yang dikatakan dokter tentang obat Anda (kegunaan/tujuan)? 2. Bagaimana cara minum/menggunakannya? 3. Apa yang diharapkan setelah menggunakannya? Menanyakan efek samping secara terpisah tidak termasuk dalam format standar TPQ awal.'
      },
      {
        id: 'q-reg2',
        question: 'Seorang pasien anak (BB 12 kg) didiagnosis demam dan diresepkan Paracetamol sirup (120 mg/5 mL) dengan dosis 10 mg/kgBB per kali pemberian. Berapa volume (mL) sirup sekali minum?',
        options: [
          '2.5 mL',
          '5.0 mL',
          '7.5 mL',
          '10 mL'
        ],
        correctOption: 1,
        explanation: 'Dosis sekali minum = 12 kg x 10 mg/kg = 120 mg. Sediaan sirup memiliki kadar 120 mg per 5 mL. Maka, pasien membutuhkan tepat 5 mL sekali pemberian.'
      },
      {
        id: 'q-reg3',
        question: 'Sesuai dengan pedoman BUD (Beyond Use Date) USP <795>, sediaan puyer/kapsul racikan kering non-air yang diracik dari tablet paten dengan ED 2 tahun lagi memiliki BUD maksimal selama...',
        options: [
          '14 Hari',
          '30 Hari',
          '6 Bulan',
          '1 Tahun'
        ],
        correctOption: 2,
        explanation: 'Berdasarkan USP <795>, sediaan non-air padat racikan dari obat jadi pabrikan memiliki BUD maksimal 25% dari waktu kedaluwarsa tersisa atau 6 bulan, mana yang lebih cepat. Karena 25% dari 2 tahun adalah 6 bulan, maka BUD-nya maksimal 6 bulan.'
      },
      {
        id: 'q-reg4',
        question: 'Manakah dari obat berikut yang termasuk dalam golongan Obat Wajib Apoteker (OWA No. 1) yang dapat diserahkan langsung oleh Apoteker tanpa resep dokter untuk pengobatan maag akut?',
        options: [
          'Famotidine',
          'Lansoprazole',
          'Sucralfate',
          'Metoclopramide'
        ],
        correctOption: 0,
        explanation: 'Famotidine (antagonis H2) termasuk dalam daftar OWA No. 1 dengan batas maksimal 10 tablet per penyerahan. Sedangkan PPI generasi baru atau obat saluran pencernaan lain memiliki regulasi rujukan resep yang berbeda atau masuk golongan obat keras umum.'
      },
      {
        id: 'q-reg5',
        question: 'Asuhan kefarmasian (Pharmaceutical care) berpusat pada pencapaian hasil terapi yang optimal. Jika pasien diresepkan Amoxicillin namun berhenti minum setelah hari ke-2 karena merasa sudah sembuh, masalah terapi obat (DTP) yang terjadi adalah...',
        options: [
          'Terapi tanpa indikasi',
          'Ketidakpatuhan pasien (Non-compliance)',
          'Efek samping obat',
          'Pemilihan obat tidak tepat'
        ],
        correctOption: 1,
        explanation: 'Menghentikan pengobatan antibiotik secara sepihak sebelum habis dikategorikan sebagai ketidakpatuhan pasien (non-compliance) yang berisiko memicu resistensi bakteri.'
      }
    ]
  },
  advance: {
    id: 'quiz-advance',
    classId: '',
    title: 'Evaluasi Klinis Kelas Advance',
    passingScore: 75,
    questions: [
      {
        id: 'q-adv1',
        question: 'Pasien laki-laki 72 tahun (BB 60 kg) dengan Serum Kreatinin 2.0 mg/dL diresepkan antibiotik Gentamicin. Hitung klirens kreatinin (CrCl) pasien menggunakan rumus Cockcroft-Gault.',
        options: [
          '15.4 mL/menit',
          '28.3 mL/menit',
          '42.5 mL/menit',
          '56.0 mL/menit'
        ],
        correctOption: 1,
        explanation: 'CrCl = ((140 - 72) x 60) / (72 x 2.0) = (68 x 60) / 144 = 4080 / 144 = 28.33 mL/menit.'
      },
      {
        id: 'q-adv2',
        question: 'Penggunaan antibiotik aminoglikosida pada pasien gangguan fungsi ginjal dengan metode interval diperpanjang memanfaatkan sifat farmakodinamika khas obat ini, yaitu...',
        options: [
          'Time-dependent killing',
          'Concentration-dependent killing & Post-Antibiotic Effect (PAE) yang panjang',
          'Synergistic interaction dengan NSAID',
          'Penurunan ikatan protein plasma'
        ],
        correctOption: 1,
        explanation: 'Aminoglikosida memiliki aktivitas pembunuhan bakteri yang bergantung pada konsentrasi puncak (concentration-dependent) dan efek pasca-antibiotik (PAE) yang lama, memungkinkan pemberian dosis tunggal harian yang tinggi bahkan dengan klirens kreatinin rendah dengan memperpanjang interval pemberian.'
      },
      {
        id: 'q-adv3',
        question: 'Pada studi klinis PATHWAY-2 untuk penatalaksanaan Hipertensi Resisten, obat manakah yang terbukti secara signifikan paling efektif sebagai terapi tambahan keempat (lini ke-4)?',
        options: [
          'Amlodipine',
          'Spironolactone',
          'Clonidine',
          'Furosemide'
        ],
        correctOption: 1,
        explanation: 'Studi PATHWAY-2 membuktikan bahwa antagonis aldosteron Spironolactone (12.5-50 mg/hari) adalah obat tambahan lini keempat yang paling efektif untuk mengontrol hipertensi resisten dibandingkan plasebo, bisoprolol, atau doxazosin.'
      },
      {
        id: 'q-adv4',
        question: 'Manakah dari kombinasi obat berikut yang memiliki interaksi farmakodinamik sinergis yang sangat kritis terhadap risiko hiperkalemia berat jika tidak dimonitor ketat?',
        options: [
          'Lisinopril + Spironolactone',
          'Atorvastatin + Clopidogrel',
          'Metformin + Glimepiride',
          'Ciprofloxacin + Antasida'
        ],
        correctOption: 0,
        explanation: 'Kombinasi ACE-Inhibitor (Lisinopril) dengan Aldosterone Antagonist (Spironolactone) sama-sama menghambat sekresi aldosteron, secara langsung menurunkan ekskresi kalium ginjal, sehingga meningkatkan risiko hiperkalemia yang berbahaya pada jantung.'
      },
      {
        id: 'q-adv5',
        question: 'Indeks terapi sempit (Narrow Therapeutic Index) memerlukan monitoring terapeutik obat (TDM). Di antara obat kardiovaskular berikut, yang paling mendesak diawasi kadarnya untuk menghindari toksisitas aritmia fatal adalah...',
        options: [
          'Bisoprolol',
          'Digoxin',
          'Captopril',
          'Valsartan'
        ],
        correctOption: 1,
        explanation: 'Digoxin memiliki indeks terapi sempit (rentang terapeutik 0.5 - 2.0 ng/mL). Kadar di atas 2.0 ng/mL dapat memicu toksisitas glikosida berupa mual berat, gangguan penglihatan warna kuning-hijau, hingga aritmia jantung yang berakibat kematian.'
      }
    ]
  }
};

// [MOCK DATA] Seeded for demo — replace with Supabase query when backend ready
export const DEFAULT_STUDENTS: User[] = [
  {
    id: 'student-farhan',
    name: 'dr. Farhan Malik',
    email: 'farhan.malik@gmail.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=60',
    profession: 'Dokter',
    enrolledClasses: ['gen6-advance-a', 'gen6-reguler-b'],
    completedClasses: ['gen6-reguler-a'],
    isActive: true,
  },
  {
    id: 'student-siti',
    name: 'Siti Aminah, S.Farm',
    email: 'siti.aminah@gmail.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=150&auto=format&fit=crop&q=60',
    profession: 'Mahasiswa',
    enrolledClasses: ['gen6-reguler-a'],
    completedClasses: [],
    isActive: true,
  },
  {
    id: 'student-budi',
    name: 'Budi Santoso, Apt',
    email: 'budi.santoso@gmail.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=60',
    profession: 'Apoteker',
    enrolledClasses: ['gen6-advance-b'],
    completedClasses: ['gen5-paket-c', 'gen6-advance-c'],
    isActive: true,
  },
  // --- 27 additional students seeded for demo ---
  {
    id: 'student-ahmad-fauzan',
    name: 'dr. Ahmad Fauzan',
    email: 'ahmad.fauzan@rs-medistra.co.id',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=60',
    profession: 'Dokter',
    enrolledClasses: ['gen6-advance-a', 'gen6-advance-b'],
    completedClasses: ['gen5-paket-a'],
    isActive: true,
  },
  {
    id: 'student-rini-pratiwi',
    name: 'dr. Rini Pratiwi',
    email: 'rini.pratiwi@rs-siloam.co.id',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60',
    profession: 'Dokter',
    enrolledClasses: ['gen6-advance-c'],
    completedClasses: ['gen5-paket-b', 'gen5-paket-c'],
    isActive: true,
  },
  {
    id: 'student-dewi-kusuma',
    name: 'Apt. Dewi Kusuma',
    email: 'dewi.kusuma@gmail.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=150&auto=format&fit=crop&q=60',
    profession: 'Apoteker',
    enrolledClasses: ['gen6-reguler-a', 'gen6-advance-a'],
    completedClasses: [],
    isActive: true,
  },
  {
    id: 'student-budi-hartono',
    name: 'Apt. Budi Hartono',
    email: 'budi.hartono@apotek-kimiafarma.co.id',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=60',
    profession: 'Apoteker',
    enrolledClasses: ['gen6-reguler-b'],
    completedClasses: ['gen5-paket-a', 'gen5-paket-b'],
    isActive: true,
  },
  {
    id: 'student-maya-sari',
    name: 'Ns. Maya Sari',
    email: 'maya.sari@rs-islam.co.id',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=150&auto=format&fit=crop&q=60',
    profession: 'Perawat',
    enrolledClasses: ['gen6-reguler-a'],
    completedClasses: [],
    isActive: true,
  },
  {
    id: 'student-rizki-ramadhan',
    name: 'Apt. Rizki Ramadhan',
    email: 'rizki.ramadhan@gmail.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=60',
    profession: 'Apoteker',
    enrolledClasses: ['gen6-advance-b', 'gen6-reguler-c'],
    completedClasses: ['gen5-paket-c'],
    isActive: true,
  },
  {
    id: 'student-laila-fitriani',
    name: 'dr. Laila Fitriani',
    email: 'laila.fitriani@rs-pondokindah.co.id',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60',
    profession: 'Dokter',
    enrolledClasses: ['gen6-advance-a'],
    completedClasses: ['gen5-paket-a'],
    isActive: true,
  },
  {
    id: 'student-hendra-wijaya',
    name: 'Apt. Hendra Wijaya',
    email: 'hendra.wijaya@apotek-guardian.co.id',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=60',
    profession: 'Apoteker',
    enrolledClasses: ['gen6-reguler-a', 'gen6-reguler-b'],
    completedClasses: [],
    isActive: true,
  },
  {
    id: 'student-siti-rahayu',
    name: 'Ns. Siti Rahayu',
    email: 'siti.rahayu@puskesmas-kebayoran.co.id',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=150&auto=format&fit=crop&q=60',
    profession: 'Perawat',
    enrolledClasses: ['gen6-reguler-c'],
    completedClasses: [],
    isActive: true,
  },
  {
    id: 'student-dian-purnama',
    name: 'Apt. Dian Purnama',
    email: 'dian.purnama@gmail.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=150&auto=format&fit=crop&q=60',
    profession: 'Apoteker',
    enrolledClasses: ['gen6-advance-c'],
    completedClasses: ['gen5-paket-b'],
    isActive: true,
  },
  {
    id: 'student-fajar-nugroho',
    name: 'dr. Fajar Nugroho',
    email: 'fajar.nugroho@rs-fatmawati.co.id',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=60',
    profession: 'Dokter',
    enrolledClasses: ['gen6-advance-b'],
    completedClasses: ['gen5-paket-a', 'gen5-paket-b'],
    isActive: true,
  },
  {
    id: 'student-indah-permata',
    name: 'Apt. Indah Permata',
    email: 'indah.permata@rsmarihenni.co.id',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&auto=format&fit=crop&q=60',
    profession: 'Apoteker',
    enrolledClasses: ['gen6-reguler-b', 'gen6-advance-a'],
    completedClasses: [],
    isActive: true,
  },
  {
    id: 'student-agus-setiawan',
    name: 'Ns. Agus Setiawan',
    email: 'agus.setiawan@rs-tebet.co.id',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=60',
    profession: 'Perawat',
    enrolledClasses: ['gen6-reguler-a'],
    completedClasses: [],
    isActive: false,
  },
  {
    id: 'student-novia-anggraini',
    name: 'Apt. Novia Anggraini',
    email: 'novia.anggraini@gmail.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60',
    profession: 'Apoteker',
    enrolledClasses: ['gen6-reguler-c', 'gen6-advance-c'],
    completedClasses: ['gen5-paket-c'],
    isActive: true,
  },
  {
    id: 'student-yusuf-hakim',
    name: 'dr. Yusuf Hakim',
    email: 'yusuf.hakim@rs-cikini.co.id',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=60',
    profession: 'Dokter',
    enrolledClasses: ['gen6-advance-a', 'gen6-advance-c'],
    completedClasses: ['gen5-paket-a'],
    isActive: true,
  },
  {
    id: 'student-putri-wulandari',
    name: 'Apt. Putri Wulandari',
    email: 'putri.wulandari@apotek-century.co.id',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&auto=format&fit=crop&q=60',
    profession: 'Apoteker',
    enrolledClasses: ['gen6-reguler-a'],
    completedClasses: [],
    isActive: true,
  },
  {
    id: 'student-eko-prasetyo',
    name: 'Ns. Eko Prasetyo',
    email: 'eko.prasetyo@rsud-tangerang.co.id',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=60',
    profession: 'Perawat',
    enrolledClasses: ['gen6-reguler-b'],
    completedClasses: [],
    isActive: true,
  },
  {
    id: 'student-fitri-handayani',
    name: 'Apt. Fitri Handayani',
    email: 'fitri.handayani@gmail.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=150&auto=format&fit=crop&q=60',
    profession: 'Apoteker',
    enrolledClasses: ['gen6-advance-b', 'gen6-reguler-a'],
    completedClasses: ['gen5-paket-b'],
    isActive: true,
  },
  {
    id: 'student-bagas-prasetya',
    name: 'dr. Bagas Prasetya',
    email: 'bagas.prasetya@rs-premier-bintaro.co.id',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=60',
    profession: 'Dokter',
    enrolledClasses: ['gen6-advance-a'],
    completedClasses: ['gen5-paket-a', 'gen5-paket-b', 'gen5-paket-c'],
    isActive: true,
  },
  {
    id: 'student-lestari-ningrum',
    name: 'Apt. Lestari Ningrum',
    email: 'lestari.ningrum@rsia-bunda.co.id',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=150&auto=format&fit=crop&q=60',
    profession: 'Apoteker',
    enrolledClasses: ['gen6-reguler-c'],
    completedClasses: [],
    isActive: true,
  },
  {
    id: 'student-deni-firmansyah',
    name: 'Ns. Deni Firmansyah',
    email: 'deni.firmansyah@rsud-depok.co.id',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=60',
    profession: 'Perawat',
    enrolledClasses: ['gen6-reguler-a', 'gen6-reguler-b'],
    completedClasses: [],
    isActive: false,
  },
  {
    id: 'student-mira-andriani',
    name: 'Apt. Mira Andriani',
    email: 'mira.andriani@gmail.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&auto=format&fit=crop&q=60',
    profession: 'Apoteker',
    enrolledClasses: ['gen6-advance-c', 'gen6-reguler-c'],
    completedClasses: ['gen5-paket-a'],
    isActive: true,
  },
  {
    id: 'student-wahyu-saputra',
    name: 'dr. Wahyu Saputra',
    email: 'wahyu.saputra@rs-omni.co.id',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=60',
    profession: 'Dokter',
    enrolledClasses: ['gen6-advance-b', 'gen6-advance-c'],
    completedClasses: ['gen5-paket-b'],
    isActive: true,
  },
  {
    id: 'student-cindy-ramadhani',
    name: 'Apt. Cindy Ramadhani',
    email: 'cindy.ramadhani@apotek-k24.co.id',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60',
    profession: 'Apoteker',
    enrolledClasses: ['gen6-reguler-b', 'gen6-reguler-c'],
    completedClasses: [],
    isActive: true,
  },
  {
    id: 'student-faisal-arifin',
    name: 'Ns. Faisal Arifin',
    email: 'faisal.arifin@rskb-bogor.co.id',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=60',
    profession: 'Perawat',
    enrolledClasses: ['gen6-reguler-c'],
    completedClasses: [],
    isActive: true,
  },
  {
    id: 'student-yeni-kurniawati',
    name: 'Apt. Yeni Kurniawati',
    email: 'yeni.kurniawati@gmail.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=150&auto=format&fit=crop&q=60',
    profession: 'Apoteker',
    enrolledClasses: ['gen6-advance-a', 'gen6-reguler-a'],
    completedClasses: ['gen5-paket-c'],
    isActive: true,
  },
  {
    id: 'student-teguh-wibowo',
    name: 'dr. Teguh Wibowo',
    email: 'teguh.wibowo@rs-eka-hospital.co.id',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=60',
    profession: 'Dokter',
    enrolledClasses: ['gen6-advance-b'],
    completedClasses: ['gen5-paket-a', 'gen5-paket-b'],
    isActive: true,
  },
  {
    id: 'student-rahma-aulia',
    name: 'Rahma Aulia, S.Farm',
    email: 'rahma.aulia@gmail.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=150&auto=format&fit=crop&q=60',
    profession: 'Mahasiswa',
    enrolledClasses: ['gen6-reguler-a'],
    completedClasses: [],
    isActive: true,
  },
  {
    id: 'student-farida-hanum',
    name: 'Farida Hanum, S.Farm',
    email: 'farida.hanum@gmail.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&auto=format&fit=crop&q=60',
    profession: 'Mahasiswa',
    enrolledClasses: ['gen6-reguler-b'],
    completedClasses: [],
    isActive: true,
  },
  {
    id: 'student-kevin-oktavian',
    name: 'Kevin Oktavian, S.Farm',
    email: 'kevin.oktavian@gmail.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=60',
    profession: 'Mahasiswa',
    enrolledClasses: ['gen6-reguler-c', 'gen6-reguler-a'],
    completedClasses: [],
    isActive: true,
  },
  {
    id: 'student-ayu-widiastuti',
    name: 'Bidan Ayu Widiastuti',
    email: 'ayu.widiastuti@puskesmas-johar.co.id',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60',
    profession: 'Bidan',
    enrolledClasses: ['gen6-reguler-a'],
    completedClasses: [],
    isActive: true,
  },
];

// [MOCK DATA] Seeded for demo — replace with Supabase query when backend ready
export const DEFAULT_FORUM_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    classId: 'gen6-reguler-a',
    userId: 'student-siti',
    userName: 'Siti Aminah, S.Farm',
    userRole: 'student',
    userProfession: 'Mahasiswa',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=150&auto=format&fit=crop&q=60',
    title: 'Pertanyaan mengenai BUD Puyer racikan jika tablet aslinya tidak punya info kedaluwarsa lengkap',
    content: 'Assalamu alaikum sejawat, izin bertanya. Pada racikan puyer anak, jika kita menggunakan tablet yang diambil dari strip/blister luar namun tanggal kedaluwarsanya terpotong atau tidak terbaca dengan jelas, bagaimana cara kita menetapkan Beyond Use Date yang aman? Terima kasih.',
    createdAt: '2026-07-05T10:30:00Z',
    replies: [
      {
        id: 'reply-1',
        userId: 'mentor-rahmato',
        userName: 'Apoteker Rahmato',
        userRole: 'mentor',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=60',
        content: 'Wa alaikumussalam Wr Wb Siti. Pertanyaan praktis yang sangat bagus! Secara aturan professional, bila kedaluwarsa bahan obat asal tidak diketahui dengan pasti, kita dilarang berasumsi. Sebaiknya ganti dengan strip baru yang tanggal kedaluwarsanya terbaca jelas demi keamanan pasien. Namun bila dalam situasi darurat dan sediaannya homogen stabil, jangan menetapkan BUD melebihi batas terpendek, bahkan idealnya tidak direkomendasikan meracik obat tanpa kepastian ED. Utamakan Patient Safety.',
        createdAt: '2026-07-05T14:15:00Z'
      }
    ]
  },
  {
    id: 'post-2',
    classId: 'gen6-advance-a',
    userId: 'student-farhan',
    userName: 'dr. Farhan Malik',
    userRole: 'student',
    userProfession: 'Dokter',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=60',
    title: 'Interaksi Ceftriaxone & Kalsium Intravena pada Pasien Geriatri ICU',
    content: 'Dokter sejawat dan Apoteker Rahmato, saya sempat membaca literatur mengenai kontraindikasi pemberian Ceftriaxone bersamaan dengan cairan infus yang mengandung Kalsium (seperti Ringer Laktat) karena risiko presipitasi kalsium-ceftriaxone yang mematikan pada paru dan ginjal anak-anak. Apakah kejadian presipitasi ini juga sangat berisiko terjadi pada pasien dewasa/geriatri di ICU? Bagaimana pencegahannya?',
    createdAt: '2026-07-06T08:20:00Z',
    replies: [
      {
        id: 'reply-2',
        userId: 'mentor-rahmato',
        userName: 'Apoteker Rahmato',
        userRole: 'mentor',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=60',
        content: 'Salam dr. Farhan. Betul sekali. Pada neonatus, kontraindikasinya mutlak (tidak boleh diberikan bersamaan maupun bergantian meskipun lewat line berbeda). Pada pasien dewasa/geriatri, presipitasi masih bisa terjadi di dalam sirkulasi darah. Rekomendasinya: gunakan line infus yang berbeda jika terpaksa memberikan kedua zat tersebut, dan pastikan dilakukan pembilasan (flushing) dengan cairan NaCl fisiologis 0.9% secara adekuat di antara kedua infus jika menggunakan saluran yang sama.',
        createdAt: '2026-07-06T11:05:00Z'
      },
      {
        id: 'reply-3',
        userId: 'student-budi',
        userName: 'Budi Santoso, Apt',
        userRole: 'student',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=60',
        content: 'Terima kasih penjelasannya Pak Rahmato. Diskusi ini sangat membuka mata kami yang bertugas di bangsal pelayanan intensif.',
        createdAt: '2026-07-06T13:45:00Z'
      }
    ]
  },
  {
    id: 'post-3',
    classId: 'gen6-reguler-b',
    userId: 'student-dewi-kusuma',
    userName: 'Apt. Dewi Kusuma',
    userRole: 'student',
    userProfession: 'Apoteker',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=150&auto=format&fit=crop&q=60',
    title: 'Dosis Metformin pada Pasien CKD Stage 3 — Aman atau Kontraindikasi?',
    content: 'Selamat pagi rekan-rekan. Saya ingin bertanya mengenai penggunaan Metformin pada pasien DM tipe 2 yang juga menderita CKD stage 3 (eGFR 30-59 mL/menit). Apakah masih boleh dilanjutkan? Beberapa referensi berbeda pendapat soal ini.',
    createdAt: '2026-06-28T08:10:00Z',
    replies: [
      {
        id: 'reply-4',
        userId: 'mentor-rahmato',
        userName: 'Apoteker Rahmato',
        userRole: 'mentor',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=60',
        content: 'Pertanyaan sangat relevan, Dewi. Berdasarkan update guideline terbaru, Metformin masih boleh digunakan pada CKD G3a (eGFR 45-59) dengan dosis dikurangi 50%, namun dikontraindikasikan pada G3b ke bawah (eGFR <45) karena risiko akumulasi laktat yang memicu asidosis laktat fatal. Selalu cek eGFR sebelum meresepkan dan saat follow-up rutin.',
        createdAt: '2026-06-28T11:30:00Z'
      },
      {
        id: 'reply-5',
        userId: 'student-budi-hartono',
        userName: 'Apt. Budi Hartono',
        userRole: 'student',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=60',
        content: 'Tambahan: jangan lupa hentikan Metformin 48 jam sebelum prosedur yang menggunakan kontras iodinasi (CT scan dengan kontras) untuk mencegah nefropati kontras + akumulasi Metformin.',
        createdAt: '2026-06-28T13:00:00Z'
      }
    ]
  },
  {
    id: 'post-4',
    classId: 'gen6-advance-b',
    userId: 'student-rizki-ramadhan',
    userName: 'Apt. Rizki Ramadhan',
    userRole: 'student',
    userProfession: 'Apoteker',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=60',
    title: 'Monitoring Warfarin + Antibiotik — INR Melonjak Tiba-tiba',
    content: 'Pak Rahmato, saya punya kasus pasien AF yang stabil dengan Warfarin (target INR 2-3), tiba-tiba INR naik ke 4.8 setelah diberi Ciprofloxacin 7 hari. Mohon penjelasan mekanismenya dan langkah manajemennya.',
    createdAt: '2026-06-25T14:20:00Z',
    replies: [
      {
        id: 'reply-6',
        userId: 'mentor-rahmato',
        userName: 'Apoteker Rahmato',
        userRole: 'mentor',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=60',
        content: 'Interaksi Warfarin-Fluorokuinolon ini sangat klasik. Ciprofloxacin menghambat CYP1A2 dan CYP3A4 yang memetabolisme Warfarin, plus mengurangi flora usus penghasil Vitamin K. Manajemen: segera periksa INR, jika >4 tanpa perdarahan → tahan Warfarin 1-2 dosis, jika perdarahan aktif → berikan Vitamin K1 IV + pertimbangkan PCC (Prothrombin Complex Concentrate).',
        createdAt: '2026-06-25T16:45:00Z'
      },
      {
        id: 'reply-7',
        userId: 'student-wahyu-saputra',
        userName: 'dr. Wahyu Saputra',
        userRole: 'student',
        userProfession: 'Dokter',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=60',
        content: 'Sangat berguna! Ini sering terjadi di bangsal karena dokter penulis resep tidak selalu cek list obat Warfarin sebelum meresepkan antibiotik.',
        createdAt: '2026-06-25T18:10:00Z'
      },
      {
        id: 'reply-8',
        userId: 'student-rizki-ramadhan',
        userName: 'Apt. Rizki Ramadhan',
        userRole: 'student',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=60',
        content: 'Terima kasih Pak! Kasus sudah teratasi. INR pasien turun ke 2.6 setelah tahan 1 dosis dan cek ulang 48 jam kemudian.',
        createdAt: '2026-06-26T09:00:00Z'
      }
    ]
  },
  {
    id: 'post-5',
    classId: 'gen6-reguler-a',
    userId: 'student-maya-sari',
    userName: 'Ns. Maya Sari',
    userRole: 'student',
    userProfession: 'Perawat',
    avatar: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=150&auto=format&fit=crop&q=60',
    title: 'Cara Membaca Resep ICU — Singkatan yang Membingungkan',
    content: 'Halo, saya perawat yang baru rotasi ke ICU. Ada beberapa singkatan di resep yang masih asing untuk saya: "IVFD D5 ½NS 20 gtt/mnt", "KCl 25 mEq dalam 250 mL NaCl drip 8 jam". Bisakah dijelaskan?',
    createdAt: '2026-06-22T09:15:00Z',
    replies: [
      {
        id: 'reply-9',
        userId: 'mentor-rahmato',
        userName: 'Apoteker Rahmato',
        userRole: 'mentor',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=60',
        content: 'Salam Maya. IVFD = Intravenous Fluid Drip (cairan infus intravena). D5 ½NS = Dextrose 5% dalam larutan NaCl 0.45% (half normal saline). 20 gtt/mnt = 20 tetes per menit (faktor tetes makro 20 gtt/mL = 60 mL/jam). KCl 25 mEq dalam 250 mL drip 8 jam = infus kalium klorida untuk koreksi hipokalemia — kecepatan tidak boleh >20 mEq/jam untuk cegah aritmia.',
        createdAt: '2026-06-22T11:00:00Z'
      },
      {
        id: 'reply-10',
        userId: 'student-hendra-wijaya',
        userName: 'Apt. Hendra Wijaya',
        userRole: 'student',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=60',
        content: 'Tambahan: selalu verifikasi ulang dengan apoteker atau farmasi klinik sebelum menyiapkan KCl IV karena termasuk high-alert medication.',
        createdAt: '2026-06-22T13:30:00Z'
      }
    ]
  },
  {
    id: 'post-6',
    classId: 'gen6-advance-a',
    userId: 'student-laila-fitriani',
    userName: 'dr. Laila Fitriani',
    userRole: 'student',
    userProfession: 'Dokter',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60',
    title: 'Kalkulasi Dosis Vancomycin TDM — Target AUC/MIC vs Trough',
    content: 'Mengikuti update ASHP/IDSA 2020, monitoring Vancomycin sekarang direkomendasikan menggunakan AUC/MIC bukan trough level. Bagaimana cara praktis menghitung AUC di rumah sakit yang belum punya software Bayesian?',
    createdAt: '2026-06-18T10:00:00Z',
    replies: [
      {
        id: 'reply-11',
        userId: 'mentor-rahmato',
        userName: 'Apoteker Rahmato',
        userRole: 'mentor',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=60',
        content: 'Pertanyaan sangat update, dr. Laila! Target AUC/MIC 400-600 mg·h/L. Untuk estimasi manual two-point PK: ambil kadar peak (1-2 jam setelah infus selesai) dan trough (30 menit sebelum dosis berikutnya). Hitung k_elim = (ln Cpeak - ln Ctrough) / interval antar pengambilan. AUC = (Cpeak + Ctrough) / 2 × interval dosis. Ini perkiraan kasar — idealnya gunakan software seperti ID-ODS atau konsultasi klinik farmasi.',
        createdAt: '2026-06-18T14:00:00Z'
      },
      {
        id: 'reply-12',
        userId: 'student-bagas-prasetya',
        userName: 'dr. Bagas Prasetya',
        userRole: 'student',
        userProfession: 'Dokter',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=60',
        content: 'RS kami sudah implementasi ini 6 bulan lalu. Hasilnya nefrotoksisitas turun signifikan dibanding era trough-only monitoring.',
        createdAt: '2026-06-18T16:20:00Z'
      }
    ]
  },
  {
    id: 'post-7',
    classId: 'gen6-reguler-c',
    userId: 'student-siti-rahayu',
    userName: 'Ns. Siti Rahayu',
    userRole: 'student',
    userProfession: 'Perawat',
    avatar: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=150&auto=format&fit=crop&q=60',
    title: 'Swamedikasi — Kapan Pasien Harus Dirujuk ke Dokter?',
    content: 'Sering ada pasien datang ke apotek minta obat sendiri untuk keluhan demam sudah 4 hari, batuk berlendir kuning, dan nyeri tenggorokan. Apakah apoteker boleh melayani swamedikasi atau wajib dirujuk?',
    createdAt: '2026-06-15T07:45:00Z',
    replies: [
      {
        id: 'reply-13',
        userId: 'mentor-rahmato',
        userName: 'Apoteker Rahmato',
        userRole: 'mentor',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=60',
        content: 'Pertanyaan penting! Ada "Red Flag" yang wajib dirujuk: demam >3 hari tidak membaik, dahak berwarna kuning/hijau (kemungkinan infeksi bakteri perlu antibiotik resep), sesak napas, nyeri dada, atau pasien risiko tinggi (lansia, DM, imunokompromi). Kasus yang Siti ceritakan masuk kategori HARUS dirujuk ke dokter, bukan swamedikasi.',
        createdAt: '2026-06-15T10:00:00Z'
      },
      {
        id: 'reply-14',
        userId: 'student-novia-anggraini',
        userName: 'Apt. Novia Anggraini',
        userRole: 'student',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60',
        content: 'Setuju Pak Rahmato. Prinsipnya: swamedikasi hanya untuk kondisi self-limiting disease ringan <3 hari. Lebih dari itu, edukasi dan rujuk.',
        createdAt: '2026-06-15T11:30:00Z'
      }
    ]
  },
  {
    id: 'post-8',
    classId: 'gen6-advance-c',
    userId: 'student-dian-purnama',
    userName: 'Apt. Dian Purnama',
    userRole: 'student',
    userProfession: 'Apoteker',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=150&auto=format&fit=crop&q=60',
    title: 'Antikoagulan pada Pasien AF + Penyakit Ginjal Kronis — NOAC vs Warfarin?',
    content: 'Pasien AF CKD stage 4 (eGFR 20-29). Kardiolog minta saran farmasi klinis: mana yang lebih aman, NOAC (Rivaroxaban/Apixaban) atau Warfarin? Ada yang punya pengalaman klinis?',
    createdAt: '2026-06-12T13:00:00Z',
    replies: [
      {
        id: 'reply-15',
        userId: 'mentor-rahmato',
        userName: 'Apoteker Rahmato',
        userRole: 'mentor',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=60',
        content: 'Pada CKD G4 (eGFR 15-29), guideline ESC 2023: Apixaban 2.5 mg 2x sehari direkomendasikan dengan hati-hati (masih ada studi mendukung), Rivaroxaban dan Dabigatran sebaiknya dihindari karena klirens ginjal signifikan. Warfarin tetap pilihan dengan monitoring INR ketat. Diskusikan risk-benefit bleeding vs stroke bersama tim multidisiplin.',
        createdAt: '2026-06-12T16:00:00Z'
      },
      {
        id: 'reply-16',
        userId: 'student-wahyu-saputra',
        userName: 'dr. Wahyu Saputra',
        userRole: 'student',
        userProfession: 'Dokter',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=60',
        content: 'Di RS kami, akhirnya tim memilih Warfarin dengan target INR 2-2.5 untuk pasien CKD G4, dengan edukasi ketat ke pasien dan keluarga soal tanda-tanda perdarahan.',
        createdAt: '2026-06-13T08:30:00Z'
      }
    ]
  },
  {
    id: 'post-9',
    classId: 'gen6-reguler-a',
    userId: 'student-rahma-aulia',
    userName: 'Rahma Aulia, S.Farm',
    userRole: 'student',
    userProfession: 'Mahasiswa',
    avatar: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=150&auto=format&fit=crop&q=60',
    title: 'Perbedaan Obat Generik, Generik Bermerek, dan Paten — Apakah Efektivitasnya Sama?',
    content: 'Pak Rahmato, sebagai mahasiswa saya sering ditanya pasien tentang perbedaan kualitas obat generik vs paten. Bagaimana cara menjelaskannya dengan tepat dan berbasis bukti?',
    createdAt: '2026-06-10T09:00:00Z',
    replies: [
      {
        id: 'reply-17',
        userId: 'mentor-rahmato',
        userName: 'Apoteker Rahmato',
        userRole: 'mentor',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=60',
        content: 'Penjelasan berbasis bukti: Obat generik wajib membuktikan bioekivalensi dengan obat paten (uji BE) — artinya kecepatan dan jumlah zat aktif yang diserap tubuh secara statistik setara (perbedaan ±20% masih diterima FDA/BPOM). Untuk obat indeks terapi sempit (Warfarin, Digoxin, Phenytoin, Levothyroxine), tetap konsisten menggunakan satu brand yang sama untuk mencegah fluktuasi kadar darah.',
        createdAt: '2026-06-10T11:15:00Z'
      },
      {
        id: 'reply-18',
        userId: 'student-putri-wulandari',
        userName: 'Apt. Putri Wulandari',
        userRole: 'student',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&auto=format&fit=crop&q=60',
        content: 'Makasih Pak! Saya sering pakai analogi ini ke pasien: bahan aktifnya sama persis, yang berbeda hanya kemasan dan harga — seperti beras premium vs beras biasa dari lahan yang sama.',
        createdAt: '2026-06-10T13:00:00Z'
      }
    ]
  },
  {
    id: 'post-10',
    classId: 'gen6-advance-a',
    userId: 'student-yeni-kurniawati',
    userName: 'Apt. Yeni Kurniawati',
    userRole: 'student',
    userProfession: 'Apoteker',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=150&auto=format&fit=crop&q=60',
    title: 'Antimicrobial Stewardship — Bagaimana Implementasi di RS Tipe C?',
    content: 'Saya sedang membentuk tim AMS di RS tipe C dengan sumber daya terbatas. Ada rekomendasi program prioritas yang bisa diimplementasikan dengan minimal 2 apoteker klinis dan 1 dokter spesialis?',
    createdAt: '2026-06-05T08:30:00Z',
    replies: [
      {
        id: 'reply-19',
        userId: 'mentor-rahmato',
        userName: 'Apoteker Rahmato',
        userRole: 'mentor',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=60',
        content: 'Program prioritas "Core Elements" WHO untuk RS sumber daya terbatas: 1) Formularium antibiotik berbasis lokal (AWaRe classification), 2) Audit resep antibiotik profilaksis bedah — pastikan stop dalam 24 jam, 3) Review penggunaan antibiotik broad-spectrum tiap 72 jam (de-eskalasi), 4) Edukasi dokter muda soal culture-guided therapy. Mulai dari 3 bangsal prioritas dulu, ukur DDD (Defined Daily Dose) sebelum dan sesudah.',
        createdAt: '2026-06-05T11:00:00Z'
      },
      {
        id: 'reply-20',
        userId: 'student-fajar-nugroho',
        userName: 'dr. Fajar Nugroho',
        userRole: 'student',
        userProfession: 'Dokter',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=60',
        content: 'RS kami mulai AMS dari profilaksis bedah saja dulu — hasilnya konsumsi Cefazolin turun 30% dalam 3 bulan. Penting juga dapat dukungan manajemen dari awal.',
        createdAt: '2026-06-05T14:00:00Z'
      }
    ]
  },
  {
    id: 'post-11',
    classId: 'gen6-reguler-b',
    userId: 'student-hendra-wijaya',
    userName: 'Apt. Hendra Wijaya',
    userRole: 'student',
    userProfession: 'Apoteker',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=60',
    title: 'MESO Reporting — Kendala di Lapangan dan Solusinya',
    content: 'Bapak/Ibu, apa pengalaman rekan-rekan dalam melaporkan MESO (Monitoring Efek Samping Obat) ke BPOM? Di apotek saya, apoteker sering lupa atau tidak tahu cara mengisi form e-MESO. Ada tips praktisnya?',
    createdAt: '2026-05-28T10:00:00Z',
    replies: [
      {
        id: 'reply-21',
        userId: 'mentor-rahmato',
        userName: 'Apoteker Rahmato',
        userRole: 'mentor',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=60',
        content: 'Kendala ini umum. Tips praktis: 1) Pasang link e-MESO BPOM di shortcut browser komputer apotek, 2) Buat SOP sederhana 5 langkah dengan screenshot di meja apoteker, 3) Gunakan prinsip "IF YOU SEE IT, REPORT IT" — bahkan suspek ringan pun dilaporkan, sistem yang akan memvalidasi kausalitasnya. Ingat: pelaporan MESO adalah kewajiban profesional sesuai UU Kefarmasian, bukan opsional.',
        createdAt: '2026-05-28T13:00:00Z'
      },
      {
        id: 'reply-22',
        userId: 'student-cindy-ramadhani',
        userName: 'Apt. Cindy Ramadhani',
        userRole: 'student',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60',
        content: 'Di apotek kami berhasil setelah membuat reminder WhatsApp otomatis setiap Jumat untuk cek kasus ESO minggu ini. Sederhana tapi efektif.',
        createdAt: '2026-05-28T15:30:00Z'
      }
    ]
  },
  {
    id: 'post-12',
    classId: 'gen6-advance-b',
    userId: 'student-fajar-nugroho',
    userName: 'dr. Fajar Nugroho',
    userRole: 'student',
    userProfession: 'Dokter',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=60',
    title: 'Parenteral Nutrition pada Pasien ICU — Kalkulasi Kebutuhan Kalori',
    content: 'Pasien ICU post-laparotomi hari ke-3, tidak bisa nutrisi enteral. BB 70 kg, tinggi 170 cm. Bagaimana cara menghitung kebutuhan kalori dan protein untuk Total Parenteral Nutrition (TPN)?',
    createdAt: '2026-05-20T09:00:00Z',
    replies: [
      {
        id: 'reply-23',
        userId: 'mentor-rahmato',
        userName: 'Apoteker Rahmato',
        userRole: 'mentor',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=60',
        content: 'Kalkulasi ASPEN/ESPEN untuk ICU: Kalori target = 25-30 kkal/kgBB/hari = 1750-2100 kkal/hari untuk pasien ini. Fase akut awal (hari 1-3): mulai hipokalorik 70-80% target (permissive underfeeding). Protein = 1.2-2.0 g/kgBB/hari = 84-140 g/hari. Komposisi TPN: Dextrose (maksimal 5 mg/kgBB/menit untuk hindari lipogenesis), Lipid emulsion 20-30% total kalori, AA solution. Ukur RQ jika ada indirect calorimetry.',
        createdAt: '2026-05-20T12:00:00Z'
      },
      {
        id: 'reply-24',
        userId: 'student-teguh-wibowo',
        userName: 'dr. Teguh Wibowo',
        userRole: 'student',
        userProfession: 'Dokter',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=60',
        content: 'Perlu ditambahkan monitoring glukosa ketat ya — target 140-180 mg/dL untuk ICU (NICE-SUGAR trial). Hindari hipoglikemia akibat insulin sliding scale agresif.',
        createdAt: '2026-05-20T14:30:00Z'
      }
    ]
  },
  {
    id: 'post-13',
    classId: 'gen6-reguler-c',
    userId: 'student-lestari-ningrum',
    userName: 'Apt. Lestari Ningrum',
    userRole: 'student',
    userProfession: 'Apoteker',
    avatar: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=150&auto=format&fit=crop&q=60',
    title: 'Studi Kasus: Pasien Hipertensi + DM Tipe 2 — Pilihan Antihipertensi Terbaik?',
    content: 'Pasien wanita 55 tahun, HbA1c 8.2%, TD 155/95 mmHg, tidak ada proteinuria, eGFR 68. Dokter bertanya rekomendasi farmasi klinis untuk antihipertensi. Apa pilihan utama sesuai guideline terbaru?',
    createdAt: '2026-05-15T10:30:00Z',
    replies: [
      {
        id: 'reply-25',
        userId: 'mentor-rahmato',
        userName: 'Apoteker Rahmato',
        userRole: 'mentor',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=60',
        content: 'Guideline JNC 8 + ADA 2024: Untuk DM + HT tanpa proteinuria, pilihan lini pertama adalah ACE Inhibitor (mis. Ramipril 5 mg) atau ARB (mis. Valsartan 80 mg) karena efek nefroprotektif. Jika TD masih tidak terkontrol, tambahkan CCB (Amlodipine 5 mg). Target TD pasien DM: <130/80 mmHg. Hindari beta-blocker sebagai monoterapi karena dapat menutupi tanda hipoglikemia.',
        createdAt: '2026-05-15T13:00:00Z'
      },
      {
        id: 'reply-26',
        userId: 'student-mira-andriani',
        userName: 'Apt. Mira Andriani',
        userRole: 'student',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&auto=format&fit=crop&q=60',
        content: 'Jangan lupa edukasi pasien soal batuk kering yang umum pada ACE Inhibitor — bila tidak toleran, ganti ke ARB yang profil efek sampingnya lebih baik.',
        createdAt: '2026-05-15T15:00:00Z'
      }
    ]
  },
  {
    id: 'post-14',
    classId: 'gen6-advance-c',
    userId: 'student-mira-andriani',
    userName: 'Apt. Mira Andriani',
    userRole: 'student',
    userProfession: 'Apoteker',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&auto=format&fit=crop&q=60',
    title: 'Oncology Supportive Care — Penanganan Mual Muntah Kemoterapi (CINV)',
    content: 'Pasien kanker payudara stadium 3 akan menjalani kemoterapi AC (Adriamycin + Cyclophosphamide) — termasuk highly emetogenic. Bagaimana standar antiemetik profilaksis yang direkomendasikan?',
    createdAt: '2026-05-10T08:00:00Z',
    replies: [
      {
        id: 'reply-27',
        userId: 'mentor-rahmato',
        userName: 'Apoteker Rahmato',
        userRole: 'mentor',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=60',
        content: 'ASCO 2020 guideline untuk HEC (Highly Emetogenic Chemotherapy): Triple/Quadruple therapy — 1) NK1-RA: Aprepitant 125 mg hari 1, 80 mg hari 2-3, 2) 5-HT3-RA: Ondansetron 8 mg IV pre-kemo, 3) Dexamethasone 12 mg IV, 4) Olanzapine 10 mg po hari 1-4 (add-on untuk CINV refrakter). Jangan lupa antiemetik rescue untuk breakthrough CINV.',
        createdAt: '2026-05-10T11:00:00Z'
      },
      {
        id: 'reply-28',
        userId: 'student-indah-permata',
        userName: 'Apt. Indah Permata',
        userRole: 'student',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&auto=format&fit=crop&q=60',
        content: 'Edukasi pasien juga penting: hindari makanan berbau kuat 24 jam sebelum kemo, makan porsi kecil sering, dan catat buku harian mual untuk assessment di siklus berikutnya.',
        createdAt: '2026-05-10T13:30:00Z'
      }
    ]
  },
  {
    id: 'post-15',
    classId: 'gen6-reguler-b',
    userId: 'student-farida-hanum',
    userName: 'Farida Hanum, S.Farm',
    userRole: 'student',
    userProfession: 'Mahasiswa',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&auto=format&fit=crop&q=60',
    title: 'Kalkulasi Dosis Anak — Rumus mana yang paling akurat digunakan?',
    content: 'Saya pelajari ada beberapa rumus kalkulasi dosis anak: Young, Clark, Dilling, Fried, dan BSA. Kapan masing-masing rumus digunakan? Mana yang paling direkomendasikan secara klinis saat ini?',
    createdAt: '2026-05-05T09:30:00Z',
    replies: [
      {
        id: 'reply-29',
        userId: 'mentor-rahmato',
        userName: 'Apoteker Rahmato',
        userRole: 'mentor',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=60',
        content: 'Penjelasan ringkas: Rumus Young & Clark sudah jarang digunakan karena tidak memperhitungkan perbedaan farmakokinetika anak vs dewasa. Standar klinis modern: 1) mg/kgBB (paling sering, tercantum di literatur pediatrik), 2) mg/m² BSA untuk obat onkologi dan kemoterapi (lebih akurat pada anak variatif BB), 3) Untuk neonatus: mg/kgBB dengan penyesuaian usia gestasi. Selalu rujuk ke referensi BNF for Children atau IDAI untuk dosis spesifik.',
        createdAt: '2026-05-05T11:30:00Z'
      },
      {
        id: 'reply-30',
        userId: 'student-kevin-oktavian',
        userName: 'Kevin Oktavian, S.Farm',
        userRole: 'student',
        userProfession: 'Mahasiswa',
        avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=60',
        content: 'Wah lengkap sekali! Saya selalu bingung memilih rumus di buku farmakologi yang masih mencantumkan semua rumus lama. Terima kasih Pak Rahmato!',
        createdAt: '2026-05-05T14:00:00Z'
      }
    ]
  },
  {
    id: 'post-16',
    classId: 'gen6-advance-b',
    userId: 'student-wahyu-saputra',
    userName: 'dr. Wahyu Saputra',
    userRole: 'student',
    userProfession: 'Dokter',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=60',
    title: 'Geriatric Dosing — Prinsip "Start Low, Go Slow" dalam Praktik',
    content: 'Pasien lansia 78 tahun dengan polifarmasi (11 obat rutin). Ada yang punya framework sistematis untuk melakukan deprescribing dan mengurangi risiko adverse drug events?',
    createdAt: '2026-04-28T11:00:00Z',
    replies: [
      {
        id: 'reply-31',
        userId: 'mentor-rahmato',
        userName: 'Apoteker Rahmato',
        userRole: 'mentor',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=60',
        content: 'Framework deprescribing yang praktis: 1) Identifikasi obat dengan indikasi tidak jelas (START/STOPP criteria v3 2023), 2) Cek Beers Criteria — obat high-risk pada geriatri (antikolinergik, benzodiazepine, NSAID), 3) Prioritaskan hentikan obat dengan risiko > manfaat, 4) Tapering bertahap untuk obat tertentu (benzodiazepine, PPI, beta-blocker), 5) Monitor 2 minggu setelah deprescribing. Tools gratis: deprescribing.org.',
        createdAt: '2026-04-28T14:00:00Z'
      },
      {
        id: 'reply-32',
        userId: 'student-teguh-wibowo',
        userName: 'dr. Teguh Wibowo',
        userRole: 'student',
        userProfession: 'Dokter',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=60',
        content: 'Kolaborasi dokter-apoteker sangat krusial di sini. Di RS kami, apoteker klinis rutin melakukan medication review pada pasien geriatri > 5 obat di bangsal rawat inap.',
        createdAt: '2026-04-28T16:30:00Z'
      }
    ]
  },
  {
    id: 'post-17',
    classId: 'gen6-reguler-a',
    userId: 'student-ayu-widiastuti',
    userName: 'Bidan Ayu Widiastuti',
    userRole: 'student',
    userProfession: 'Bidan',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60',
    title: 'Obat yang Aman Saat Menyusui — Kategori Lactation Risk',
    content: 'Sebagai bidan, sering ditanya ibu menyusui tentang keamanan obat. Ada referensi atau sistem kategori yang mudah digunakan untuk cek apakah obat aman saat laktasi?',
    createdAt: '2026-04-22T08:30:00Z',
    replies: [
      {
        id: 'reply-33',
        userId: 'mentor-rahmato',
        userName: 'Apoteker Rahmato',
        userRole: 'mentor',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=60',
        content: 'Referensi terbaik: LactMed Database (NCBI, gratis) — database berbasis bukti yang update dan bisa diakses via smartphone. Sistem kategori Hale: L1 (paling aman) sampai L5 (kontraindikasi). Prinsip: pilih obat L1-L2, timing minum obat setelah menyusui atau sebelum tidur bayi (jarak terlama). Obat umum yang aman: Paracetamol, Ibuprofen, Amoxicillin, Cetirizine. Hindari: Pseudoephedrine (kurangi produksi ASI), Ergotamine, kemoterapi.',
        createdAt: '2026-04-22T10:30:00Z'
      },
      {
        id: 'reply-34',
        userId: 'student-dewi-kusuma',
        userName: 'Apt. Dewi Kusuma',
        userRole: 'student',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=150&auto=format&fit=crop&q=60',
        content: 'Selain LactMed, ada juga e-lactancia.org yang lebih visual dan mudah dicari nama obatnya. Cocok untuk akses cepat di klinik.',
        createdAt: '2026-04-22T12:00:00Z'
      }
    ]
  },
  {
    id: 'post-18',
    classId: 'gen6-advance-a',
    userId: 'student-ahmad-fauzan',
    userName: 'dr. Ahmad Fauzan',
    userRole: 'student',
    userProfession: 'Dokter',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=60',
    title: 'Pediatric Pharmacotherapy — Dosis Paracetamol IV pada Neonatus Prematur',
    content: 'Neonatus prematur 28 minggu, BB 1.1 kg, nyeri post-operasi. Apakah Paracetamol IV aman dan berapa dosisnya? Apakah bisa digunakan sebagai analgesik opioid-sparing?',
    createdAt: '2026-04-15T10:00:00Z',
    replies: [
      {
        id: 'reply-35',
        userId: 'mentor-rahmato',
        userName: 'Apoteker Rahmato',
        userRole: 'mentor',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=60',
        content: 'Paracetamol IV (Perfalgan) semakin banyak digunakan pada neonatus sebagai opioid-sparing analgesik. Dosis neonatus prematur <28 minggu: 7.5 mg/kgBB per 12 jam IV (lebih konservatif karena metabolisme hati belum matur). Untuk 29-32 minggu: 10 mg/kg per 8 jam. Pantau fungsi hati. Studi TREOCAPA menunjukkan Paracetamol IV efektif untuk penutupan PDA tanpa efek samping Ibuprofen. Konsultasikan dengan neonatologis.',
        createdAt: '2026-04-15T13:00:00Z'
      },
      {
        id: 'reply-36',
        userId: 'student-rini-pratiwi',
        userName: 'dr. Rini Pratiwi',
        userRole: 'student',
        userProfession: 'Dokter',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60',
        content: 'Referensi tambahan: NeoFax (database dosis neonatal) sangat berguna untuk dosing neonatus prematur — tersedia versi digital yang bisa diakses via aplikasi.',
        createdAt: '2026-04-15T15:30:00Z'
      }
    ]
  },
  {
    id: 'post-19',
    classId: 'gen6-reguler-c',
    userId: 'student-faisal-arifin',
    userName: 'Ns. Faisal Arifin',
    userRole: 'student',
    userProfession: 'Perawat',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=60',
    title: 'Dispensing Obat LASA (Look-Alike Sound-Alike) — Pencegahan Medication Error',
    content: 'Di bangsal sering terjadi hampir-error karena nama obat yang mirip: Hydromorphone vs Morphine, Hydroxyzine vs Hydralazine, dll. Bagaimana sistem pencegahan LASA yang efektif?',
    createdAt: '2026-04-10T09:30:00Z',
    replies: [
      {
        id: 'reply-37',
        userId: 'mentor-rahmato',
        userName: 'Apoteker Rahmato',
        userRole: 'mentor',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=60',
        content: 'Strategi LASA ISMP: 1) Tall Man Lettering — HYDROmorphone vs HYDROxyzine untuk highlight perbedaan, 2) Label merah/stiker LASA di rak penyimpanan, 3) Pisahkan penyimpanan obat LASA (jangan berdekatan), 4) Verifikasi 5 Benar saat dispensing, 5) Barcode Medication Administration (BCMA) di bedside untuk high-alert medications, 6) Buat dan posting daftar obat LASA internal RS — update berkala.',
        createdAt: '2026-04-10T12:00:00Z'
      },
      {
        id: 'reply-38',
        userId: 'student-eko-prasetyo',
        userName: 'Ns. Eko Prasetyo',
        userRole: 'student',
        userProfession: 'Perawat',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=60',
        content: 'Di RS kami, tall man lettering berhasil menurunkan kejadian near-miss LASA sampai 60% dalam 6 bulan. Sederhana tapi sangat efektif!',
        createdAt: '2026-04-10T14:15:00Z'
      }
    ]
  },
  {
    id: 'post-20',
    classId: 'gen6-advance-c',
    userId: 'student-novia-anggraini',
    userName: 'Apt. Novia Anggraini',
    userRole: 'student',
    userProfession: 'Apoteker',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60',
    title: 'Rekonstitusi Obat Kemoterapi — Teknik Aseptik dan Keamanan Petugas',
    content: 'RS kami baru memulai layanan farmasi onkologi. Apa standar teknik aseptik dan APD yang wajib digunakan saat rekonstitusi obat sitostatika? Dan bagaimana prosedur jika terjadi tumpahan?',
    createdAt: '2026-04-05T08:00:00Z',
    replies: [
      {
        id: 'reply-39',
        userId: 'mentor-rahmato',
        userName: 'Apoteker Rahmato',
        userRole: 'mentor',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=60',
        content: 'Standar NIOSH/USP <800>: Wajib Biological Safety Cabinet (BSC) kelas II B2 atau CACI (Compounding Aseptic Containment Isolator). APD: gown tahan kimia double, sarung tangan sitotoksik tebal (double glove), respirator N95, eye protection. Prosedur tumpahan: isolasi area, gunakan spill kit sitotoksika (berbeda dari spill kit biasa), dokumentasi insiden, lapor K3RS. Petugas wajib medical surveillance periodik (CBC, fungsi hati, reproduksi).',
        createdAt: '2026-04-05T11:00:00Z'
      },
      {
        id: 'reply-40',
        userId: 'student-dian-purnama',
        userName: 'Apt. Dian Purnama',
        userRole: 'student',
        userProfession: 'Apoteker',
        avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=150&auto=format&fit=crop&q=60',
        content: 'Jangan lupa juga sosialisasi ke petugas pengiriman obat dan perawat yang menerima — mereka juga terpapar risiko meskipun tidak secara langsung merekonstitusi.',
        createdAt: '2026-04-05T14:00:00Z'
      }
    ]
  },
];

// [MOCK DATA] Seeded for demo — replace with Supabase query when backend ready
export const DEFAULT_TRANSACTIONS: Transaction[] = [
  // --- January 2026 ---
  { id: 'TX-100001', userId: 'student-ahmad-fauzan', userName: 'dr. Ahmad Fauzan', userEmail: 'ahmad.fauzan@rs-medistra.co.id', classId: 'gen6-advance-a', className: 'ADVANCE A', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-01-03T08:15:00Z' },
  { id: 'TX-100002', userId: 'student-rini-pratiwi', userName: 'dr. Rini Pratiwi', userEmail: 'rini.pratiwi@rs-siloam.co.id', classId: 'gen6-advance-c', className: 'ADVANCE C', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'E-Wallet (GoPay)', createdAt: '2026-01-04T09:30:00Z' },
  { id: 'TX-100003', userId: 'student-dewi-kusuma', userName: 'Apt. Dewi Kusuma', userEmail: 'dewi.kusuma@gmail.com', classId: 'gen6-reguler-a', className: 'REGULER A', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'Virtual Account (Mandiri)', createdAt: '2026-01-05T10:00:00Z' },
  { id: 'TX-100004', userId: 'student-budi-hartono', userName: 'Apt. Budi Hartono', userEmail: 'budi.hartono@apotek-kimiafarma.co.id', classId: 'gen6-reguler-b', className: 'REGULER B', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'E-Wallet (OVO)', createdAt: '2026-01-06T11:20:00Z' },
  { id: 'TX-100005', userId: 'student-maya-sari', userName: 'Ns. Maya Sari', userEmail: 'maya.sari@rs-islam.co.id', classId: 'gen6-reguler-a', className: 'REGULER A', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'QRIS', createdAt: '2026-01-07T14:00:00Z' },
  { id: 'TX-100006', userId: 'student-rizki-ramadhan', userName: 'Apt. Rizki Ramadhan', userEmail: 'rizki.ramadhan@gmail.com', classId: 'gen6-advance-b', className: 'ADVANCE B', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-01-08T15:30:00Z' },
  { id: 'TX-100007', userId: 'student-laila-fitriani', userName: 'dr. Laila Fitriani', userEmail: 'laila.fitriani@rs-pondokindah.co.id', classId: 'gen6-advance-a', className: 'ADVANCE A', generationName: 'Generasi 6', amount: 750000, status: 'pending', paymentMethod: 'Virtual Account (BNI)', createdAt: '2026-01-09T08:45:00Z' },
  { id: 'TX-100008', userId: 'student-hendra-wijaya', userName: 'Apt. Hendra Wijaya', userEmail: 'hendra.wijaya@apotek-guardian.co.id', classId: 'gen6-reguler-a', className: 'REGULER A', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'E-Wallet (GoPay)', createdAt: '2026-01-10T10:00:00Z' },
  { id: 'TX-100009', userId: 'student-siti-rahayu', userName: 'Ns. Siti Rahayu', userEmail: 'siti.rahayu@puskesmas-kebayoran.co.id', classId: 'gen6-reguler-c', className: 'REGULER C', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-01-11T09:15:00Z' },
  { id: 'TX-100010', userId: 'student-dian-purnama', userName: 'Apt. Dian Purnama', userEmail: 'dian.purnama@gmail.com', classId: 'gen6-advance-c', className: 'ADVANCE C', generationName: 'Generasi 6', amount: 750000, status: 'failed', paymentMethod: 'E-Wallet (OVO)', createdAt: '2026-01-12T13:00:00Z' },
  { id: 'TX-100011', userId: 'student-fajar-nugroho', userName: 'dr. Fajar Nugroho', userEmail: 'fajar.nugroho@rs-fatmawati.co.id', classId: 'gen6-advance-b', className: 'ADVANCE B', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-01-14T10:30:00Z' },
  { id: 'TX-100012', userId: 'student-indah-permata', userName: 'Apt. Indah Permata', userEmail: 'indah.permata@rsmarihenni.co.id', classId: 'gen6-reguler-b', className: 'REGULER B', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'QRIS', createdAt: '2026-01-15T11:00:00Z' },
  { id: 'TX-100013', userId: 'student-agus-setiawan', userName: 'Ns. Agus Setiawan', userEmail: 'agus.setiawan@rs-tebet.co.id', classId: 'gen6-reguler-a', className: 'REGULER A', generationName: 'Generasi 6', amount: 450000, status: 'pending', paymentMethod: 'Virtual Account (Mandiri)', createdAt: '2026-01-16T14:30:00Z' },
  { id: 'TX-100014', userId: 'student-novia-anggraini', userName: 'Apt. Novia Anggraini', userEmail: 'novia.anggraini@gmail.com', classId: 'gen6-reguler-c', className: 'REGULER C', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'E-Wallet (GoPay)', createdAt: '2026-01-18T08:00:00Z' },
  { id: 'TX-100015', userId: 'student-yusuf-hakim', userName: 'dr. Yusuf Hakim', userEmail: 'yusuf.hakim@rs-cikini.co.id', classId: 'gen6-advance-a', className: 'ADVANCE A', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-01-20T09:00:00Z' },
  // --- February 2026 ---
  { id: 'TX-100016', userId: 'student-putri-wulandari', userName: 'Apt. Putri Wulandari', userEmail: 'putri.wulandari@apotek-century.co.id', classId: 'gen6-reguler-a', className: 'REGULER A', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'E-Wallet (GoPay)', createdAt: '2026-02-02T08:30:00Z' },
  { id: 'TX-100017', userId: 'student-eko-prasetyo', userName: 'Ns. Eko Prasetyo', userEmail: 'eko.prasetyo@rsud-tangerang.co.id', classId: 'gen6-reguler-b', className: 'REGULER B', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'QRIS', createdAt: '2026-02-03T10:15:00Z' },
  { id: 'TX-100018', userId: 'student-fitri-handayani', userName: 'Apt. Fitri Handayani', userEmail: 'fitri.handayani@gmail.com', classId: 'gen6-advance-b', className: 'ADVANCE B', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-02-05T11:00:00Z' },
  { id: 'TX-100019', userId: 'student-bagas-prasetya', userName: 'dr. Bagas Prasetya', userEmail: 'bagas.prasetya@rs-premier-bintaro.co.id', classId: 'gen6-advance-a', className: 'ADVANCE A', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'Virtual Account (Mandiri)', createdAt: '2026-02-06T13:00:00Z' },
  { id: 'TX-100020', userId: 'student-lestari-ningrum', userName: 'Apt. Lestari Ningrum', userEmail: 'lestari.ningrum@rsia-bunda.co.id', classId: 'gen6-reguler-c', className: 'REGULER C', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'E-Wallet (OVO)', createdAt: '2026-02-08T09:30:00Z' },
  { id: 'TX-100021', userId: 'student-deni-firmansyah', userName: 'Ns. Deni Firmansyah', userEmail: 'deni.firmansyah@rsud-depok.co.id', classId: 'gen6-reguler-a', className: 'REGULER A', generationName: 'Generasi 6', amount: 450000, status: 'failed', paymentMethod: 'QRIS', createdAt: '2026-02-10T14:00:00Z' },
  { id: 'TX-100022', userId: 'student-mira-andriani', userName: 'Apt. Mira Andriani', userEmail: 'mira.andriani@gmail.com', classId: 'gen6-advance-c', className: 'ADVANCE C', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-02-12T10:00:00Z' },
  { id: 'TX-100023', userId: 'student-wahyu-saputra', userName: 'dr. Wahyu Saputra', userEmail: 'wahyu.saputra@rs-omni.co.id', classId: 'gen6-advance-b', className: 'ADVANCE B', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'E-Wallet (GoPay)', createdAt: '2026-02-14T09:00:00Z' },
  { id: 'TX-100024', userId: 'student-cindy-ramadhani', userName: 'Apt. Cindy Ramadhani', userEmail: 'cindy.ramadhani@apotek-k24.co.id', classId: 'gen6-reguler-b', className: 'REGULER B', generationName: 'Generasi 6', amount: 450000, status: 'pending', paymentMethod: 'Virtual Account (BNI)', createdAt: '2026-02-15T11:30:00Z' },
  { id: 'TX-100025', userId: 'student-faisal-arifin', userName: 'Ns. Faisal Arifin', userEmail: 'faisal.arifin@rskb-bogor.co.id', classId: 'gen6-reguler-c', className: 'REGULER C', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'QRIS', createdAt: '2026-02-17T08:15:00Z' },
  { id: 'TX-100026', userId: 'student-yeni-kurniawati', userName: 'Apt. Yeni Kurniawati', userEmail: 'yeni.kurniawati@gmail.com', classId: 'gen6-advance-a', className: 'ADVANCE A', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-02-20T10:00:00Z' },
  { id: 'TX-100027', userId: 'student-teguh-wibowo', userName: 'dr. Teguh Wibowo', userEmail: 'teguh.wibowo@rs-eka-hospital.co.id', classId: 'gen6-advance-b', className: 'ADVANCE B', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'E-Wallet (GoPay)', createdAt: '2026-02-22T14:00:00Z' },
  // --- March 2026 ---
  { id: 'TX-100028', userId: 'student-rahma-aulia', userName: 'Rahma Aulia, S.Farm', userEmail: 'rahma.aulia@gmail.com', classId: 'gen6-reguler-a', className: 'REGULER A', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'E-Wallet (GoPay)', createdAt: '2026-03-01T09:00:00Z' },
  { id: 'TX-100029', userId: 'student-farida-hanum', userName: 'Farida Hanum, S.Farm', userEmail: 'farida.hanum@gmail.com', classId: 'gen6-reguler-b', className: 'REGULER B', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'QRIS', createdAt: '2026-03-02T10:30:00Z' },
  { id: 'TX-100030', userId: 'student-kevin-oktavian', userName: 'Kevin Oktavian, S.Farm', userEmail: 'kevin.oktavian@gmail.com', classId: 'gen6-reguler-c', className: 'REGULER C', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'Virtual Account (Mandiri)', createdAt: '2026-03-04T11:00:00Z' },
  { id: 'TX-100031', userId: 'student-ayu-widiastuti', userName: 'Bidan Ayu Widiastuti', userEmail: 'ayu.widiastuti@puskesmas-johar.co.id', classId: 'gen6-reguler-a', className: 'REGULER A', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'E-Wallet (OVO)', createdAt: '2026-03-05T08:45:00Z' },
  { id: 'TX-100032', userId: 'student-ahmad-fauzan', userName: 'dr. Ahmad Fauzan', userEmail: 'ahmad.fauzan@rs-medistra.co.id', classId: 'gen6-advance-b', className: 'ADVANCE B', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-03-08T09:30:00Z' },
  { id: 'TX-100033', userId: 'student-dewi-kusuma', userName: 'Apt. Dewi Kusuma', userEmail: 'dewi.kusuma@gmail.com', classId: 'gen6-advance-a', className: 'ADVANCE A', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'E-Wallet (GoPay)', createdAt: '2026-03-10T14:00:00Z' },
  { id: 'TX-100034', userId: 'student-rizki-ramadhan', userName: 'Apt. Rizki Ramadhan', userEmail: 'rizki.ramadhan@gmail.com', classId: 'gen6-reguler-c', className: 'REGULER C', generationName: 'Generasi 6', amount: 450000, status: 'pending', paymentMethod: 'QRIS', createdAt: '2026-03-12T10:00:00Z' },
  { id: 'TX-100035', userId: 'student-novia-anggraini', userName: 'Apt. Novia Anggraini', userEmail: 'novia.anggraini@gmail.com', classId: 'gen6-advance-c', className: 'ADVANCE C', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-03-15T11:00:00Z' },
  { id: 'TX-100036', userId: 'student-yusuf-hakim', userName: 'dr. Yusuf Hakim', userEmail: 'yusuf.hakim@rs-cikini.co.id', classId: 'gen6-advance-c', className: 'ADVANCE C', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'Virtual Account (Mandiri)', createdAt: '2026-03-18T09:00:00Z' },
  { id: 'TX-100037', userId: 'student-indah-permata', userName: 'Apt. Indah Permata', userEmail: 'indah.permata@rsmarihenni.co.id', classId: 'gen6-advance-a', className: 'ADVANCE A', generationName: 'Generasi 6', amount: 750000, status: 'failed', paymentMethod: 'E-Wallet (OVO)', createdAt: '2026-03-20T15:00:00Z' },
  { id: 'TX-100038', userId: 'student-fitri-handayani', userName: 'Apt. Fitri Handayani', userEmail: 'fitri.handayani@gmail.com', classId: 'gen6-reguler-a', className: 'REGULER A', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'QRIS', createdAt: '2026-03-22T10:30:00Z' },
  { id: 'TX-100039', userId: 'student-kevin-oktavian', userName: 'Kevin Oktavian, S.Farm', userEmail: 'kevin.oktavian@gmail.com', classId: 'gen6-reguler-a', className: 'REGULER A', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-03-25T08:00:00Z' },
  { id: 'TX-100040', userId: 'student-hendra-wijaya', userName: 'Apt. Hendra Wijaya', userEmail: 'hendra.wijaya@apotek-guardian.co.id', classId: 'gen6-reguler-b', className: 'REGULER B', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'E-Wallet (GoPay)', createdAt: '2026-03-28T11:00:00Z' },
  // --- April 2026 ---
  { id: 'TX-100041', userId: 'student-mira-andriani', userName: 'Apt. Mira Andriani', userEmail: 'mira.andriani@gmail.com', classId: 'gen6-reguler-c', className: 'REGULER C', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'Virtual Account (BNI)', createdAt: '2026-04-01T09:00:00Z' },
  { id: 'TX-100042', userId: 'student-wahyu-saputra', userName: 'dr. Wahyu Saputra', userEmail: 'wahyu.saputra@rs-omni.co.id', classId: 'gen6-advance-c', className: 'ADVANCE C', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-04-03T10:00:00Z' },
  { id: 'TX-100043', userId: 'student-bagas-prasetya', userName: 'dr. Bagas Prasetya', userEmail: 'bagas.prasetya@rs-premier-bintaro.co.id', classId: 'gen6-advance-a', className: 'ADVANCE A', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'E-Wallet (GoPay)', createdAt: '2026-04-05T11:30:00Z' },
  { id: 'TX-100044', userId: 'student-dian-purnama', userName: 'Apt. Dian Purnama', userEmail: 'dian.purnama@gmail.com', classId: 'gen6-advance-c', className: 'ADVANCE C', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'QRIS', createdAt: '2026-04-07T08:30:00Z' },
  { id: 'TX-100045', userId: 'student-rini-pratiwi', userName: 'dr. Rini Pratiwi', userEmail: 'rini.pratiwi@rs-siloam.co.id', classId: 'gen6-advance-c', className: 'ADVANCE C', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-04-10T09:00:00Z' },
  { id: 'TX-100046', userId: 'student-cindy-ramadhani', userName: 'Apt. Cindy Ramadhani', userEmail: 'cindy.ramadhani@apotek-k24.co.id', classId: 'gen6-reguler-c', className: 'REGULER C', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'E-Wallet (OVO)', createdAt: '2026-04-12T14:00:00Z' },
  { id: 'TX-100047', userId: 'student-lestari-ningrum', userName: 'Apt. Lestari Ningrum', userEmail: 'lestari.ningrum@rsia-bunda.co.id', classId: 'gen6-reguler-c', className: 'REGULER C', generationName: 'Generasi 6', amount: 450000, status: 'pending', paymentMethod: 'Virtual Account (Mandiri)', createdAt: '2026-04-14T10:00:00Z' },
  { id: 'TX-100048', userId: 'student-yeni-kurniawati', userName: 'Apt. Yeni Kurniawati', userEmail: 'yeni.kurniawati@gmail.com', classId: 'gen6-reguler-a', className: 'REGULER A', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'QRIS', createdAt: '2026-04-16T09:30:00Z' },
  { id: 'TX-100049', userId: 'student-fajar-nugroho', userName: 'dr. Fajar Nugroho', userEmail: 'fajar.nugroho@rs-fatmawati.co.id', classId: 'gen6-advance-b', className: 'ADVANCE B', generationName: 'Generasi 6', amount: 750000, status: 'failed', paymentMethod: 'E-Wallet (GoPay)', createdAt: '2026-04-18T11:00:00Z' },
  { id: 'TX-100050', userId: 'student-teguh-wibowo', userName: 'dr. Teguh Wibowo', userEmail: 'teguh.wibowo@rs-eka-hospital.co.id', classId: 'gen6-advance-b', className: 'ADVANCE B', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-04-22T08:00:00Z' },
  // --- May 2026 ---
  { id: 'TX-100051', userId: 'student-siti', userName: 'Siti Aminah, S.Farm', userEmail: 'siti.aminah@gmail.com', classId: 'gen6-reguler-a', className: 'REGULER A', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'Virtual Account (Mandiri)', createdAt: '2026-05-01T08:00:00Z' },
  { id: 'TX-100052', userId: 'student-farhan', userName: 'dr. Farhan Malik', userEmail: 'farhan.malik@gmail.com', classId: 'gen6-advance-a', className: 'ADVANCE A', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-05-03T09:30:00Z' },
  { id: 'TX-100053', userId: 'student-budi', userName: 'Budi Santoso, Apt', userEmail: 'budi.santoso@gmail.com', classId: 'gen6-advance-b', className: 'ADVANCE B', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'E-Wallet (GoPay)', createdAt: '2026-05-05T10:00:00Z' },
  { id: 'TX-100054', userId: 'student-putri-wulandari', userName: 'Apt. Putri Wulandari', userEmail: 'putri.wulandari@apotek-century.co.id', classId: 'gen6-reguler-a', className: 'REGULER A', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'QRIS', createdAt: '2026-05-06T14:00:00Z' },
  { id: 'TX-100055', userId: 'student-eko-prasetyo', userName: 'Ns. Eko Prasetyo', userEmail: 'eko.prasetyo@rsud-tangerang.co.id', classId: 'gen6-reguler-b', className: 'REGULER B', generationName: 'Generasi 6', amount: 450000, status: 'pending', paymentMethod: 'Virtual Account (BNI)', createdAt: '2026-05-08T09:00:00Z' },
  { id: 'TX-100056', userId: 'student-deni-firmansyah', userName: 'Ns. Deni Firmansyah', userEmail: 'deni.firmansyah@rsud-depok.co.id', classId: 'gen6-reguler-b', className: 'REGULER B', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-05-10T11:30:00Z' },
  { id: 'TX-100057', userId: 'student-maya-sari', userName: 'Ns. Maya Sari', userEmail: 'maya.sari@rs-islam.co.id', classId: 'gen6-reguler-a', className: 'REGULER A', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'E-Wallet (OVO)', createdAt: '2026-05-12T08:30:00Z' },
  { id: 'TX-100058', userId: 'student-laila-fitriani', userName: 'dr. Laila Fitriani', userEmail: 'laila.fitriani@rs-pondokindah.co.id', classId: 'gen6-advance-a', className: 'ADVANCE A', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-05-15T10:00:00Z' },
  { id: 'TX-100059', userId: 'student-ahmad-fauzan', userName: 'dr. Ahmad Fauzan', userEmail: 'ahmad.fauzan@rs-medistra.co.id', classId: 'gen6-advance-b', className: 'ADVANCE B', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'E-Wallet (GoPay)', createdAt: '2026-05-18T13:00:00Z' },
  { id: 'TX-100060', userId: 'student-agus-setiawan', userName: 'Ns. Agus Setiawan', userEmail: 'agus.setiawan@rs-tebet.co.id', classId: 'gen6-reguler-a', className: 'REGULER A', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'QRIS', createdAt: '2026-05-20T09:00:00Z' },
  { id: 'TX-100061', userId: 'student-bagas-prasetya', userName: 'dr. Bagas Prasetya', userEmail: 'bagas.prasetya@rs-premier-bintaro.co.id', classId: 'gen6-advance-a', className: 'ADVANCE A', generationName: 'Generasi 6', amount: 750000, status: 'failed', paymentMethod: 'Virtual Account (Mandiri)', createdAt: '2026-05-22T11:00:00Z' },
  { id: 'TX-100062', userId: 'student-rahma-aulia', userName: 'Rahma Aulia, S.Farm', userEmail: 'rahma.aulia@gmail.com', classId: 'gen6-reguler-a', className: 'REGULER A', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'E-Wallet (GoPay)', createdAt: '2026-05-25T08:00:00Z' },
  { id: 'TX-100063', userId: 'student-farida-hanum', userName: 'Farida Hanum, S.Farm', userEmail: 'farida.hanum@gmail.com', classId: 'gen6-reguler-b', className: 'REGULER B', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'QRIS', createdAt: '2026-05-28T10:30:00Z' },
  { id: 'TX-100064', userId: 'student-faisal-arifin', userName: 'Ns. Faisal Arifin', userEmail: 'faisal.arifin@rskb-bogor.co.id', classId: 'gen6-reguler-c', className: 'REGULER C', generationName: 'Generasi 6', amount: 450000, status: 'pending', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-05-30T09:00:00Z' },
  // --- June 2026 ---
  { id: 'TX-100065', userId: 'student-wahyu-saputra', userName: 'dr. Wahyu Saputra', userEmail: 'wahyu.saputra@rs-omni.co.id', classId: 'gen6-advance-b', className: 'ADVANCE B', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'E-Wallet (GoPay)', createdAt: '2026-06-02T08:30:00Z' },
  { id: 'TX-100066', userId: 'student-cindy-ramadhani', userName: 'Apt. Cindy Ramadhani', userEmail: 'cindy.ramadhani@apotek-k24.co.id', classId: 'gen6-reguler-b', className: 'REGULER B', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-06-05T09:00:00Z' },
  { id: 'TX-100067', userId: 'student-mira-andriani', userName: 'Apt. Mira Andriani', userEmail: 'mira.andriani@gmail.com', classId: 'gen6-reguler-c', className: 'REGULER C', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'QRIS', createdAt: '2026-06-07T11:00:00Z' },
  { id: 'TX-100068', userId: 'student-yeni-kurniawati', userName: 'Apt. Yeni Kurniawati', userEmail: 'yeni.kurniawati@gmail.com', classId: 'gen6-advance-a', className: 'ADVANCE A', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'Virtual Account (Mandiri)', createdAt: '2026-06-08T10:00:00Z' },
  { id: 'TX-100069', userId: 'student-novia-anggraini', userName: 'Apt. Novia Anggraini', userEmail: 'novia.anggraini@gmail.com', classId: 'gen6-advance-c', className: 'ADVANCE C', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-06-10T08:00:00Z' },
  { id: 'TX-100070', userId: 'student-dian-purnama', userName: 'Apt. Dian Purnama', userEmail: 'dian.purnama@gmail.com', classId: 'gen6-advance-c', className: 'ADVANCE C', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'E-Wallet (OVO)', createdAt: '2026-06-12T14:30:00Z' },
  { id: 'TX-100071', userId: 'student-indah-permata', userName: 'Apt. Indah Permata', userEmail: 'indah.permata@rsmarihenni.co.id', classId: 'gen6-advance-a', className: 'ADVANCE A', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'QRIS', createdAt: '2026-06-15T09:30:00Z' },
  { id: 'TX-100072', userId: 'student-teguh-wibowo', userName: 'dr. Teguh Wibowo', userEmail: 'teguh.wibowo@rs-eka-hospital.co.id', classId: 'gen6-advance-b', className: 'ADVANCE B', generationName: 'Generasi 6', amount: 750000, status: 'pending', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-06-17T10:00:00Z' },
  { id: 'TX-100073', userId: 'student-ayu-widiastuti', userName: 'Bidan Ayu Widiastuti', userEmail: 'ayu.widiastuti@puskesmas-johar.co.id', classId: 'gen6-reguler-a', className: 'REGULER A', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'E-Wallet (GoPay)', createdAt: '2026-06-20T08:15:00Z' },
  { id: 'TX-100074', userId: 'student-budi-hartono', userName: 'Apt. Budi Hartono', userEmail: 'budi.hartono@apotek-kimiafarma.co.id', classId: 'gen6-reguler-b', className: 'REGULER B', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'QRIS', createdAt: '2026-06-22T11:00:00Z' },
  { id: 'TX-100075', userId: 'student-fitri-handayani', userName: 'Apt. Fitri Handayani', userEmail: 'fitri.handayani@gmail.com', classId: 'gen6-reguler-a', className: 'REGULER A', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'Virtual Account (BNI)', createdAt: '2026-06-25T09:00:00Z' },
  { id: 'TX-100076', userId: 'student-rizki-ramadhan', userName: 'Apt. Rizki Ramadhan', userEmail: 'rizki.ramadhan@gmail.com', classId: 'gen6-reguler-c', className: 'REGULER C', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-06-28T10:30:00Z' },
  // --- July 2026 ---
  { id: 'TX-100077', userId: 'student-farhan', userName: 'dr. Farhan Malik', userEmail: 'farhan.malik@gmail.com', classId: 'gen6-advance-a', className: 'ADVANCE A', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-07-01T09:15:00Z' },
  { id: 'TX-100078', userId: 'student-farhan', userName: 'dr. Farhan Malik', userEmail: 'farhan.malik@gmail.com', classId: 'gen6-reguler-b', className: 'REGULER B', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'E-Wallet (GoPay)', createdAt: '2026-07-02T14:30:00Z' },
  { id: 'TX-100079', userId: 'student-siti', userName: 'Siti Aminah, S.Farm', userEmail: 'siti.aminah@gmail.com', classId: 'gen6-reguler-a', className: 'REGULER A', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'Virtual Account (Mandiri)', createdAt: '2026-07-03T11:20:00Z' },
  { id: 'TX-100080', userId: 'student-budi', userName: 'Budi Santoso, Apt', userEmail: 'budi.santoso@gmail.com', classId: 'gen6-advance-b', className: 'ADVANCE B', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-07-04T16:00:00Z' },
  { id: 'TX-100081', userId: 'student-rini-pratiwi', userName: 'dr. Rini Pratiwi', userEmail: 'rini.pratiwi@rs-siloam.co.id', classId: 'gen6-advance-c', className: 'ADVANCE C', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'E-Wallet (GoPay)', createdAt: '2026-07-05T10:00:00Z' },
  { id: 'TX-100082', userId: 'student-hendra-wijaya', userName: 'Apt. Hendra Wijaya', userEmail: 'hendra.wijaya@apotek-guardian.co.id', classId: 'gen6-reguler-b', className: 'REGULER B', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'QRIS', createdAt: '2026-07-06T09:30:00Z' },
  { id: 'TX-100083', userId: 'student-dewi-kusuma', userName: 'Apt. Dewi Kusuma', userEmail: 'dewi.kusuma@gmail.com', classId: 'gen6-reguler-a', className: 'REGULER A', generationName: 'Generasi 6', amount: 450000, status: 'success', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-07-07T11:00:00Z' },
  { id: 'TX-100084', userId: 'student-kevin-oktavian', userName: 'Kevin Oktavian, S.Farm', userEmail: 'kevin.oktavian@gmail.com', classId: 'gen6-reguler-c', className: 'REGULER C', generationName: 'Generasi 6', amount: 450000, status: 'pending', paymentMethod: 'Virtual Account (BNI)', createdAt: '2026-07-08T08:30:00Z' },
  { id: 'TX-100085', userId: 'student-bagas-prasetya', userName: 'dr. Bagas Prasetya', userEmail: 'bagas.prasetya@rs-premier-bintaro.co.id', classId: 'gen6-advance-a', className: 'ADVANCE A', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'E-Wallet (OVO)', createdAt: '2026-07-09T14:00:00Z' },
  { id: 'TX-100086', userId: 'student-laila-fitriani', userName: 'dr. Laila Fitriani', userEmail: 'laila.fitriani@rs-pondokindah.co.id', classId: 'gen6-advance-a', className: 'ADVANCE A', generationName: 'Generasi 6', amount: 750000, status: 'success', paymentMethod: 'Bank Transfer (BCA)', createdAt: '2026-07-10T10:30:00Z' },
];

// [MOCK DATA] Seeded for demo — replace with Supabase query when backend ready
export const DEFAULT_QUIZ_ATTEMPTS: QuizAttempt[] = [
  { id: 'att-001', studentId: 'student-farhan', quizId: 'quiz-advance', classId: 'gen6-advance-a', score: 100, passed: true, submittedAt: '2026-02-10T10:30:00Z' },
  { id: 'att-002', studentId: 'student-siti', quizId: 'quiz-reguler', classId: 'gen6-reguler-a', score: 80, passed: true, submittedAt: '2026-02-12T11:00:00Z' },
  { id: 'att-003', studentId: 'student-budi', quizId: 'quiz-advance', classId: 'gen6-advance-b', score: 100, passed: true, submittedAt: '2026-02-15T09:00:00Z' },
  { id: 'att-004', studentId: 'student-ahmad-fauzan', quizId: 'quiz-advance', classId: 'gen6-advance-a', score: 80, passed: true, submittedAt: '2026-02-20T14:00:00Z' },
  { id: 'att-005', studentId: 'student-rini-pratiwi', quizId: 'quiz-advance', classId: 'gen6-advance-c', score: 100, passed: true, submittedAt: '2026-02-22T10:00:00Z' },
  { id: 'att-006', studentId: 'student-dewi-kusuma', quizId: 'quiz-reguler', classId: 'gen6-reguler-a', score: 60, passed: false, submittedAt: '2026-02-25T09:30:00Z' },
  { id: 'att-007', studentId: 'student-dewi-kusuma', quizId: 'quiz-reguler', classId: 'gen6-reguler-a', score: 80, passed: true, submittedAt: '2026-03-01T10:00:00Z' },
  { id: 'att-008', studentId: 'student-budi-hartono', quizId: 'quiz-reguler', classId: 'gen6-reguler-b', score: 80, passed: true, submittedAt: '2026-03-05T11:00:00Z' },
  { id: 'att-009', studentId: 'student-maya-sari', quizId: 'quiz-reguler', classId: 'gen6-reguler-a', score: 60, passed: false, submittedAt: '2026-03-08T14:00:00Z' },
  { id: 'att-010', studentId: 'student-maya-sari', quizId: 'quiz-reguler', classId: 'gen6-reguler-a', score: 80, passed: true, submittedAt: '2026-03-12T09:00:00Z' },
  { id: 'att-011', studentId: 'student-rizki-ramadhan', quizId: 'quiz-advance', classId: 'gen6-advance-b', score: 100, passed: true, submittedAt: '2026-03-15T10:30:00Z' },
  { id: 'att-012', studentId: 'student-laila-fitriani', quizId: 'quiz-advance', classId: 'gen6-advance-a', score: 80, passed: true, submittedAt: '2026-03-18T11:00:00Z' },
  { id: 'att-013', studentId: 'student-hendra-wijaya', quizId: 'quiz-reguler', classId: 'gen6-reguler-a', score: 80, passed: true, submittedAt: '2026-03-20T09:30:00Z' },
  { id: 'att-014', studentId: 'student-siti-rahayu', quizId: 'quiz-reguler', classId: 'gen6-reguler-c', score: 60, passed: false, submittedAt: '2026-03-22T14:00:00Z' },
  { id: 'att-015', studentId: 'student-dian-purnama', quizId: 'quiz-advance', classId: 'gen6-advance-c', score: 80, passed: true, submittedAt: '2026-03-25T10:00:00Z' },
  { id: 'att-016', studentId: 'student-fajar-nugroho', quizId: 'quiz-advance', classId: 'gen6-advance-b', score: 80, passed: true, submittedAt: '2026-04-01T09:00:00Z' },
  { id: 'att-017', studentId: 'student-indah-permata', quizId: 'quiz-reguler', classId: 'gen6-reguler-b', score: 100, passed: true, submittedAt: '2026-04-05T11:30:00Z' },
  { id: 'att-018', studentId: 'student-novia-anggraini', quizId: 'quiz-reguler', classId: 'gen6-reguler-c', score: 80, passed: true, submittedAt: '2026-04-08T10:00:00Z' },
  { id: 'att-019', studentId: 'student-yusuf-hakim', quizId: 'quiz-advance', classId: 'gen6-advance-a', score: 60, passed: false, submittedAt: '2026-04-10T09:30:00Z' },
  { id: 'att-020', studentId: 'student-yusuf-hakim', quizId: 'quiz-advance', classId: 'gen6-advance-a', score: 80, passed: true, submittedAt: '2026-04-14T10:00:00Z' },
  { id: 'att-021', studentId: 'student-putri-wulandari', quizId: 'quiz-reguler', classId: 'gen6-reguler-a', score: 80, passed: true, submittedAt: '2026-04-18T11:00:00Z' },
  { id: 'att-022', studentId: 'student-eko-prasetyo', quizId: 'quiz-reguler', classId: 'gen6-reguler-b', score: 60, passed: false, submittedAt: '2026-04-22T14:00:00Z' },
  { id: 'att-023', studentId: 'student-fitri-handayani', quizId: 'quiz-advance', classId: 'gen6-advance-b', score: 100, passed: true, submittedAt: '2026-04-25T09:00:00Z' },
  { id: 'att-024', studentId: 'student-bagas-prasetya', quizId: 'quiz-advance', classId: 'gen6-advance-a', score: 100, passed: true, submittedAt: '2026-04-28T10:30:00Z' },
  { id: 'att-025', studentId: 'student-lestari-ningrum', quizId: 'quiz-reguler', classId: 'gen6-reguler-c', score: 80, passed: true, submittedAt: '2026-05-02T09:00:00Z' },
  { id: 'att-026', studentId: 'student-mira-andriani', quizId: 'quiz-advance', classId: 'gen6-advance-c', score: 80, passed: true, submittedAt: '2026-05-05T11:00:00Z' },
  { id: 'att-027', studentId: 'student-wahyu-saputra', quizId: 'quiz-advance', classId: 'gen6-advance-b', score: 100, passed: true, submittedAt: '2026-05-08T10:00:00Z' },
  { id: 'att-028', studentId: 'student-cindy-ramadhani', quizId: 'quiz-reguler', classId: 'gen6-reguler-b', score: 80, passed: true, submittedAt: '2026-05-12T09:30:00Z' },
  { id: 'att-029', studentId: 'student-faisal-arifin', quizId: 'quiz-reguler', classId: 'gen6-reguler-c', score: 60, passed: false, submittedAt: '2026-05-15T14:00:00Z' },
  { id: 'att-030', studentId: 'student-faisal-arifin', quizId: 'quiz-reguler', classId: 'gen6-reguler-c', score: 80, passed: true, submittedAt: '2026-05-18T10:00:00Z' },
  { id: 'att-031', studentId: 'student-yeni-kurniawati', quizId: 'quiz-advance', classId: 'gen6-advance-a', score: 100, passed: true, submittedAt: '2026-05-20T11:00:00Z' },
  { id: 'att-032', studentId: 'student-teguh-wibowo', quizId: 'quiz-advance', classId: 'gen6-advance-b', score: 80, passed: true, submittedAt: '2026-05-22T09:00:00Z' },
  { id: 'att-033', studentId: 'student-rahma-aulia', quizId: 'quiz-reguler', classId: 'gen6-reguler-a', score: 80, passed: true, submittedAt: '2026-05-25T10:30:00Z' },
  { id: 'att-034', studentId: 'student-farida-hanum', quizId: 'quiz-reguler', classId: 'gen6-reguler-b', score: 60, passed: false, submittedAt: '2026-05-28T09:00:00Z' },
  { id: 'att-035', studentId: 'student-farida-hanum', quizId: 'quiz-reguler', classId: 'gen6-reguler-b', score: 100, passed: true, submittedAt: '2026-06-01T11:00:00Z' },
  { id: 'att-036', studentId: 'student-kevin-oktavian', quizId: 'quiz-reguler', classId: 'gen6-reguler-c', score: 80, passed: true, submittedAt: '2026-06-05T10:00:00Z' },
  { id: 'att-037', studentId: 'student-ayu-widiastuti', quizId: 'quiz-reguler', classId: 'gen6-reguler-a', score: 80, passed: true, submittedAt: '2026-06-08T09:30:00Z' },
  { id: 'att-038', studentId: 'student-siti-rahayu', quizId: 'quiz-reguler', classId: 'gen6-reguler-c', score: 80, passed: true, submittedAt: '2026-06-10T10:00:00Z' },
  { id: 'att-039', studentId: 'student-agus-setiawan', quizId: 'quiz-reguler', classId: 'gen6-reguler-a', score: 60, passed: false, submittedAt: '2026-06-12T14:00:00Z' },
  { id: 'att-040', studentId: 'student-deni-firmansyah', quizId: 'quiz-reguler', classId: 'gen6-reguler-b', score: 80, passed: true, submittedAt: '2026-06-15T09:00:00Z' },
  { id: 'att-041', studentId: 'student-novia-anggraini', quizId: 'quiz-advance', classId: 'gen6-advance-c', score: 100, passed: true, submittedAt: '2026-06-18T11:00:00Z' },
  { id: 'att-042', studentId: 'student-yusuf-hakim', quizId: 'quiz-advance', classId: 'gen6-advance-c', score: 80, passed: true, submittedAt: '2026-06-22T10:00:00Z' },
  { id: 'att-043', studentId: 'student-hendra-wijaya', quizId: 'quiz-reguler', classId: 'gen6-reguler-b', score: 80, passed: true, submittedAt: '2026-06-25T09:30:00Z' },
  { id: 'att-044', studentId: 'student-dewi-kusuma', quizId: 'quiz-advance', classId: 'gen6-advance-a', score: 80, passed: true, submittedAt: '2026-06-28T10:30:00Z' },
  { id: 'att-045', studentId: 'student-rizki-ramadhan', quizId: 'quiz-reguler', classId: 'gen6-reguler-c', score: 80, passed: true, submittedAt: '2026-07-02T09:00:00Z' },
];

// [MOCK DATA] Historical stats from legacy system — will be replaced by real DB aggregates
export const PLATFORM_STATS = {
  totalAlumni: 35247,        // Total users across all generations (imported dari sistem lama)
  totalRevenue: 892_500_000, // Historical revenue sejak Gen 1
  activeGeneration: 'Generasi 6',
  activeStudents: 847,       // Aktif di Gen 6
  totalGenerations: 6,
  totalClasses: 36,
  avgPassRate: 94.2,
  platformFeePercent: 5,     // 5% revenue share ke platform
  maintenanceFeeMonthly: 500_000,
} as const;

// Main State Initializer for Local Storage (Client-side persistence)
export const getOrInitState = () => {
  const isBrowser = typeof window !== 'undefined';
  if (!isBrowser) {
    return {
      classes: INITIAL_CLASSES,
      students: DEFAULT_STUDENTS,
      forumPosts: DEFAULT_FORUM_POSTS,
      transactions: DEFAULT_TRANSACTIONS,
      attempts: DEFAULT_QUIZ_ATTEMPTS,
    };
  }

  const storedClasses = localStorage.getItem('lms_classes');
  const storedStudents = localStorage.getItem('lms_students');
  const storedForum = localStorage.getItem('lms_forum_posts');
  const storedTransactions = localStorage.getItem('lms_transactions');
  const storedAttempts = localStorage.getItem('lms_attempts');

  let classes = INITIAL_CLASSES;
  let students = DEFAULT_STUDENTS;
  let forumPosts = DEFAULT_FORUM_POSTS;
  let transactions = DEFAULT_TRANSACTIONS;
  let attempts: QuizAttempt[] = DEFAULT_QUIZ_ATTEMPTS;

  // Always use fresh classes to reflect static data updates
  localStorage.setItem('lms_classes', JSON.stringify(classes));

  if (storedStudents) students = JSON.parse(storedStudents);
  else localStorage.setItem('lms_students', JSON.stringify(students));

  if (storedForum) forumPosts = JSON.parse(storedForum);
  else localStorage.setItem('lms_forum_posts', JSON.stringify(forumPosts));

  if (storedTransactions) transactions = JSON.parse(storedTransactions);
  else localStorage.setItem('lms_transactions', JSON.stringify(transactions));

  if (storedAttempts) attempts = JSON.parse(storedAttempts);
  else localStorage.setItem('lms_attempts', JSON.stringify(attempts));

  return { classes, students, forumPosts, transactions, attempts };
};

export const saveState = (state: {
  classes: Class[];
  students: User[];
  forumPosts: ForumPost[];
  transactions: Transaction[];
  attempts: QuizAttempt[];
}) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('lms_classes', JSON.stringify(state.classes));
  localStorage.setItem('lms_students', JSON.stringify(state.students));
  localStorage.setItem('lms_forum_posts', JSON.stringify(state.forumPosts));
  localStorage.setItem('lms_transactions', JSON.stringify(state.transactions));
  localStorage.setItem('lms_attempts', JSON.stringify(state.attempts));
};
