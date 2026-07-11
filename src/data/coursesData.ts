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

  return [
    {
      id: `${classId}-mat-intro-pdf`,
      classId,
      title: isAdvance
        ? 'Modul Suplemen: Farmakokinetika Klinik & Penyesuaian Dosis Gangguan Ginjal'
        : 'Modul Suplemen: Pelayanan Kefarmasian & Pharmaceutical Care',
      type: 'pdf',
      description: 'Materi suplemental pendahuluan untuk modul ini.',
      durationOrPages: '32 Halaman',
      content: isAdvance
        ? `### Pengantar Farmakokinetika Klinik pada Gangguan Ginjal\n\nPada pasien dengan gangguan fungsi ginjal, terjadi penurunan laju filtrasi glomerulus (GFR) yang berdampak signifikan pada eliminasi obat-obat yang sebagian besar diekskresikan melalui ginjal. Oleh karena itu, diperlukan penyesuaian dosis untuk mencegah akumulasi obat dan toksisitas.\n\n#### Rumus Cockcroft-Gault untuk Estimasi CrCl:\n\`\`\`\nCrCl (pria) = ((140 - usia) x berat badan (kg)) / (72 x serum kreatinin (mg/dL))\nCrCl (wanita) = CrCl (pria) x 0.85\n\`\`\`\n\n#### Strategi Penyesuaian Dosis:\n1. **Mengurangi Dosis (Dose Reduction):** Menjaga interval pemberian tetap sama, namun memotong dosis. Cocok untuk obat dengan indeks terapi sempit di mana kadar tunak (steady-state) stabil sangat penting.\n2. **Memperpanjang Interval (Interval Extension):** Dosis obat tetap sama, namun jarak waktu antar pemberian diperpanjang. Sesuai untuk obat dengan efek pasca-antibiotik (PAE) yang panjang seperti aminoglikosida.\n\n#### Contoh Studi Kasus:\nPasien wanita usia 65 tahun, BB 55 kg, Serum Kreatinin 1.8 mg/dL. Pasien mendapatkan terapi Ceftriaxone. Hitung klirens kreatinin pasien dan tentukan rekomendasi dosis penyesuaian.`
        : `### Dasar Pelayanan Kefarmasian (Pharmaceutical Care)\n\nPelayanan Kefarmasian adalah pelayanan langsung dan bertanggung jawab kepada pasien yang berkaitan dengan sediaan farmasi dengan maksud mencapai hasil yang pasti untuk meningkatkan mutu kehidupan pasien.\n\n#### Elemen Kunci Pharmaceutical Care:\n1. **Professional Relationship:** Hubungan profesional kemitraan antara apoteker dengan pasien/dokter.\n2. **Drug Therapy Problems (DTPs) Identification:** Kemampuan mengidentifikasi, mencegah, dan mengatasi masalah terkait obat.\n3. **Patient Care Plan:** Merancang, menerapkan, dan memantau rencana terapi obat bersama pasien.\n\n#### Kategori Drug Therapy Problems (DTPs) menurut PCNE:\n- Terapi tidak efektif (Ineffective drug therapy)\n- Efek samping obat (Adverse drug event)\n- Overdosis atau Underdosis\n- Ketidakpatuhan pasien (Non-compliance)\n- Indikasi yang tidak diobati (Untreated indication)\n\nSebagai tenaga kesehatan profesional, kita wajib menerapkan pelayanan berpusat pada pasien (patient-centered care).`
    },
    ...videoMaterials,
    {
      id: `${classId}-mat-quiz`,
      classId,
      title: 'Ujian Akhir Modul & Studi Kasus Kefarmasian',
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

// Seed 3 active users
export const DEFAULT_STUDENTS: User[] = [
  {
    id: 'student-farhan',
    name: 'dr. Farhan Malik',
    email: 'farhan.malik@gmail.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=60',
    profession: 'Dokter',
    enrolledClasses: ['gen6-advance-a', 'gen6-reguler-b'], // Farhan is in 2 classes in Generasi 6
    completedClasses: ['gen6-reguler-a'], // Finished previously
  },
  {
    id: 'student-siti',
    name: 'Siti Aminah, S.Farm',
    email: 'siti.aminah@gmail.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=150&auto=format&fit=crop&q=60',
    profession: 'Mahasiswa',
    enrolledClasses: ['gen6-reguler-a'], // Siti is only in Reguler A Generasi 6
    completedClasses: [],
  },
  {
    id: 'student-budi',
    name: 'Budi Santoso, Apt',
    email: 'budi.santoso@gmail.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=60',
    profession: 'Apoteker',
    enrolledClasses: ['gen6-advance-b'],
    completedClasses: ['gen5-reguler-c', 'gen6-advance-c'],
  }
];

// Default forum posts
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
  }
];

// Preloaded mock transactions to populate the sales statistics
export const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    userId: 'student-farhan',
    userName: 'dr. Farhan Malik',
    userEmail: 'farhan.malik@gmail.com',
    classId: 'gen6-advance-a',
    className: 'ADVANCE A',
    generationName: 'Generasi 6',
    amount: 750000,
    status: 'success',
    paymentMethod: 'Bank Transfer (BCA)',
    createdAt: '2026-07-01T09:15:00Z',
  },
  {
    id: 'tx-002',
    userId: 'student-farhan',
    userName: 'dr. Farhan Malik',
    userEmail: 'farhan.malik@gmail.com',
    classId: 'gen6-reguler-b',
    className: 'REGULER B',
    generationName: 'Generasi 6',
    amount: 450000,
    status: 'success',
    paymentMethod: 'E-Wallet (GoPay)',
    createdAt: '2026-07-02T14:30:00Z',
  },
  {
    id: 'tx-003',
    userId: 'student-siti',
    userName: 'Siti Aminah, S.Farm',
    userEmail: 'siti.aminah@gmail.com',
    classId: 'gen6-reguler-a',
    className: 'REGULER A',
    generationName: 'Generasi 6',
    amount: 450000,
    status: 'success',
    paymentMethod: 'Virtual Account (Mandiri)',
    createdAt: '2026-07-03T11:20:00Z',
  },
  {
    id: 'tx-004',
    userId: 'student-budi',
    userName: 'Budi Santoso, Apt',
    userEmail: 'budi.santoso@gmail.com',
    classId: 'gen6-advance-b',
    className: 'ADVANCE B',
    generationName: 'Generasi 6',
    amount: 750000,
    status: 'success',
    paymentMethod: 'Bank Transfer (BNI)',
    createdAt: '2026-07-04T16:00:00Z',
  },
];

// Main State Initializer for Local Storage (Client-side persistence)
export const getOrInitState = () => {
  const isBrowser = typeof window !== 'undefined';
  if (!isBrowser) {
    return {
      classes: INITIAL_CLASSES,
      students: DEFAULT_STUDENTS,
      forumPosts: DEFAULT_FORUM_POSTS,
      transactions: DEFAULT_TRANSACTIONS,
      attempts: [] as QuizAttempt[],
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
  let attempts: QuizAttempt[] = [];

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
