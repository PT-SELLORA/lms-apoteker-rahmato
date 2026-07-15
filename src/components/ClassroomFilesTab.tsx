import React, { useState } from 'react';
import { FileText, Download, Eye, Clock, CheckCircle2, ChevronLeft } from 'lucide-react';
import { Class, Material } from '../types';

interface ClassroomFilesTabProps {
  activeClass: Class;
  materials: Material[];
  onMaterialAccess: (materialId: string) => void;
}

export default function ClassroomFilesTab({ activeClass, materials, onMaterialAccess }: ClassroomFilesTabProps) {
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  const [downloadedFiles, setDownloadedFiles] = useState<Record<string, boolean>>({});
  const [readerFileId, setReaderFileId] = useState<string | null>(null);
  const [readerTextSize, setReaderTextSize] = useState<number>(14);
  const [readerTheme, setReaderTheme] = useState<'dark' | 'light'>('dark');
  const [readerCompleted, setReaderCompleted] = useState<Record<string, boolean>>({});

  const pdfList = materials.filter(m => m.type === 'pdf');
  const defaultPdfs = [
    {
      id: 'file-guide-bud',
      title: activeClass.category === 'ADVANCE'
        ? 'Panduan Praktis Beyond Use Date (BUD) Sediaan Obat Racikan USP 795'
        : 'Modul I: Pendahuluan Pelayanan Kefarmasian & Pharmaceutical Care',
      type: 'PDF Guideline',
      size: '1.2 MB',
      description: activeClass.category === 'ADVANCE'
        ? 'SOP resmi penentuan BUD sediaan puyer, kapsul, sirup kering, salep, krim, dan gel sesuai acuan standar internasional.'
        : 'Pemahaman mendasar mengenai filosofi asuhan kefarmasian, tanggung jawab apoteker, dan alur pelayanan resep dokter di fasilitas kesehatan.',
      pages: '16 Halaman',
      content: activeClass.category === 'ADVANCE'
        ? `### Panduan Praktis Beyond Use Date (BUD) USP <795>

Beyond Use Date (BUD) adalah batas waktu penggunaan sediaan obat setelah diracik, dikemas ulang, atau diproduksi dalam skala kecil. Berbeda dengan expiration date (ED) dari pabrik, BUD ditentukan berdasarkan stabilitas kimiawi, fisik, dan mikrobiologis obat racikan tersebut.

#### Aturan Standar Penentuan BUD:
1. **Sediaan Non-Air Padat (Kapsul, Tablet Racik, Puyer):**
   BUD tidak boleh melebihi 25% dari waktu kedaluwarsa bahan aktif pabrik yang tersisa, atau 6 bulan, dipilih yang mana yang lebih singkat.
2. **Sediaan Cair Oral Mengandung Air (Sirup Racik, Suspensi):**
   Maksimal 14 hari bila disimpan di lemari pendingin (suhu 2-8°C).
3. **Sediaan Topikal/Dermal Mengandung Air (Krim, Gel, Salep):**
   Maksimal 30 hari pada suhu kamar terkontrol.`
        : `### Dasar Pelayanan Kefarmasian (Pharmaceutical Care)

Pelayanan Kefarmasian adalah pelayanan langsung dan bertanggung jawab kepada pasien yang berkaitan dengan sediaan farmasi dengan maksud mencapai hasil yang pasti untuk meningkatkan mutu kehidupan pasien.

#### Elemen Kunci Pharmaceutical Care:
1. **Professional Relationship:** Hubungan profesional kemitraan antara apoteker dengan pasien/dokter.
2. **Drug Therapy Problems (DTPs) Identification:** Kemampuan mengidentifikasi, mencegah, dan mengatasi masalah terkait obat.
3. **Patient Care Plan:** Merancang, menerapkan, dan memantau rencana terapi obat bersama pasien.`
    },
    {
      id: 'file-fornas',
      title: activeClass.category === 'ADVANCE'
        ? 'Modul III: Farmakoterapi Kardiovaskular Lanjut & EBM dalam Hipertensi Resisten'
        : 'Modul III: Kalkulasi Farmasi Praktis & Teknik Pembuatan Sediaan Puyer/Kapsul',
      type: 'KMK RI / PDF',
      size: '4.8 MB',
      description: activeClass.category === 'ADVANCE'
        ? 'Evaluasi uji klinis acak (RCT) terbaru terkait kombinasi obat antihipertensi quad-therapy pada pasien hipertensi resisten tak terkontrol.'
        : 'Latihan perhitungan dosis anak berdasarkan berat badan, konversi dosis, perhitungan dtd resep puyer, serta analisis stabilitas obat (Beyond Use Date).',
      pages: '28 Halaman',
      content: activeClass.category === 'ADVANCE'
        ? `### Hipertensi Resisten: Perspektif Evidence-Based Medicine (EBM)

Hipertensi resisten didefinisikan sebagai tekanan darah yang tetap berada di atas target klinis meskipun telah menggunakan tiga kelas obat antihipertensi yang berbeda (termasuk diuretik, biasanya blocker saluran kalsium dan penghambat ACE atau ARB) pada dosis yang optimal.

#### Algoritma Terapi Berbasis Bukti (AHA/ESC):
1. **Verifikasi Kepatuhan Pasien:** Singkirkan hipertensi "semu" akibat pasien tidak minum obat atau efek "white-coat".
2. **Restriksi Natrium & Modifikasi Gaya Hidup:** Pengurangan asupan garam secara agresif.`
        : `### Perhitungan Farmasi Praktis & Beyond Use Date (BUD)

Kalkulasi farmasi yang presisi adalah pilar utama keselamatan pasien (patient safety). Kesalahan takaran dosis dapat berakibat fatal, terutama pada populasi pediatrik dan geriatrik.`
    },
    {
      id: 'file-icu-interactions',
      title: 'Lembar Saku Analisis Interaksi Obat Kritis di Ruang ICU & IGD',
      type: 'Clinical Sheet',
      size: '850 KB',
      description: 'Tabel cepat screening interaksi obat kritis tingkat mayor antara obat antikoagulan, vasopresor, inotropik, sedatif, dan antibiotik broad-spectrum.',
      pages: '4 Halaman',
      content: `### Lembar Saku Screening Interaksi Obat ICU

Tabel interaksi klinis kritis yang memerlukan monitoring ketat atau penggantian terapi segera:

#### 1. Amiodarone + Levofloxacin
- **Efek:** Peningkatan risiko perpanjangan interval QT dan aritmia Torsades de Pointes.
- **Rekomendasi:** Monitor EKG harian secara ketat, hindari kombinasi jika terdapat alternatif antibiotic seperti Ceftriaxone.

#### 2. Warfarin + Metronidazole
- **Efek:** Peningkatan kadar Warfarin secara drastis akibat inhibisi enzim CYP2C9, memicu perdarahan internal hebat.`
    }
  ];

  const materialsPdfs = pdfList.map(m => ({
    id: m.id,
    title: m.title,
    type: 'Modul Utama (PDF)',
    size: m.durationOrPages.includes('Halaman') ? `${parseInt(m.durationOrPages) * 45} KB` : '1.5 MB',
    description: m.description,
    pages: m.durationOrPages,
    content: m.content,
    url: m.documentUrl as string | undefined,
  }));

  const finalFiles = [
    ...materialsPdfs,
    ...defaultPdfs.map(f => ({ ...f, url: undefined as string | undefined })),
  ];
  const activeReadFile = finalFiles.find(f => f.id === readerFileId);

  const startDownload = (fileId: string) => {
    if (downloadProgress[fileId] !== undefined) return;
    setDownloadProgress(prev => ({ ...prev, [fileId]: 0 }));
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setDownloadedFiles(prev => ({ ...prev, [fileId]: true }));
      }
      setDownloadProgress(prev => ({ ...prev, [fileId]: progress }));
    }, 150);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      {/* Files List Panel (12 cols if reading not active, 5 cols if reading) */}
      <div className={`${activeReadFile ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-4`}>
        <div className="flex items-center justify-between">
          <h3 className="font-display font-medium text-sm text-slate-300">File & Dokumen Referensi Tersedia</h3>
          {activeReadFile && (
            <button
              onClick={() => setReaderFileId(null)}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Tutup Pembaca
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {finalFiles.map((file) => {
            const prog = downloadProgress[file.id];
            const isDone = downloadedFiles[file.id];
            const isReadingThis = readerFileId === file.id;

            return (
              <div
                key={file.id}
                className={`p-4 bg-[#16181D] border rounded-2xl transition flex flex-col justify-between gap-4 ${
                  isReadingThis
                    ? 'border-emerald-500/50 shadow-md bg-emerald-500/[0.02]'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded">
                        {file.type}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">{file.size}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {file.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {file.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3" /> {file.pages}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (file.url) {
                          window.open(file.url, '_blank', 'noopener');
                        } else {
                          setReaderFileId(file.id);
                        }
                        onMaterialAccess(file.id);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                        isReadingThis
                          ? 'bg-emerald-500 text-black'
                          : 'bg-[#0F1115] hover:bg-white/5 border border-white/10 text-slate-300'
                      }`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>{file.url ? 'Buka Dokumen' : 'Baca Online'}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (file.url) {
                          window.open(file.url, '_blank', 'noopener');
                          onMaterialAccess(file.id);
                          return;
                        }
                        startDownload(file.id);
                        onMaterialAccess(file.id);
                      }}
                      disabled={prog !== undefined && !isDone}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                        isDone
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                          : prog !== undefined
                          ? 'bg-white/5 text-slate-500 border border-white/5'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-black'
                      }`}
                    >
                      {isDone ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Terunduh</span>
                        </>
                      ) : prog !== undefined ? (
                        <span>{prog}%</span>
                      ) : (
                        <>
                          <Download className="h-3.5 w-3.5" />
                          <span>Unduh</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {prog !== undefined && !isDone && (
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${prog}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Online Document Reader Screen (7 cols if reading) */}
      {activeReadFile && (
        <div className="lg:col-span-7 bg-[#16181D] border border-emerald-500/20 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="p-4 bg-[#0F1115] border-b border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span className="font-bold text-white truncate max-w-[200px] sm:max-w-xs">{activeReadFile.title}</span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1 border border-white/10 rounded-lg overflow-hidden bg-[#16181D]">
                <button
                  onClick={() => setReaderTextSize(prev => Math.max(11, prev - 1))}
                  className="px-2 py-1 text-slate-400 hover:text-white hover:bg-white/5 font-mono cursor-pointer"
                  title="Perkecil teks"
                >
                  A-
                </button>
                <span className="px-1 text-[10px] text-slate-500 font-mono font-bold">{readerTextSize}px</span>
                <button
                  onClick={() => setReaderTextSize(prev => Math.min(20, prev + 1))}
                  className="px-2 py-1 text-slate-400 hover:text-white hover:bg-white/5 font-mono cursor-pointer"
                  title="Perbesar teks"
                >
                  A+
                </button>
              </div>

              <button
                onClick={() => setReaderTheme(prev => prev === 'dark' ? 'light' : 'dark')}
                className="p-1.5 border border-white/10 bg-[#16181D] hover:bg-white/5 text-slate-400 hover:text-white rounded-lg font-bold cursor-pointer text-xs"
                title="Ganti tema pembaca"
              >
                {readerTheme === 'dark' ? '🌕' : '🌑'}
              </button>
            </div>
          </div>

          <div
            className={`p-6 max-h-[500px] overflow-y-auto leading-relaxed select-text font-serif text-left ${
              readerTheme === 'dark' ? 'bg-[#0F1115] text-slate-300' : 'bg-amber-50/95 text-[#1e1e1e]'
            }`}
            style={{ fontSize: `${readerTextSize}px` }}
          >
            <div className="whitespace-pre-wrap font-sans prose prose-invert">
              {activeReadFile.content || "Isi dokumen modul pembelajaran ini tidak dapat diuraikan secara otomatis."}
            </div>
          </div>

          <div className="p-4 bg-[#0F1115] border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-mono">Status Membaca:</span>
            <label className="flex items-center gap-2 text-slate-300 font-bold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!!readerCompleted[activeReadFile.id]}
                onChange={(e) => {
                  setReaderCompleted(prev => ({ ...prev, [activeReadFile.id]: e.target.checked }));
                }}
                className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
              />
              <span className={readerCompleted[activeReadFile.id] ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                {readerCompleted[activeReadFile.id] ? 'Telah Selesai Dibaca ✓' : 'Tandai Selesai Dibaca'}
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
