import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, Award, Search, CheckCircle2 } from 'lucide-react';
import { Class, Material } from '../types';

interface ClassroomVideoTabProps {
  activeClass: Class;
  materials: Material[];
  onMaterialAccess: (materialId: string) => void;
  classId?: string;
}

export default function ClassroomVideoTab({ activeClass, materials, onMaterialAccess, classId }: ClassroomVideoTabProps) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [videoProgress, setVideoProgress] = useState<number>(15); // mock initial progress %
  const [videoVolume, setVideoVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [videoTime, setVideoTime] = useState<string>('08:12');
  const [userNote, setUserNote] = useState<string>('');
  const [noteSaved, setNoteSaved] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState('');

  // [MOCK] Video progress — akan diganti dengan API call ke Supabase
  const [watchedVideos, setWatchedVideos] = React.useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(`lms_watched_${classId ?? activeClass.id}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const markWatched = (videoId: string) => {
    const updated = new Set(watchedVideos);
    updated.add(videoId);
    setWatchedVideos(updated);
    localStorage.setItem(`lms_watched_${classId ?? activeClass.id}`, JSON.stringify([...updated]));
  };

  const videoList = materials.filter(m => m.type === 'video');
  // Video mock (topikal, dari playlist asli) — dipakai bila dosen belum mengisi
  // link video, supaya player tetap memutar sesuatu saat demo.
  const MOCK_YT_IDS = ['bIkqkGBnQwk', 'oVC7OzKto70', 'qLIsvtAUJ_k'];
  const defaultVideos: { id: string; title: string; description: string; duration: string; unsplashUrl: string; youtubeId?: string }[] = [
    {
      id: 'vid-1',
      title: activeClass.category === 'ADVANCE' 
        ? 'Modul II: Analisis Interaksi Obat Kritis di Intensive Care Unit (ICU)' 
        : 'Modul II: Komunikasi, Informasi & Edukasi (KIE) Konseling Obat Praktis',
      description: activeClass.category === 'ADVANCE'
        ? 'Kuliah video mendeteksi dan mengelola interaksi obat polifarmasi yang sering terjadi pada pasien kritis di ICU (misal: antikoagulan, sedatif, inotropik).'
        : 'Video panduan taktis melakukan konseling obat kepada pasien kronis (Diabetes, Hipertensi) menggunakan metode Three Prime Questions.',
      duration: '45 Menit',
      unsplashUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80',
      youtubeId: MOCK_YT_IDS[0],
    },
    {
      id: 'vid-2',
      title: activeClass.category === 'ADVANCE'
        ? 'Modul IV: Clinical Pharmacist Role dalam Antimicrobial Stewardship Program (ASP)'
        : 'Modul IV: Swamedikasi (Self-Medication) yang Aman & Rasional untuk Apoteker',
      description: activeClass.category === 'ADVANCE'
        ? 'Video bedah kasus penegakan panduan penggunaan antibiotik bijak, restriksi antibiotik reserve, dan pencegahan resistensi bakteri (MDRO) di rumah sakit.'
        : 'Kuliah interaktif mengenai batasan swamedikasi obat bebas (Wajib Apoteker) untuk keluhan batuk pilek, diare, demam, maag, dan pertolongan pertama.',
      duration: '50 Menit',
      unsplashUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
      youtubeId: MOCK_YT_IDS[1],
    },
    {
      id: 'vid-3',
      title: 'Materi Suplemen: Strategi Swamedikasi Penyakit Kronis & Tinjauan Aspek Hukum',
      description: 'Pembahasan tambahan oleh Apoteker Rahmato terkait etika penyerahan obat wajib apoteker dan rujukan cepat ke dokter spesialis.',
      duration: '35 Menit',
      unsplashUrl: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?w=800&auto=format&fit=crop&q=80',
      youtubeId: MOCK_YT_IDS[2],
    }
  ];

  const playlistVideos = videoList.map((m, idx) => ({
    id: m.id,
    // Bila video belum diberi link oleh dosen, pakai mock topikal agar tetap main.
    youtubeId: m.youtubeId || (m.id.length === 11 ? m.id : undefined) || MOCK_YT_IDS[idx % MOCK_YT_IDS.length],
    title: m.title,
    description: m.description,
    duration: m.durationOrPages,
    unsplashUrl: idx % 2 === 0 
      ? 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80'
  }));

  const fullPlaylist = playlistVideos.length > 0 ? playlistVideos : defaultVideos;
  const finalPlaylist = fullPlaylist.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const activeVideo = finalPlaylist.find(v => v.id === activeVideoId) || (finalPlaylist.length > 0 ? finalPlaylist[0] : fullPlaylist[0]);

  React.useEffect(() => {
    if (activeVideo) {
      onMaterialAccess(activeVideo.id);
    }
  }, [activeVideo?.id, onMaterialAccess]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      {/* Main Video Screen (Left Column 8 cols) */}
      <div className="lg:col-span-8 space-y-6">
        


        {/* Youtube Player Body */}
        <div className="relative bg-black rounded-2xl overflow-hidden border border-white/10 aspect-video group shadow-xl">
          {activeVideo.youtubeId ? (
            <iframe
              className="w-full h-full absolute inset-0"
              src={`https://www.youtube.com/embed/${activeVideo.youtubeId}`}
              title={activeVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          ) : (
            <>
              <img
                src={activeVideo.unsplashUrl}
                alt={activeVideo.title}
                className="w-full h-full object-cover opacity-35 select-none pointer-events-none"
              />

              {!isPlaying && (
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/25 transition cursor-pointer"
                >
                  <span className="w-16 h-16 bg-emerald-500 text-black rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-110 transition duration-300">
                    <Play className="h-8 w-8 fill-black stroke-none ml-1" />
                  </span>
                </button>
              )}

              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/10">
                  <div className="text-center space-y-3">
                    <span className="w-12 h-12 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center animate-ping mx-auto" />
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-black/50 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur">
                      Simulasi Video Streaming ({playbackSpeed}x)
                    </span>
                  </div>
                </div>
              )}

              {/* YouTube Controls Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex flex-col gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition duration-300">
                
                {/* Scrubber slider progress bar */}
                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percentage = Math.round((clickX / rect.width) * 100);
                    setVideoProgress(percentage);
                    const totalSeconds = parseInt(activeVideo.duration) * 60 || 2700;
                    const activeSeconds = Math.round((percentage / 100) * totalSeconds);
                    const mins = Math.floor(activeSeconds / 60).toString().padStart(2, '0');
                    const secs = (activeSeconds % 60).toString().padStart(2, '0');
                    setVideoTime(`${mins}:${secs}`);
                  }}
                  className="w-full h-1.5 bg-white/20 hover:h-2 rounded-full cursor-pointer relative transition"
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full"
                    style={{ width: `${videoProgress}%` }}
                  />
                  <div
                    className="absolute w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 shadow"
                    style={{ left: `${videoProgress}%` }}
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between mt-1 text-xs">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1 hover:text-emerald-400 transition"
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-1 hover:text-emerald-400 transition"
                      >
                        {isMuted ? <VolumeX className="h-5 w-5 text-rose-500" /> : <Volume2 className="h-5 w-5" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={isMuted ? 0 : videoVolume}
                        onChange={(e) => {
                          setVideoVolume(parseInt(e.target.value));
                          if (isMuted) setIsMuted(false);
                        }}
                        className="w-16 accent-emerald-500 cursor-pointer h-1 rounded bg-white/20"
                      />
                    </div>

                    <span className="text-slate-300 text-[11px] font-mono select-none">
                      {videoTime} / {activeVideo.duration}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">Kecepatan:</span>
                    {[0.5, 1, 1.25, 1.5, 2].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                          playbackSpeed === speed
                            ? 'bg-emerald-500 text-black font-extrabold'
                            : 'hover:bg-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </>
          )}
        </div>

        {/* Video Details Card */}
        <div className="bg-[#16181D] border border-white/10 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                Video Pembelajaran Aktif
              </span>
              <h2 className="text-xl font-display font-medium text-white">{activeVideo.title}</h2>
              <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                <span>Pemateri: <strong className="text-slate-200">Apoteker Rahmato</strong></span>
                <span>•</span>
                <span>Durasi: <strong className="text-slate-200">{activeVideo.duration}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => markWatched(activeVideo.id)}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  watchedVideos.has(activeVideo.id)
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 border border-white/10'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {watchedVideos.has(activeVideo.id) ? 'Sudah Ditonton' : 'Tandai Selesai'}
              </button>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-white/5">
            {activeVideo.description}
          </p>
        </div>

        {/* Notes Card */}
        <div className="bg-[#16181D] border border-white/10 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-medium text-sm text-white flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              Catatan Belajar Mandiri
            </h3>
            {noteSaved && (
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg animate-pulse">
                Tersimpan di Sistem Lokal!
              </span>
            )}
          </div>
          <textarea
            rows={3}
            value={userNote}
            onChange={(e) => {
              setUserNote(e.target.value);
              setNoteSaved(false);
            }}
            placeholder="Ketik catatan medis/farmasi penting di sini selama menonton video. Catatan disimpan di sistem belajar Anda..."
            className="w-full text-xs p-3 border border-white/10 bg-[#0F1115] text-white placeholder-slate-600 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <div className="flex justify-end">
            <button
              onClick={() => {
                if (!userNote.trim()) return;
                setNoteSaved(true);
                setTimeout(() => setNoteSaved(false), 3000);
              }}
              className="px-4 py-2 bg-[#0F1115] hover:bg-emerald-500 hover:text-black border border-white/10 text-slate-300 text-xs font-bold rounded-lg transition cursor-pointer"
            >
              Simpan Catatan
            </button>
          </div>
        </div>

      </div>

      {/* Sidebar Playlist Area (Right Column 4 cols) */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-[#16181D] border border-white/10 rounded-2xl p-4 shadow-sm flex flex-col h-full max-h-[600px]">
          <>
            {/* Progress bar */}
            {(() => {
              const progress = fullPlaylist.length > 0 ? Math.round((watchedVideos.size / fullPlaylist.length) * 100) : 0;
              return (
                <div className="mb-4 shrink-0">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span>Progress Kelas</span>
                    <span className="font-bold text-emerald-400">{watchedVideos.size}/{fullPlaylist.length} video · {progress}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              );
            })()}
            <div className="flex flex-col gap-3 border-b border-white/10 pb-3 mb-3 shrink-0">
                <h3 className="font-display font-semibold text-sm text-white flex items-center justify-between">
                  <span>Daftar Putar Kelas</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
                    {finalPlaylist.length} Video
                  </span>
                </h3>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <Search className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari judul materi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0F1115] border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                {finalPlaylist.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500">
                    Tidak ada materi yang sesuai dengan pencarian Anda.
                  </div>
                ) : (
                  finalPlaylist.map((v, index) => {
                    const isActive = v.id === activeVideo?.id;
                    return (
                      <div
                        key={v.id}
                      onClick={() => {
                        setActiveVideoId(v.id);
                        setIsPlaying(true);
                        setVideoProgress(0);
                        setVideoTime('00:00');
                        
                      }}
                      className={`p-2.5 rounded-xl border transition cursor-pointer text-left flex gap-3 ${
                        isActive
                          ? 'bg-emerald-500/10 border-emerald-500/50'
                          : 'bg-[#0F1115]/50 border-white/5 hover:border-white/20 hover:bg-[#0F1115]'
                      }`}
                    >
                      <div className="relative w-20 h-14 bg-black rounded-lg overflow-hidden shrink-0">
                        <img
                          src={v.unsplashUrl}
                          alt={v.title}
                          className="w-full h-full object-cover opacity-50 select-none pointer-events-none"
                        />
                        {isActive ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="flex gap-0.5 items-end h-3">
                              <span className="w-0.5 bg-emerald-400 animate-[pulse_1s_infinite_100ms] h-full" />
                              <span className="w-0.5 bg-emerald-400 animate-[pulse_1s_infinite_300ms] h-2" />
                              <span className="w-0.5 bg-emerald-400 animate-[pulse_1s_infinite_500ms] h-3" />
                            </div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                            <Play className="h-4 w-4 text-white opacity-85" />
                          </div>
                        )}
                        <span className="absolute bottom-0.5 right-0.5 text-[8px] bg-black/75 px-1 py-0.5 text-slate-300 font-mono rounded">
                          {v.duration}
                        </span>
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-white truncate leading-tight">
                          {index + 1}. {v.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate">Pemateri: Apoteker Rahmato</p>
                        {isActive && (
                          <span className="inline-block text-[8px] font-extrabold uppercase text-emerald-400 tracking-wider">
                            Sedang Diputar
                          </span>
                        )}
                      </div>
                      {watchedVideos.has(v.id) && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        </div>
      </div>
    </div>
  );
}
