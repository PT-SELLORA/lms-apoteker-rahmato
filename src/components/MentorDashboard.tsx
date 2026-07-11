import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Layers,
  Users,
  DollarSign,
  PlusCircle,
  Search,
  Filter,
  CheckCircle,
  MessageSquare,
  BookOpen,
  UserCheck,
  FileText,
  ChevronRight,
  AlertCircle,
  Award,
  Video,
  Send
} from 'lucide-react';
import { Class, User, Transaction, QuizAttempt, ForumPost, Generation } from '../types';
import { MENTOR_RAHMATO, GENERATIONS } from '../data/coursesData';

interface MentorDashboardProps {
  classes: Class[];
  students: User[];
  transactions: Transaction[];
  attempts: QuizAttempt[];
  forumPosts: ForumPost[];
  onAddMaterial: (classId: string, title: string, type: 'video' | 'pdf', description: string, durationOrPages: string, content: string) => void;
  onAddStudent: (name: string, email: string, profession: User['profession'], initialClassId?: string) => void;
  onAddForumReply: (postId: string, content: string) => void;
  onLogOut: () => void;
}

export default function MentorDashboard({
  classes,
  students,
  transactions,
  attempts,
  forumPosts,
  onAddMaterial,
  onAddStudent,
  onAddForumReply,
  onLogOut,
}: MentorDashboardProps) {
  // Navigation State inside Admin
  const [adminTab, setAdminTab] = useState<'stats' | 'generations' | 'students' | 'transactions' | 'content-editor' | 'forum'>('stats');
  
  // Filtering & Search states
  const [studentSearch, setStudentSearch] = useState('');
  const [studentProfessionFilter, setStudentProfessionFilter] = useState<string>('All');
  
  // Selected generation for detailed class viewing
  const [selectedGenId, setSelectedGenId] = useState<string>('gen6');

  // Form states for adding material
  const [materialClassId, setMaterialClassId] = useState<string>(classes[0]?.id || '');
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialType, setMaterialType] = useState<'video' | 'pdf'>('pdf');
  const [materialDesc, setMaterialDesc] = useState('');
  const [materialLength, setMaterialLength] = useState('');
  const [materialContent, setMaterialContent] = useState('');
  const [materialSuccess, setMaterialSuccess] = useState(false);

  // Form states for adding student
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentProfession, setNewStudentProfession] = useState<User['profession']>('Apoteker');
  const [newStudentClassId, setNewStudentClassId] = useState<string>('');
  const [studentSuccess, setStudentSuccess] = useState(false);

  // Forum state inside Admin
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});

  // Calculations
  const totalRevenue = transactions
    .filter((t) => t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  // Add a simulation value for previous generations (thousands of users)
  const simulatedHistoricalStudents = 2450;
  const activeStudentsCount = students.length;
  const totalStudentsCombined = simulatedHistoricalStudents + activeStudentsCount;

  // Filter students based on search and profession filter
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesProfession =
      studentProfessionFilter === 'All' || s.profession === studentProfessionFilter;
    return matchesSearch && matchesProfession;
  });

  // Handle adding lesson/material
  const handleMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialTitle.trim() || !materialContent.trim()) return;

    onAddMaterial(
      materialClassId,
      materialTitle,
      materialType,
      materialDesc || 'Bahan ajar tambahan yang diterbitkan oleh Apoteker Rahmato.',
      materialLength || (materialType === 'pdf' ? '12 Halaman' : '20 Menit'),
      materialContent
    );

    setMaterialTitle('');
    setMaterialDesc('');
    setMaterialLength('');
    setMaterialContent('');
    setMaterialSuccess(true);
    setTimeout(() => setMaterialSuccess(false), 3000);
  };

  // Handle manual student registration
  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentEmail.trim()) return;

    onAddStudent(newStudentName, newStudentEmail, newStudentProfession, newStudentClassId || undefined);
    
    setNewStudentName('');
    setNewStudentEmail('');
    setNewStudentClassId('');
    setStudentSuccess(true);
    setTimeout(() => setStudentSuccess(false), 3000);
  };

  // Handle replying to forum
  const handleSendAdminReply = (postId: string) => {
    const text = replyContent[postId];
    if (!text || !text.trim()) return;

    onAddForumReply(postId, text);
    setReplyContent((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="bg-[#0F1115] min-h-screen text-[#F3F4F6]">
      
      {/* Tab Navigation */}
      <div className="bg-[#16181D] text-white border-b border-white/10 sticky top-14 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs sm:text-sm">
          {[
            { id: 'stats', label: 'Dashboard Stats', icon: TrendingUp },
            { id: 'generations', label: '6 Generasi', icon: Layers },
            { id: 'students', label: 'Data Mahasiswa', icon: Users },
            { id: 'transactions', label: 'Billing', icon: DollarSign },
            { id: 'content-editor', label: 'Rilis Materi', icon: PlusCircle },
            { id: 'forum', label: 'Konsultasi', icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <button
            onClick={onLogOut}
            className="text-xs px-3 py-1.5 border border-white/10 hover:bg-white/5 text-slate-300 rounded-lg transition ml-auto shrink-0 cursor-pointer"
          >
            Keluar Panel
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: DASHBOARD STATS */}
        {adminTab === 'stats' && (
          <div className="space-y-8">
            
            {/* Welcome message */}
            <div>
              <h1 className="text-2xl font-black text-white">Selamat Datang, Apoteker Rahmato!</h1>
              <p className="text-slate-400 text-sm mt-1">Sistem LMS berjalan optimal. Berikut ringkasan performa pendaftaran kelas serta rincian analitis.</p>
            </div>

            {/* Metric widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-[#16181D] border border-white/10 rounded-2xl p-6 shadow-lg flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Omset Pendaftaran</div>
                  <div className="text-xl font-black text-white mt-1">Rp {totalRevenue.toLocaleString('id-ID')}</div>
                  <div className="text-[10px] text-emerald-400 font-bold mt-0.5">Realtime Gateway</div>
                </div>
              </div>

              <div className="bg-[#16181D] border border-white/10 rounded-2xl p-6 shadow-lg flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Peserta</div>
                  <div className="text-xl font-black text-white mt-1">{totalStudentsCombined.toLocaleString('id-ID')} Orang</div>
                  <div className="text-[10px] text-emerald-400 font-bold mt-0.5">Simulasi Alumni + Aktif</div>
                </div>
              </div>

              <div className="bg-[#16181D] border border-white/10 rounded-2xl p-6 shadow-lg flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                  <Layers className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Siklus Angkatan</div>
                  <div className="text-xl font-black text-white mt-1">6 Generasi</div>
                  <div className="text-[10px] text-emerald-400 font-bold mt-0.5">6 Kelas Tiap Generasi (36 total)</div>
                </div>
              </div>

              <div className="bg-[#16181D] border border-white/10 rounded-2xl p-6 shadow-lg flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tingkat Kelulusan</div>
                  <div className="text-xl font-black text-white mt-1">
                    {attempts.length > 0
                      ? Math.round((attempts.filter((a) => a.passed).length / attempts.length) * 100)
                      : 84}%
                  </div>
                  <div className="text-[10px] text-emerald-400 font-bold mt-0.5">Rata-rata Kelulusan Kuis</div>
                </div>
              </div>

            </div>

            {/* Custom SVG Charts with beautiful bento styling */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Sales Chart (simulated months) */}
              <div className="lg:col-span-8 bg-[#16181D] border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white">Performa Transaksi & Revenue (Bulan Ini)</h3>
                  <span className="text-[10px] bg-white/5 text-slate-300 font-bold px-2 py-0.5 rounded border border-white/5">Rupiah (IDR)</span>
                </div>

                <div className="h-64 flex items-end gap-3 pt-6 relative border-b border-white/10">
                  {/* Visual Background gridlines */}
                  <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-white/5" />
                  <div className="absolute inset-x-0 top-2/4 border-t border-dashed border-white/5" />
                  <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-white/5" />

                  {/* Monthly bars (Simulated) */}
                  {[
                    { month: 'Feb', val: 3200000, color: 'bg-slate-700' },
                    { month: 'Mar', val: 4500000, color: 'bg-slate-600' },
                    { month: 'Apr', val: 5800000, color: 'bg-emerald-600/60' },
                    { month: 'Mei', val: 8200000, color: 'bg-emerald-500/60' },
                    { month: 'Jun', val: 12500000, color: 'bg-emerald-500/80' },
                    { month: 'Jul (Kini)', val: totalRevenue || 2400000, color: 'bg-emerald-500' },
                  ].map((item, idx) => {
                    const maxVal = 14000000;
                    const heightPercent = `${(item.val / maxVal) * 100}%`;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 z-10">
                        <div className="text-[9px] font-bold text-slate-400">Rp {(item.val / 1000000).toFixed(1)}jt</div>
                        <div
                          style={{ height: heightPercent }}
                          className={`w-full rounded-t-lg transition-all duration-500 ${item.color} min-h-[10px]`}
                        />
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{item.month}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Student Demographics pie/bar */}
              <div className="lg:col-span-4 bg-[#16181D] border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
                <h3 className="font-bold text-white">Demografi Profesi Pendaftar</h3>
                
                <div className="space-y-4 pt-4">
                  {[
                    { label: 'Apoteker', count: 18, color: 'bg-emerald-500' },
                    { label: 'Dokter', count: 12, color: 'bg-teal-500' },
                    { label: 'Mahasiswa', count: 24, color: 'bg-emerald-600' },
                    { label: 'Perawat', count: 8, color: 'bg-teal-600' },
                    { label: 'Bidan', count: 5, color: 'bg-emerald-400' },
                  ].map((demo, idx) => {
                    const total = 67; // local mock baseline
                    const percent = Math.round((demo.count / total) * 100);
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-300">{demo.label}</span>
                          <span className="text-slate-400">{demo.count} orang ({percent}%)</span>
                        </div>
                        <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${percent}%` }}
                            className={`h-full rounded-full ${demo.color}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: GENERATIONS & 6 CLASSES DETAILED */}
        {adminTab === 'generations' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h1 className="text-2xl font-black text-white">6 Generasi Pelatihan</h1>
                <p className="text-slate-400 text-sm mt-1">Tiap generasi berjalan dengan kurikulum yang terpisah rapi ke dalam 6 jenis kelas (3 Reguler & 3 Advance).</p>
              </div>

              {/* Generation picker */}
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                {GENERATIONS.map((gen) => (
                  <button
                    key={gen.id}
                    onClick={() => setSelectedGenId(gen.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      selectedGenId === gen.id
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {gen.name.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>

            {/* Displaying the 6 classes for the selected generation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes
                .filter((c) => c.generationId === selectedGenId)
                .map((cls) => {
                  const isAdvance = cls.category === 'ADVANCE';
                  return (
                    <div
                      key={cls.id}
                      className="bg-[#16181D] border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide border ${
                            isAdvance 
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}>
                            {cls.category}
                          </span>
                          <span className="text-xs text-slate-400 font-bold">Aktif</span>
                        </div>
                        <h3 className="text-lg font-black text-white leading-tight">{cls.name}</h3>
                        <p className="text-slate-400 text-xs mt-2 leading-relaxed">{cls.description}</p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-bold">
                        <div>Harga Kelas: <span className="text-emerald-400">Rp {cls.price.toLocaleString('id-ID')}</span></div>
                        <div className="flex items-center gap-1 bg-white/5 px-2 py-1 border border-white/5 rounded text-slate-300">
                          <Users className="h-3 w-3 text-slate-400" />
                          {cls.studentsCount} Murid Terdaftar
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 3: STUDENT DATABASE */}
        {adminTab === 'students' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left side: Add Student form */}
            <div className="lg:col-span-4 bg-[#16181D] border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
              <h3 className="font-bold text-white text-base">Daftarkan Murid Secara Manual</h3>
              <p className="text-xs text-slate-400">Gunakan form ini untuk menyimulasikan pendaftaran langsung secara manual via admin untuk murid baru.</p>

              {studentSuccess && (
                <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-semibold">
                  Siswa Berhasil Didaftarkan Manual!
                </div>
              )}

              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="Contoh: drg. Riska Amalia"
                    className="w-full text-xs p-2.5 bg-[#0F1115] border border-white/10 rounded text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Email Aktif</label>
                  <input
                    type="email"
                    required
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                    placeholder="Contoh: riska.amalia@gmail.com"
                    className="w-full text-xs p-2.5 bg-[#0F1115] border border-white/10 rounded text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Profesi Medis</label>
                  <select
                    value={newStudentProfession}
                    onChange={(e) => setNewStudentProfession(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-[#0F1115] border border-white/10 rounded text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Apoteker" className="bg-[#16181D]">Apoteker</option>
                    <option value="Dokter" className="bg-[#16181D]">Dokter</option>
                    <option value="Mahasiswa" className="bg-[#16181D]">Mahasiswa Farmasi/Kedokteran</option>
                    <option value="Perawat" className="bg-[#16181D]">Perawat</option>
                    <option value="Bidan" className="bg-[#16181D]">Bidan</option>
                    <option value="Lainnya" className="bg-[#16181D]">Tenaga Medis Lainnya</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Daftarkan Langsung ke Kelas (Opsional)</label>
                  <select
                    value={newStudentClassId}
                    onChange={(e) => setNewStudentClassId(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#0F1115] border border-white/10 rounded text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="" className="bg-[#16181D]">-- Pilih Kelas Aktif --</option>
                    {classes
                      .filter((c) => c.generationId === 'gen6')
                      .map((c) => (
                        <option key={c.id} value={c.id} className="bg-[#16181D]">
                          {c.generationName} - {c.name}
                        </option>
                      ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer shadow-lg shadow-emerald-950/40"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Daftarkan Siswa</span>
                </button>
              </form>
            </div>

            {/* Right side: Student Database Table */}
            <div className="lg:col-span-8 bg-[#16181D] border border-white/10 rounded-2xl p-6 shadow-lg space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="font-bold text-white">Database Siswa Terdaftar ({filteredStudents.length})</h3>
                
                <div className="flex items-center gap-2">
                  {/* Search input */}
                  <div className="relative">
                    <Search className="h-4 w-4 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="Cari nama/email..."
                      className="text-xs pl-8 pr-3 py-2 bg-[#0F1115] border border-white/10 text-white rounded-lg w-40 sm:w-48 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Profession filter */}
                  <select
                    value={studentProfessionFilter}
                    onChange={(e) => setStudentProfessionFilter(e.target.value)}
                    className="text-xs p-2 bg-[#0F1115] border border-white/10 text-white rounded-lg focus:outline-none"
                  >
                    <option value="All" className="bg-[#16181D]">Semua Profesi</option>
                    <option value="Apoteker" className="bg-[#16181D]">Apoteker</option>
                    <option value="Dokter" className="bg-[#16181D]">Dokter</option>
                    <option value="Mahasiswa" className="bg-[#16181D]">Mahasiswa</option>
                    <option value="Perawat" className="bg-[#16181D]">Perawat</option>
                    <option value="Bidan" className="bg-[#16181D]">Bidan</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto border border-white/5 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-slate-300 border-b border-white/10 font-bold uppercase">
                      <th className="p-4">Nama & Email</th>
                      <th className="p-4">Profesi</th>
                      <th className="p-4">Daftar Kelas Aktif</th>
                      <th className="p-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                            <div>
                              <div className="font-bold text-white">{student.name}</div>
                              <div className="text-[10px] text-slate-400">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 text-slate-300 rounded-full font-semibold">
                            {student.profession}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {student.enrolledClasses.length === 0 ? (
                              <span className="text-slate-500 italic">Belum terdaftar</span>
                            ) : (
                              student.enrolledClasses.map((cid) => {
                                const cls = classes.find((c) => c.id === cid);
                                return (
                                  <span key={cid} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded font-bold text-[9px] uppercase border border-emerald-500/20">
                                    {cls?.name || cid}
                                  </span>
                                );
                              })
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-[10px] text-slate-400 font-bold">ID: {student.id.slice(0, 10)}...</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: TRANSACTION BILLING */}
        {adminTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h1 className="text-2xl font-black text-white">Log Keuangan & Transaksi</h1>
                <p className="text-slate-400 text-sm mt-1">Audit billing keuangan pendaftaran kelas yang masuk ke rekening LMS secara otomatis.</p>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 text-sm font-bold border border-emerald-500/20 flex items-center gap-1.5">
                <DollarSign className="h-5 w-5 shrink-0" />
                <span>Total Omset Terverifikasi: Rp {totalRevenue.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="bg-[#16181D] border border-white/10 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-slate-300 border-b border-white/10 uppercase font-bold">
                      <th className="p-4">ID Transaksi</th>
                      <th className="p-4">Nama Siswa / Email</th>
                      <th className="p-4">Kelas Dibeli</th>
                      <th className="p-4">Metode Bayar</th>
                      <th className="p-4">Tanggal Pembelian</th>
                      <th className="p-4">Nominal</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-mono font-bold text-slate-400">{tx.id}</td>
                        <td className="p-4">
                          <div className="font-bold text-white">{tx.userName}</div>
                          <div className="text-[10px] text-slate-400">{tx.userEmail}</div>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-white">{tx.className}</span>
                          <span className="block text-[10px] text-slate-400">{tx.generationName}</span>
                        </td>
                        <td className="p-4 text-slate-300 font-medium">{tx.paymentMethod}</td>
                        <td className="p-4 text-slate-400">{new Date(tx.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                        <td className="p-4 font-bold text-white">Rp {tx.amount.toLocaleString('id-ID')}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Sukses (Auto)
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: COURSE CONTENT EDITOR */}
        {adminTab === 'content-editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left side: Upload Material form */}
            <div className="lg:col-span-5 bg-[#16181D] border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
              <h3 className="font-bold text-white text-base">Rilis Materi & Modul Baru</h3>
              <p className="text-xs text-slate-400">Formulir rilis materi ajar untuk 36 kelas binaan Apoteker Rahmato. Begitu dikirim, modul akan langsung terbit realtime di kelas mahasiswa terkait.</p>

              {materialSuccess && (
                <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold">
                  Sukses! Materi ajar berhasil ditambahkan ke kelas terkait.
                  <p className="text-xs text-amber-400 mt-2">
                    {/* [MOCK] Materi disimpan di localStorage — akan dipersist ke Supabase Storage setelah backend aktif */}
                    ℹ️ Materi tersimpan lokal · Sinkronisasi ke cloud setelah backend aktif
                  </p>
                </div>
              )}

              <form onSubmit={handleMaterialSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase block">Pilih Kelas Binaan</label>
                    <select
                      value={materialClassId}
                      onChange={(e) => setMaterialClassId(e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#0F1115] border border-white/10 rounded text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    >
                      {classes
                        .filter((c) => c.generationId === 'gen6')
                        .map((c) => (
                          <option key={c.id} value={c.id} className="bg-[#16181D]">
                            {c.generationName} - {c.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase block">Tipe Materi</label>
                    <select
                      value={materialType}
                      onChange={(e) => setMaterialType(e.target.value as any)}
                      className="w-full text-xs p-2.5 bg-[#0F1115] border border-white/10 rounded text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="pdf" className="bg-[#16181D]">Modul PDF / Slideshow</option>
                      <option value="video" className="bg-[#16181D]">Kuliah Video Pembelajaran</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Judul Modul / Pokok Bahasan</label>
                  <input
                    type="text"
                    required
                    value={materialTitle}
                    onChange={(e) => setMaterialTitle(e.target.value)}
                    placeholder="Contoh: Modul V: Regulasi Beyond Use Date Sediaan Krim Racikan"
                    className="w-full text-xs p-2.5 bg-[#0F1115] border border-white/10 rounded text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase block">Deskripsi Singkat</label>
                    <input
                      type="text"
                      value={materialDesc}
                      onChange={(e) => setMaterialDesc(e.target.value)}
                      placeholder="Ringkasan poin bahasan..."
                      className="w-full text-xs p-2.5 bg-[#0F1115] border border-white/10 rounded text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase block">Panjang (Halaman / Menit)</label>
                    <input
                      type="text"
                      value={materialLength}
                      onChange={(e) => setMaterialLength(e.target.value)}
                      placeholder="Contoh: 18 Halaman"
                      className="w-full text-xs p-2.5 bg-[#0F1115] border border-white/10 rounded text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Isi Dokumen / Konten (Markdown Didukung)</label>
                  <textarea
                    required
                    rows={6}
                    value={materialContent}
                    onChange={(e) => setMaterialContent(e.target.value)}
                    placeholder="Tulis draf naskah materi..."
                    className="w-full text-xs p-2.5 bg-[#0F1115] border border-white/10 rounded text-white font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition cursor-pointer shadow-lg shadow-emerald-950/40"
                >
                  Terbitkan Modul Riil
                </button>
              </form>
            </div>

            {/* Right side: Materials catalog overview by class */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-[#16181D] border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
                <h3 className="font-bold text-white">Kurikulum Kelas Terdaftar (Simulasi Realtime)</h3>
                <p className="text-xs text-slate-400">Rincian modul ajar aktif. Modul yang Anda tambahkan melalui formulir di kiri akan langsung bertambah dan muncul pada daftar di bawah ini!</p>

                <div className="divide-y divide-white/5">
                  {classes
                    .filter((c) => c.generationId === 'gen6')
                    .map((cls) => (
                      <div key={cls.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm text-white">{cls.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{cls.generationName}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-0.5 bg-white/5 text-slate-300 border border-white/5 rounded text-[9px] font-bold flex items-center gap-1">
                            <BookOpen className="h-3 w-3" /> {cls.materialsCount} Modul Default
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[9px] font-bold border border-emerald-500/20">
                            + Interaktif Realtime
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 6: FORUM CONSULTATION */}
        {adminTab === 'forum' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-white">Ruang Konsultasi Resep & Obat</h1>
              <p className="text-slate-400 text-sm mt-1">Sebagai Apoteker Rahmato, berikan solusi klinis yang asertif dan aman terhadap permasalahan terkait terapi obat (DTPs) yang diajukan para sejawat medis.</p>
            </div>

            <div className="space-y-6">
              {forumPosts.length === 0 ? (
                <div className="text-center py-12 bg-[#16181D] rounded-2xl border border-white/10 text-slate-400 text-xs">
                  Tidak ada pertanyaan atau konsultasi masuk saat ini.
                </div>
              ) : (
                forumPosts.map((post) => {
                  const targetClass = classes.find((c) => c.id === post.classId);
                  return (
                    <div key={post.id} className="bg-[#16181D] border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
                      
                      {/* Thread Header */}
                      <div className="flex items-start justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-3">
                          <img src={post.avatar} alt={post.userName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-white text-sm">{post.userName}</h4>
                              <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-slate-300 text-[9px] font-bold rounded">
                                {post.userProfession}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Diajukan di kelas: <strong className="text-slate-300">{targetClass?.name}</strong> • {new Date(post.createdAt).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                        </div>

                        <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded-full border border-amber-500/20 uppercase shrink-0">
                          Butuh Jawaban Apoteker Rahmato
                        </span>
                      </div>

                      {/* Thread content */}
                      <div className="space-y-2 pl-2">
                        <h3 className="font-black text-white text-base leading-snug">{post.title}</h3>
                        <p className="text-xs text-slate-300 leading-relaxed bg-[#0F1115] p-3 rounded-lg border border-white/5">{post.content}</p>
                      </div>

                      {/* Replies */}
                      <div className="space-y-3 pl-4 border-l-2 border-emerald-500 pt-2">
                        <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tanggapan Sejawat ({post.replies.length})</h4>
                        
                        {post.replies.map((reply) => (
                          <div key={reply.id} className="bg-white/5 p-3 rounded-xl border border-white/10 flex gap-3 items-start">
                            <img src={reply.avatar} alt={reply.userName} className="w-6 h-6 rounded-full object-cover shrink-0" />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h6 className="font-bold text-xs text-white">{reply.userName}</h6>
                                <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold border ${
                                  reply.userRole === 'mentor' 
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                                    : 'bg-white/5 text-slate-300 border-white/10'
                                }`}>
                                  {reply.userProfession}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 mt-1">{reply.content}</p>
                              <span className="text-[9px] text-slate-400 mt-1 block">{new Date(reply.createdAt).toLocaleDateString('id-ID')}</span>
                            </div>
                          </div>
                        ))}

                        {/* Add Admin reply */}
                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="text"
                            value={replyContent[post.id] || ''}
                            onChange={(e) =>
                                setReplyContent((prev) => ({ ...prev, [post.id]: e.target.value }))
                            }
                            placeholder="Tulis nasehat kefarmasian Anda sebagai Apoteker Rahmato..."
                            className="w-full text-xs p-2.5 bg-[#0F1115] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                          <button
                            onClick={() => handleSendAdminReply(post.id)}
                            className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition shrink-0 cursor-pointer shadow-lg shadow-emerald-950/40"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
