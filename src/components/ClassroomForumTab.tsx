import React, { useState, useEffect } from 'react';
import { Send, Smile, Image as ImageIcon, Mic, Sparkles, Play, Check, Clock } from 'lucide-react';
import { User, ForumPost } from '../types';

interface ClassroomForumTabProps {
  selectedClassId: string;
  currentUser: User;
  forumPosts: ForumPost[];
  onAddForumPost: (classId: string, title: string, content: string) => void;
  onAddForumReply: (postId: string, content: string) => void;
}

export default function ClassroomForumTab({
  selectedClassId,
  currentUser,
  forumPosts,
  onAddForumPost,
  onAddForumReply,
}: ClassroomForumTabProps) {
  const [newPostTitle, setNewPostTitle] = useState<string>('');
  const [newPostContent, setNewPostContent] = useState<string>('');
  const [newReplyContent, setNewReplyContent] = useState<Record<string, string>>({});
  const [isAddingPost, setIsAddingPost] = useState<boolean>(false);

  // Attachment states
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedGif, setAttachedGif] = useState<string | null>(null);
  const [attachedVoiceDuration, setAttachedVoiceDuration] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceRecordSeconds, setVoiceRecordSeconds] = useState<number>(0);

  // Popover controls
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showGifPicker, setShowGifPicker] = useState<boolean>(false);
  const [showImagePicker, setShowImagePicker] = useState<boolean>(false);

  // Voice note playback simulation
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [voiceProgressPercent, setVoiceProgressPercent] = useState<Record<string, number>>({});

  // Voice recording timer simulator
  useEffect(() => {
    if (!isRecordingVoice) return;
    const interval = setInterval(() => {
      setVoiceRecordSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  const parsePostContent = (content: string) => {
    let cleanText = content;
    let attachedImg: string | null = null;
    let attachedGf: string | null = null;
    let attachedVc: string | null = null;

    const imageRegex = /\[ATTACH_IMAGE:(.*?)\]/;
    const gifRegex = /\[ATTACH_GIF:(.*?)\]/;
    const voiceRegex = /\[ATTACH_VOICE:(.*?)\]/;

    const imageMatch = cleanText.match(imageRegex);
    if (imageMatch) {
      attachedImg = imageMatch[1];
      cleanText = cleanText.replace(imageRegex, '').trim();
    }

    const gifMatch = cleanText.match(gifRegex);
    if (gifMatch) {
      attachedGf = gifMatch[1];
      cleanText = cleanText.replace(gifRegex, '').trim();
    }

    const voiceMatch = cleanText.match(voiceRegex);
    if (voiceMatch) {
      attachedVc = voiceMatch[1];
      cleanText = cleanText.replace(voiceRegex, '').trim();
    }

    return { cleanText, attachedImg, attachedGf, attachedVc };
  };

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    let finalContent = newPostContent;
    if (attachedImage) {
      finalContent += `\n\n[ATTACH_IMAGE:${attachedImage}]`;
    }
    if (attachedGif) {
      finalContent += `\n\n[ATTACH_GIF:${attachedGif}]`;
    }
    if (attachedVoiceDuration) {
      finalContent += `\n\n[ATTACH_VOICE:${attachedVoiceDuration}]`;
    }

    onAddForumPost(selectedClassId, newPostTitle, finalContent);

    // Reset
    setNewPostTitle('');
    setNewPostContent('');
    setAttachedImage(null);
    setAttachedGif(null);
    setAttachedVoiceDuration(null);
    setIsAddingPost(false);
  };

  const filteredPosts = forumPosts.filter((p) => p.classId === selectedClassId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      {/* Main Forum Streams (Left Column 8 cols) */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Trigger form or form layout */}
        {!isAddingPost ? (
          <div className="bg-[#16181D] border border-white/10 p-5 rounded-2xl flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
              />
              <div>
                <h4 className="text-sm font-bold text-white">Ingin mengajukan kasus klinis baru?</h4>
                <p className="text-xs text-slate-500">Ajukan kasus atau pertanyaan medis Anda kepada Mentor Apoteker Rahmato.</p>
              </div>
            </div>

            <button
              onClick={() => setIsAddingPost(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition cursor-pointer shrink-0"
            >
              Buat Topik
            </button>
          </div>
        ) : (
          <div className="bg-[#16181D] border border-emerald-500/20 bg-emerald-500/[0.01] p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                Buat Topik Diskusi Baru
              </h4>
              <button
                onClick={() => {
                  setIsAddingPost(false);
                  setAttachedImage(null);
                  setAttachedGif(null);
                  setAttachedVoiceDuration(null);
                  setIsRecordingVoice(false);
                  setVoiceRecordSeconds(0);
                }}
                className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                Batal
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-bold block">Judul Kasus / Topik:</label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Contoh: Interaksi Mayor Ceftriaxone & Kalsium Infus pada Pediatri"
                  className="w-full p-2.5 bg-[#0F1115] border border-white/10 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold block">Detail Pertanyaan / Deskripsi Kasus:</label>
                <textarea
                  rows={4}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Tuliskan analisis resep, rekam medis pasien, atau problematika DTP yang sedang Anda hadapi secara komprehensif..."
                  className="w-full p-2.5 bg-[#0F1115] border border-white/10 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Rich attachment previews */}
              {(attachedImage || attachedGif || attachedVoiceDuration) && (
                <div className="space-y-2 pt-1">
                  <label className="text-slate-500 font-bold block">Lampiran Kaya:</label>
                  <div className="flex flex-wrap gap-3">
                    {attachedImage && (
                      <div className="relative border border-white/15 bg-white/5 rounded-xl overflow-hidden p-1.5 flex items-center gap-2">
                        <img src={attachedImage} className="w-12 h-12 object-cover rounded-lg" />
                        <div className="text-left text-[10px]">
                          <span className="block font-bold text-white truncate max-w-[120px]">Gambar Terlampir</span>
                          <span className="text-slate-500">Sediaan Fisik</span>
                        </div>
                        <button
                          onClick={() => setAttachedImage(null)}
                          className="text-xs text-red-500 hover:text-red-400 pl-1 font-bold shrink-0 pr-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {attachedGif && (
                      <div className="relative border border-white/15 bg-white/5 rounded-xl overflow-hidden p-1.5 flex items-center gap-2">
                        <img src={attachedGif} className="w-12 h-12 object-cover rounded-lg" />
                        <div className="text-left text-[10px]">
                          <span className="block font-bold text-white truncate max-w-[120px]">GIF Reaksi</span>
                          <span className="text-slate-500">Animasi Reaksi</span>
                        </div>
                        <button
                          onClick={() => setAttachedGif(null)}
                          className="text-xs text-red-500 hover:text-red-400 pl-1 font-bold shrink-0 pr-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {attachedVoiceDuration && (
                      <div className="relative border border-white/15 bg-white/5 rounded-xl overflow-hidden p-1.5 flex items-center gap-2">
                        <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                          <Mic className="h-5 w-5" />
                        </div>
                        <div className="text-left text-[10px]">
                          <span className="block font-bold text-white">Voice Note</span>
                          <span className="text-emerald-400 font-mono font-bold">{attachedVoiceDuration}</span>
                        </div>
                        <button
                          onClick={() => setAttachedVoiceDuration(null)}
                          className="text-xs text-red-500 hover:text-red-400 pl-1 font-bold shrink-0 pr-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SIMULATED RECORDING TRAY */}
              {isRecordingVoice && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
                    <span className="font-bold text-red-400 font-mono text-xs">Perekaman Suara: {voiceRecordSeconds}s / 30s</span>
                    <div className="flex gap-1.5 items-end h-4 pl-2">
                      <span className="w-1 bg-red-400 animate-[pulse_1s_infinite_100ms] h-full" />
                      <span className="w-1 bg-red-400 animate-[pulse_1s_infinite_300ms] h-2" />
                      <span className="w-1 bg-red-400 animate-[pulse_1s_infinite_200ms] h-4" />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsRecordingVoice(false);
                      const durationString = `0:${voiceRecordSeconds.toString().padStart(2, '0')}`;
                      setAttachedVoiceDuration(durationString);
                      setVoiceRecordSeconds(0);
                    }}
                    className="px-2.5 py-1 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition cursor-pointer"
                  >
                    Selesai Rekam
                  </button>
                </div>
              )}

              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-3">
                <div className="flex items-center gap-1.5">
                  {/* Emoji Button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEmojiPicker(!showEmojiPicker);
                        setShowGifPicker(false);
                        setShowImagePicker(false);
                      }}
                      className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white rounded-lg transition flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <Smile className="h-4 w-4 text-amber-400" />
                      <span className="text-[10px] hidden sm:inline">Emoticon</span>
                    </button>

                    {showEmojiPicker && (
                      <div className="absolute left-0 bottom-full mb-2 bg-[#1A1D24] border border-white/10 p-2.5 rounded-xl z-50 shadow-xl grid grid-cols-5 gap-1.5 w-44">
                        {['💊', '🩺', '👨‍⚕️', '👍', '❤️', '🔥', '🤔', '📝', '😂', '😮'].map(em => (
                          <button
                            key={em}
                            type="button"
                            onClick={() => {
                              setNewPostContent(prev => prev + em);
                              setShowEmojiPicker(false);
                            }}
                            className="text-base p-1 hover:bg-white/10 rounded cursor-pointer"
                          >
                            {em}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* GIF Picker */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowGifPicker(!showGifPicker);
                        setShowEmojiPicker(false);
                        setShowImagePicker(false);
                      }}
                      className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white rounded-lg transition flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <span className="text-[10px] uppercase font-mono font-bold tracking-wide text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1 py-0.5 rounded leading-none shrink-0">GIF</span>
                      <span className="text-[10px] hidden sm:inline">Animasi</span>
                    </button>

                    {showGifPicker && (
                      <div className="absolute left-0 bottom-full mb-2 bg-[#1A1D24] border border-white/10 p-2.5 rounded-xl z-50 shadow-xl w-48 space-y-2">
                        <span className="text-[10px] text-slate-500 font-extrabold block uppercase tracking-wider">Pilih Medical GIF:</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { title: 'Thumbs Up', url: 'https://media.giphy.com/media/3oKIPcfX631trLEyCQ/giphy.gif' },
                            { title: 'Excited Doc', url: 'https://media.giphy.com/media/l0EwYGlvQ7STjAL4s/giphy.gif' },
                            { title: 'Chemical', url: 'https://media.giphy.com/media/3og0IPxMM0erATue52/giphy.gif' },
                            { title: 'Molecular', url: 'https://media.giphy.com/media/W3C7Gbe7R9m6YwNLaU/giphy.gif' }
                          ].map(gif => (
                            <button
                              key={gif.title}
                              type="button"
                              onClick={() => {
                                setAttachedGif(gif.url);
                                setShowGifPicker(false);
                              }}
                              className="relative aspect-video rounded overflow-hidden border border-white/10 hover:border-emerald-500 cursor-pointer"
                            >
                              <img src={gif.url} className="w-full h-full object-cover select-none pointer-events-none" />
                              <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white py-0.5 text-center font-bold">{gif.title}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Image Picker */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowImagePicker(!showImagePicker);
                        setShowEmojiPicker(false);
                        setShowGifPicker(false);
                      }}
                      className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white rounded-lg transition flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <ImageIcon className="h-4 w-4 text-emerald-400" />
                      <span className="text-[10px] hidden sm:inline">Sediaan</span>
                    </button>

                    {showImagePicker && (
                      <div className="absolute left-0 bottom-full mb-2 bg-[#1A1D24] border border-white/10 p-2.5 rounded-xl z-50 shadow-xl w-52 space-y-2">
                        <span className="text-[10px] text-slate-500 font-extrabold block uppercase tracking-wider">Simulasi Sediaan/Resep:</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { title: 'Hasil Lab', url: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=300&q=70' },
                            { title: 'Resep Dokter', url: 'https://images.unsplash.com/photo-1587854692152-cbe660db0969?w=300&q=70' },
                            { title: 'Krim Rusak', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=70' },
                            { title: 'Apotek Audit', url: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=300&q=70' }
                          ].map(img => (
                            <button
                              key={img.title}
                              type="button"
                              onClick={() => {
                                setAttachedImage(img.url);
                                setShowImagePicker(false);
                              }}
                              className="relative aspect-video rounded overflow-hidden border border-white/10 hover:border-emerald-500 cursor-pointer"
                            >
                              <img src={img.url} className="w-full h-full object-cover select-none pointer-events-none" />
                              <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white py-0.5 text-center font-bold">{img.title}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Voice Recorder Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isRecordingVoice) {
                        setIsRecordingVoice(false);
                        const durationString = `0:${voiceRecordSeconds.toString().padStart(2, '0')}`;
                        setAttachedVoiceDuration(durationString);
                        setVoiceRecordSeconds(0);
                      } else {
                        setIsRecordingVoice(true);
                        setVoiceRecordSeconds(0);
                        setAttachedVoiceDuration(null);
                      }
                      setShowEmojiPicker(false);
                      setShowGifPicker(false);
                      setShowImagePicker(false);
                    }}
                    className={`p-2 border rounded-lg transition flex items-center gap-1 font-bold cursor-pointer ${
                      isRecordingVoice
                        ? 'bg-red-500/10 border-red-500/30 text-red-500 animate-pulse'
                        : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Mic className="h-4 w-4 text-red-400" />
                    <span className="text-[10px] hidden sm:inline">Pesan Suara</span>
                  </button>

                </div>

                <button
                  onClick={handleCreatePost}
                  disabled={!newPostTitle.trim() || !newPostContent.trim()}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    newPostTitle.trim() && newPostContent.trim()
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-md cursor-pointer font-black'
                      : 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                  }`}
                >
                  <span>Kirim ke Forum</span>
                  <Send className="h-4 w-4" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Discussions List */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 bg-[#16181D] rounded-2xl border border-white/10 text-slate-500 text-xs">
              Belum ada aktivitas di ruang forum kelas ini. Klik "Buat Topik" untuk memulai pembicaraan pertama!
            </div>
          ) : (
            filteredPosts.map((post) => {
              const parsed = parsePostContent(post.content);

              return (
                <div key={post.id} className="bg-[#16181D] border border-white/10 rounded-2xl p-5 space-y-4 text-left shadow-sm">
                  
                  {/* User Meta Card */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.avatar}
                        alt={post.userName}
                        className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white leading-tight">{post.userName}</h4>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                            post.userRole === 'mentor'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          }`}>
                            {post.userRole === 'mentor' ? 'MENTOR TUNGGAL' : post.userProfession}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {new Date(post.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Post Body */}
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-white">{post.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-text">
                      {parsed.cleanText}
                    </p>

                    {/* Image Attachment rendering */}
                    {parsed.attachedImg && (
                      <div className="pt-2 max-w-md select-none pointer-events-none">
                        <img
                          src={parsed.attachedImg}
                          alt="Lampiran Sediaan Medis"
                          referrerPolicy="no-referrer"
                          className="rounded-xl border border-white/10 max-h-64 w-full object-cover shadow"
                        />
                        <span className="text-[9px] text-slate-500 italic mt-1 block">🩺 Lampiran Gambar Medis Sejawat</span>
                      </div>
                    )}

                    {/* GIF Attachment rendering */}
                    {parsed.attachedGf && (
                      <div className="pt-2 max-w-[240px] select-none pointer-events-none">
                        <img
                          src={parsed.attachedGf}
                          alt="Lampiran Reaksi GIF"
                          referrerPolicy="no-referrer"
                          className="rounded-xl border border-white/10 max-h-48 w-full object-cover"
                        />
                      </div>
                    )}

                    {/* Voice Note Attachment rendering */}
                    {parsed.attachedVc && (
                      <div className="pt-2 max-w-sm">
                        {(() => {
                          const isVoicePlaying = playingVoiceId === post.id;
                          const progressPercent = voiceProgressPercent[post.id] || 0;

                          return (
                            <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                              <button
                                onClick={() => {
                                  if (isVoicePlaying) {
                                    setPlayingVoiceId(null);
                                  } else {
                                    setPlayingVoiceId(post.id);
                                    setVoiceProgressPercent(prev => ({ ...prev, [post.id]: 0 }));
                                    let curr = 0;
                                    const interval = setInterval(() => {
                                      curr += 10;
                                      if (curr > 100) {
                                        curr = 100;
                                        clearInterval(interval);
                                        setPlayingVoiceId(null);
                                      }
                                      setVoiceProgressPercent(prev => ({ ...prev, [post.id]: curr }));
                                    }, 300);
                                  }
                                }}
                                className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center shrink-0 hover:scale-105 transition cursor-pointer"
                              >
                                {isVoicePlaying ? <span className="text-[10px] font-black">❚❚</span> : <Play className="h-4 w-4 fill-black text-black ml-0.5" />}
                              </button>

                              <div className="flex-1 space-y-1">
                                <span className="text-[10px] text-slate-400 font-bold flex items-center justify-between">
                                  <span>Pesan Suara ({parsed.attachedVc})</span>
                                  <span className="font-mono">{isVoicePlaying ? `${Math.round((progressPercent / 100) * parseInt(parsed.attachedVc.split(':')[1]))}s` : parsed.attachedVc}</span>
                                </span>
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden relative">
                                  <div
                                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${progressPercent}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Replies section */}
                  <div className="border-t border-white/5 pt-4 space-y-3.5 pl-2 sm:pl-4">
                    <h5 className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500">Tanggapan Diskusi</h5>
                    
                    {post.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3 text-xs">
                        <img
                          src={reply.avatar}
                          alt={reply.userName}
                          className="w-7 h-7 rounded-full object-cover border border-white/10 shrink-0 mt-0.5"
                        />
                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-bold text-white">{reply.userName}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                              reply.userRole === 'mentor'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-slate-500/10 text-slate-400 border border-white/10'
                            }`}>
                              {reply.userRole === 'mentor' ? 'MENTOR' : reply.userProfession}
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">
                              {new Date(reply.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-slate-300 font-normal leading-relaxed text-[11px] select-text">{reply.content}</p>
                        </div>
                      </div>
                    ))}

                    {/* Writing reply */}
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <input
                        type="text"
                        value={newReplyContent[post.id] || ''}
                        onChange={(e) =>
                          setNewReplyContent((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && (newReplyContent[post.id] || '').trim()) {
                            onAddForumReply(post.id, newReplyContent[post.id]);
                            setNewReplyContent((prev) => ({ ...prev, [post.id]: '' }));
                          }
                        }}
                        placeholder="Ketik tanggapan Anda..."
                        className="w-full text-xs p-2 bg-[#0F1115] border border-white/10 text-white placeholder-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <button
                        onClick={() => {
                          if (!(newReplyContent[post.id] || '').trim()) return;
                          onAddForumReply(post.id, newReplyContent[post.id]);
                          setNewReplyContent((prev) => ({ ...prev, [post.id]: '' }));
                        }}
                        className="p-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg transition shrink-0 cursor-pointer"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </div>

                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Right Column: Mini FAQ & Rules (4 cols) */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-[#16181D] border border-white/10 rounded-2xl p-4 space-y-3">
          <h3 className="font-display font-semibold text-sm text-white">Tata Tertib Forum Kelas</h3>
          <ul className="text-[11px] text-slate-400 space-y-2.5 list-disc pl-4 leading-relaxed">
            <li>Gunakan bahasa asertif, profesional, dan santun antar sesama sejawat tenaga kesehatan.</li>
            <li>Hindari mempublikasikan informasi rekam medis pasien yang bersifat privat (jaga anonimitas).</li>
            <li>Gunakan lampiran gambar medis hanya untuk meninjau mutu fisik obat, sediaan yang rusak, atau interpretasi hasil lab klinis.</li>
            <li>Dosen pembimbing Apoteker Rahmato akan aktif meninjau dan menjawab tanggapan secara berkala.</li>
          </ul>
        </div>

        <div className="bg-[#16181D] border border-emerald-500/10 p-4 rounded-2xl">
          <div className="flex gap-2">
            <span className="text-xl">🩺</span>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-emerald-400">Konsultasi Privat Eksklusif</h4>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                Masing-masing pendaftar berhak mengajukan permohonan pendampingan langsung via pesan suara instan (voice note) untuk kasus asuhan klinis kritis di faskes masing-masing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
