import React from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Shield,
  Stethoscope,
  Heart,
} from 'lucide-react';
import { Generation, Class, User } from '../types';

interface LandingPageProps {
  generations: Generation[];
  classes: Class[];
  students: User[];
  currentStudentId: string;
  onSelectRole: (role: 'mentor' | 'student', studentId?: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const lineVariants = {
  hidden: { y: '120%', opacity: 0, rotate: 2 },
  visible: {
    y: 0,
    opacity: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 50, damping: 15, mass: 1 },
  },
};

const fadeUpVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 60, damping: 20 },
  },
};

const scaleUpVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 50, damping: 20 },
  },
};

export default function LandingPage({
  generations,
  classes,
  students,
  currentStudentId,
  onSelectRole,
}: LandingPageProps) {
  const totalStudentsCount = classes.reduce((acc, c) => acc + c.studentsCount, 0);
  const activeGenId = 'gen6';
  const featuredClasses = classes.filter((c) => c.generationId === activeGenId);

  return (
    <div className="bg-[#0F1115] text-slate-200 min-h-screen font-sans selection:bg-emerald-500/30">
      {/* Hero Section */}
      <div className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 border-b border-white/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Hero text */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-8"
          >
            <motion.div variants={fadeUpVariants} className="inline-flex items-center gap-3 px-4 py-2 bg-white text-black text-xs font-bold tracking-widest uppercase">
              <Sparkles className="h-4 w-4" />
              <span>Sistem Edukasi Farmasi</span>
            </motion.div>
            
            <div className="space-y-1">
              <div className="overflow-hidden">
                <motion.h1 variants={lineVariants} className="text-6xl sm:text-7xl lg:text-8xl font-black font-display tracking-tighter text-white uppercase leading-none">
                  AKSELERASI
                </motion.h1>
              </div>
              <div className="overflow-hidden">
                <motion.h1 variants={lineVariants} className="text-6xl sm:text-7xl lg:text-8xl font-black font-display tracking-tighter text-white uppercase leading-none">
                  KOMPETENSI
                </motion.h1>
              </div>
              <div className="overflow-hidden">
                <motion.h1 variants={lineVariants} className="text-6xl sm:text-7xl lg:text-8xl font-black font-display tracking-tighter text-emerald-500 uppercase leading-none">
                  KLINIS.
                </motion.h1>
              </div>
            </div>

            <motion.p variants={fadeUpVariants} className="text-slate-400 text-xl max-w-2xl leading-relaxed">
              Belajar asuhan kefarmasian praktis, farmakoterapi lanjut, kalkulasi klinis, dan swamedikasi berstandar nasional bersama <strong>Apoteker Rahmato</strong>.
            </motion.p>

            {/* Micro Stats */}
            <motion.div variants={fadeUpVariants} className="grid grid-cols-3 gap-0 pt-8 border-t border-white/20 mt-12 w-full max-w-xl">
              <div className="pr-6 border-r border-white/20">
                <div className="text-4xl font-black tracking-tighter text-white">6+</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mt-2 font-bold">Generasi</div>
              </div>
              <div className="px-6 border-r border-white/20">
                <div className="text-4xl font-black tracking-tighter text-white">{totalStudentsCount}+</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mt-2 font-bold">Alumni</div>
              </div>
              <div className="pl-6">
                <div className="text-4xl font-black tracking-tighter text-white">36</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mt-2 font-bold">Kelas</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Mentor Profile Spotlight Card */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 50, damping: 20, delay: 0.6 }}
            className="lg:col-span-5"
          >
            <div className="bg-[#111111] border border-white/20 p-8 space-y-8 relative overflow-hidden group">
              <div className="flex flex-col items-start gap-6">
                <motion.img
                  initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.8 }}
                  src="/apoteker.jpg"
                  alt="Apoteker Rahmato"
                  className="w-full aspect-[3/4] object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="w-full">
                  <h3 className="text-3xl font-black text-white tracking-tighter uppercase">APOTEKER RAHMATO</h3>
                  <p className="text-emerald-500 text-xs font-bold tracking-widest uppercase mt-2">Mentor Tunggal & Praktisi</p>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/20">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                  <Stethoscope className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>12+ thn Farmasi Klinik & ICU</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                  <Award className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Konsultan Regulasi Obat KFN</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Marquee Section */}
      <div className="py-8 border-b border-white/20 bg-[#0F1115] overflow-hidden relative flex flex-col items-center">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-6 z-10 relative">Referensi Klinis & Regulasi Terpercaya</p>

        {/* Left/Right Fade */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0F1115] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0F1115] to-transparent z-10" />

        <div className="w-full flex">
          <div className="animate-marquee flex gap-16 whitespace-nowrap items-center px-8">
            <span className="text-slate-600 font-display text-2xl font-black uppercase tracking-widest hover:text-white transition-colors duration-300">IAI</span>
            <span className="text-slate-600 font-display text-2xl font-black uppercase tracking-widest hover:text-white transition-colors duration-300">PAFI</span>
            <span className="text-slate-600 font-display text-2xl font-black uppercase tracking-widest hover:text-white transition-colors duration-300">KFN</span>
            <span className="text-slate-600 font-display text-2xl font-black uppercase tracking-widest hover:text-white transition-colors duration-300">BPOM</span>
            <span className="text-slate-600 font-display text-2xl font-black uppercase tracking-widest hover:text-white transition-colors duration-300">MIMS</span>
            <span className="text-slate-600 font-display text-2xl font-black uppercase tracking-widest hover:text-white transition-colors duration-300">Medscape</span>
            <span className="text-slate-600 font-display text-2xl font-black uppercase tracking-widest hover:text-white transition-colors duration-300">Kemenkes</span>
            <span className="text-slate-600 font-display text-2xl font-black uppercase tracking-widest hover:text-white transition-colors duration-300">IDI</span>

            {/* Duplicate for infinite effect */}
            <span className="text-slate-600 font-display text-2xl font-black uppercase tracking-widest hover:text-white transition-colors duration-300">IAI</span>
            <span className="text-slate-600 font-display text-2xl font-black uppercase tracking-widest hover:text-white transition-colors duration-300">PAFI</span>
            <span className="text-slate-600 font-display text-2xl font-black uppercase tracking-widest hover:text-white transition-colors duration-300">KFN</span>
            <span className="text-slate-600 font-display text-2xl font-black uppercase tracking-widest hover:text-white transition-colors duration-300">BPOM</span>
            <span className="text-slate-600 font-display text-2xl font-black uppercase tracking-widest hover:text-white transition-colors duration-300">MIMS</span>
            <span className="text-slate-600 font-display text-2xl font-black uppercase tracking-widest hover:text-white transition-colors duration-300">Medscape</span>
            <span className="text-slate-600 font-display text-2xl font-black uppercase tracking-widest hover:text-white transition-colors duration-300">Kemenkes</span>
            <span className="text-slate-600 font-display text-2xl font-black uppercase tracking-widest hover:text-white transition-colors duration-300">IDI</span>
          </div>
        </div>
      </div>

      {/* About Section (Swiss Style) */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 border-b border-white/20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div variants={fadeUpVariants} className="space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500 text-black text-xs font-bold tracking-widest uppercase">
              <span className="w-2 h-2 bg-black animate-pulse" />
              Tentang Masterclass
            </div>
            
            <h2 className="text-5xl sm:text-6xl font-black font-display tracking-tighter text-white uppercase leading-none">
              TRANSFORMASI<br />
              <span className="text-slate-500">EDUKASI FARMASI</span>
            </h2>
            
            <p className="text-slate-300 text-lg leading-relaxed border-l-4 border-emerald-500 pl-6">
              Farma Masterclass dibangun untuk memecahkan kesenjangan antara teori akademik dan realitas praktik klinis di lapangan. Kami menghadirkan kurikulum berbasis kasus nyata yang ditemui di rumah sakit dan komunitas.
            </p>
            
            <div className="pt-8 border-t border-white/20 flex gap-12">
              <div>
                <div className="text-5xl font-black tracking-tighter text-white mb-2">98<span className="text-emerald-500">%</span></div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Tingkat Kelulusan</div>
              </div>
              <div>
                <div className="text-5xl font-black tracking-tighter text-white mb-2">24<span className="text-emerald-500">/7</span></div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Akses Mentor</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={scaleUpVariants} className="relative">
            <div className="grid grid-cols-2 gap-0 relative z-10 border border-white/20 p-4 bg-[#111111]">
              <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop&q=80" alt="Clinical Pharmacy" className="object-cover w-full h-80 grayscale hover:grayscale-0 transition-all duration-700" />
              <img src="https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=400&fit=crop&q=80" alt="Laboratory" className="object-cover w-full h-80 grayscale hover:grayscale-0 transition-all duration-700 mt-12" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Role Switcher Sandbox Prompt */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 border-b border-white/20"
      >
        <div className="max-w-3xl mb-16">
          <motion.h2 variants={fadeUpVariants} className="text-4xl md:text-5xl font-black font-display text-white tracking-tighter uppercase">SANDBOX ENVIRONMENT</motion.h2>
          <motion.p variants={fadeUpVariants} className="text-slate-400 text-lg mt-4 max-w-2xl">
            Sebagai penguji, Anda dapat bebas beralih peran untuk melihat alur pendaftaran otomatis, Dashboard Murid, dan Dashboard Admin/Mentor Apoteker Rahmato.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/20">
          {/* Mentor Role card */}
          <motion.div variants={scaleUpVariants} className="group border-b md:border-b-0 md:border-r border-white/20 bg-[#111111] p-8 hover:bg-[#1a1a1a] transition-all duration-500 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="px-3 py-1 bg-emerald-500 text-black text-[10px] tracking-widest font-bold uppercase">Mentor</span>
                <Award className="h-6 w-6 text-emerald-500" />
              </div>
              <h4 className="font-display text-3xl font-black text-white mb-3 uppercase tracking-tighter">Apoteker Rahmato</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Kelola sirkulasi 6 Generasi, edit materi, analisis pendaftar, monitoring kuis, dan kelola transaksi.</p>
            </div>
            <button
              onClick={() => onSelectRole('mentor')}
              className="mt-12 w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Akses Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>

          {/* Preseeded Students */}
          {students.map((student, idx) => (
            <motion.div
              variants={scaleUpVariants}
              key={student.id}
              className={`group bg-black p-8 hover:bg-[#1a1a1a] transition-all duration-500 flex flex-col justify-between ${idx === 0 ? 'border-b md:border-b-0 md:border-r border-white/20' : ''}`}
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="px-3 py-1 bg-white text-black text-[10px] tracking-widest font-bold uppercase">
                    {student.profession}
                  </span>
                  <img src={student.avatar} alt={student.name} className="w-10 h-10 object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                </div>
                <h4 className="font-display text-3xl font-black text-white mb-3 uppercase tracking-tighter">{student.name.split(',')[0]}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Terdaftar di {student.enrolledClasses.length} kelas Generasi 6. Akses materi, kerjakan kuis, dan interaksi forum.
                </p>
              </div>
              <button
                onClick={() => onSelectRole('student', student.id)}
                className="mt-12 w-full py-4 border border-white/20 hover:bg-white text-white hover:text-black font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Belajar Sekarang</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Guest Role / Create new user */}
        <motion.div variants={fadeUpVariants} className="mt-8 p-8 border border-white/20 bg-[#111111] flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-emerald-500 transition-colors duration-500">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-emerald-500 text-black">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-black text-white mb-1 uppercase tracking-tighter">COBA PENDAFTARAN MURID BARU</p>
              <p className="text-sm text-slate-400">Pilih "Uji Coba Guest", beli kelas di katalog, dan sistem otomatis mendaftarkan Anda.</p>
            </div>
          </div>
          <button
            onClick={() => onSelectRole('student', 'guest')}
            className="w-full sm:w-auto py-4 px-8 border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-black font-black uppercase tracking-widest transition-all duration-300 shrink-0"
          >
            Uji Coba Guest
          </button>
        </motion.div>
      </motion.div>

      {/* Main Content Info */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Column classes info */}
          <div className="lg:col-span-7 space-y-16">
            <motion.div variants={fadeUpVariants}>
              <h2 className="text-5xl sm:text-6xl font-black font-display text-white tracking-tighter uppercase leading-none">PILIHAN KELAS<br/><span className="text-emerald-500">TERBANYAK DIBELI</span></h2>
              <p className="text-slate-400 mt-6 text-lg max-w-xl">Bergabunglah dengan ribuan tenaga kesehatan lainnya yang telah membuktikan kualitas kelas-kelas ini.</p>
            </motion.div>

            <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-white/20">
              {featuredClasses.map((cls, idx) => {
                const isAdvance = cls.category === 'ADVANCE';
                return (
                  <motion.div
                    variants={scaleUpVariants}
                    key={cls.id}
                    className={`group bg-[#111111] p-8 hover:bg-[#1a1a1a] transition-all duration-500 flex flex-col justify-between ${idx % 2 === 0 ? 'border-b sm:border-r border-white/20' : 'border-b border-white/20'}`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-8">
                        <span className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase ${
                          isAdvance 
                            ? 'bg-amber-500 text-black' 
                            : 'bg-emerald-500 text-black'
                        }`}>
                          {cls.category}
                        </span>
                        <span className="text-slate-500 text-xs flex items-center gap-1.5 font-bold">
                          <Users className="h-3.5 w-3.5" />
                          {cls.studentsCount}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-white mb-3 tracking-tighter uppercase">{cls.name}</h3>
                      <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">{cls.description}</p>
                    </div>

                    <div className="pt-8 mt-8 border-t border-white/20 flex items-end justify-between">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Investasi</div>
                        <div className="text-xl font-black text-emerald-500 tracking-tighter">
                          Rp {cls.price.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <button
                        onClick={() => onSelectRole('student', 'guest')}
                        className="w-10 h-10 flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-black text-white transition-all duration-300"
                        title="Beli kelas ini"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* System Highlights / Stats Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div variants={fadeUpVariants} className="bg-[#111111] border border-white/20 p-8">
              <h3 className="font-display text-3xl font-black text-white mb-4 uppercase tracking-tighter">
                Satu Generasi, Enam Kelas
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                LMS Apoteker Rahmato telah berjalan selama 6 generasi. Masing-masing generasi terbagi secara rapi ke dalam 6 kelas khusus yang berjalan beriringan:
              </p>

              <div className="space-y-0 border border-white/20">
                <div className="p-6 border-b border-white/20 bg-[#0a0a0a]">
                  <h4 className="font-black text-white flex items-center gap-3 tracking-widest uppercase">
                    <span className="w-2 h-2 bg-emerald-500" />
                    REGULER A, B, & C
                  </h4>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">Pembahasan materi fundamental, resep obat harian, kalkulasi dosis berat badan, asuhan dasar apoteker.</p>
                </div>
                <div className="p-6 bg-[#0a0a0a]">
                  <h4 className="font-black text-white flex items-center gap-3 tracking-widest uppercase">
                    <span className="w-2 h-2 bg-amber-500" />
                    ADVANCE A, B, & C
                  </h4>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">Analisis farmakokinetika klinis tingkat lanjut, monitoring resep ICU/IGD, asuhan komprehensif medis.</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUpVariants} className="bg-emerald-500 border border-emerald-500 text-black p-8 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 opacity-20">
                <GraduationCap className="h-64 w-64 text-black" />
              </div>
              <div className="relative z-10">
                <h3 className="font-display text-3xl font-black mb-4 uppercase tracking-tighter">AKSES INSTAN</h3>
                <p className="text-black/80 text-sm leading-relaxed mb-8 font-medium">
                  Sistem billing terintegrasi. Ketika murid memilih kelas dan menyelesaikan transaksi, sistem secara otomatis mendaftarkan UID ke dalam database. Murid dapat langsung mengakses kurikulum saat itu juga.
                </p>
                <div className="flex items-center gap-4 bg-black p-4 border border-black text-emerald-500">
                  <Heart className="h-5 w-5 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-widest leading-relaxed">Mendukung peningkatan kualitas SDM tenaga kesehatan Indonesia.</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 border-b border-white/20"
      >
        <div className="relative bg-[#111111] border border-white/20 p-12 md:p-24 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-50" />
          <motion.div variants={fadeUpVariants} className="relative z-10 max-w-4xl mx-auto space-y-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-white tracking-tighter uppercase leading-none">
              SIAP MENINGKATKAN <br />
              <span className="text-emerald-500">KOMPETENSI KLINIS?</span>
            </h2>
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Daftar sekarang dan dapatkan akses instan ke ratusan studi kasus riil, kalkulasi dosis interaktif, dan bimbingan langsung dari Apoteker Rahmato.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => onSelectRole('student', 'guest')}
                className="w-full sm:w-auto px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
              >
                <span>Beli Kelas Sekarang</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button 
                onClick={() => onSelectRole('student', 'student1')}
                className="w-full sm:w-auto px-10 py-5 bg-[#111111] hover:bg-white border border-white/20 hover:border-white text-white hover:text-black font-black tracking-widest uppercase transition-all duration-300"
              >
                Lihat Demo Murid
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Footer */}
      <footer className="bg-[#0a0a0a] text-slate-500 py-16 border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-emerald-500" />
              <span className="font-display text-white text-3xl font-black tracking-tighter uppercase">Farma Masterclass</span>
            </div>
            <p className="text-sm max-w-md font-medium leading-relaxed uppercase tracking-widest text-slate-400">
              Sistem LMS khusus untuk menyalurkan kurikulum klinis medis & farmasi. Dibimbing langsung oleh Apoteker Rahmato.
            </p>
          </div>
          <div className="flex md:justify-end items-end h-full">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
              © {new Date().getFullYear()} FARMA MASTERCLASS. ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
