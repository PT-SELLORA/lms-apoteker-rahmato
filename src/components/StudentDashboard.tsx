import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  ShoppingBag,
  Receipt,
  Award,
  ChevronLeft,
  Play,
  Pause,
  FileText,
  CheckSquare,
  MessageSquare,
  Send,
  CreditCard,
  CheckCircle2,
  Lock,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Download,
  Eye,
  Smile,
  Image as ImageIcon,
  Volume2,
  VolumeX,
  RotateCcw,
  Mic,
  Trash2,
  Check,
  Search
} from 'lucide-react';
import { Class, Material, User, Transaction, QuizAttempt, ForumPost } from '../types';
import { getMaterialsForClass, QUIZ_TEMPLATES } from '../data/coursesData';
import ClassroomVideoTab from './ClassroomVideoTab';
import ClassroomFilesTab from './ClassroomFilesTab';
import ClassroomQuizTab from './ClassroomQuizTab';
import ClassroomForumTab from './ClassroomForumTab';

interface StudentDashboardProps {
  currentUser: User;
  classes: Class[];
  transactions: Transaction[];
  attempts: QuizAttempt[];
  forumPosts: ForumPost[];
  onPurchaseSuccess: (classId: string, amount: number, paymentMethod: string) => void;
  onAddForumPost: (classId: string, title: string, content: string) => void;
  onAddForumReply: (postId: string, content: string) => void;
  onQuizSubmit: (classId: string, score: number, passed: boolean) => void;
  onLogOut: () => void;
}

export default function StudentDashboard({
  currentUser,
  classes,
  transactions,
  attempts,
  forumPosts,
  onPurchaseSuccess,
  onAddForumPost,
  onAddForumReply,
  onQuizSubmit,
  onLogOut,
}: StudentDashboardProps) {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'my-classes' | 'catalog' | 'transactions' | 'certificates'>('my-classes');
  
  // Classroom viewer state
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [activeMaterialId, setActiveMaterialId] = useState<string | null>(null);
  
  // Classroom inner states
  const [classroomTab, setClassroomTab] = useState<'video' | 'files' | 'quiz' | 'forum'>('video');
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  
  // Video player controls state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [videoProgress, setVideoProgress] = useState<number>(15); // mock initial progress %
  const [videoVolume, setVideoVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [videoTime, setVideoTime] = useState<string>('08:12');
  const [userNote, setUserNote] = useState<string>('');
  const [noteSaved, setNoteSaved] = useState<boolean>(false);

  // File Reference tab states
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  const [downloadedFiles, setDownloadedFiles] = useState<Record<string, boolean>>({});
  const [readerFileId, setReaderFileId] = useState<string | null>(null);
  const [readerTextSize, setReaderTextSize] = useState<number>(14);
  const [readerTheme, setReaderTheme] = useState<'dark' | 'light'>('dark');
  const [readerCompleted, setReaderCompleted] = useState<Record<string, boolean>>({});

  // Quiz timer state
  const [quizTimeLeft, setQuizTimeLeft] = useState<number>(2700); // 45 minutes

  // Rich forum attachment states
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedGif, setAttachedGif] = useState<string | null>(null);
  const [attachedVoiceDuration, setAttachedVoiceDuration] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceRecordSeconds, setVoiceRecordSeconds] = useState<number>(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showGifPicker, setShowGifPicker] = useState<boolean>(false);
  const [showImagePicker, setShowImagePicker] = useState<boolean>(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [voiceProgressPercent, setVoiceProgressPercent] = useState<Record<string, number>>({});
  
  // Checkout Modal State
  const [checkoutClassId, setCheckoutClassId] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('Bank Transfer (BCA)');
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'success'>('form');

  // Quiz taking state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean } | null>(null);

  // Forum states
  const [newPostTitle, setNewPostTitle] = useState<string>('');
  const [newPostContent, setNewPostContent] = useState<string>('');
  const [newReplyContent, setNewReplyContent] = useState<Record<string, string>>({});
  const [isAddingPost, setIsAddingPost] = useState<boolean>(false);

  // Catalog search state
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');

  // Accessed Materials state
  const [accessedMaterials, setAccessedMaterials] = useState<Record<string, string[]>>(() => {
    try {
      const stored = localStorage.getItem('lms_accessed_materials');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const handleMaterialAccess = (materialId: string) => {
    if (!selectedClassId) return;
    setAccessedMaterials(prev => {
      const classAccessed = prev[selectedClassId] || [];
      if (!classAccessed.includes(materialId)) {
        const updated = { ...prev, [selectedClassId]: [...classAccessed, materialId] };
        localStorage.setItem('lms_accessed_materials', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  // Accordion states for generations
  const [expandedMyClassesGen, setExpandedMyClassesGen] = useState<Record<string, boolean>>({});
  const [expandedCatalogGen, setExpandedCatalogGen] = useState<Record<string, boolean>>({});

  // Filter student's active classes
  const myClasses = classes.filter((c) => currentUser.enrolledClasses.includes(c.id));
  
  // Filter student's transactions
  const myTransactions = transactions.filter((t) => t.userId === currentUser.id);

  // Filter courses available to purchase
  const baseCatalogClasses = classes.filter(
    (c) => !currentUser.enrolledClasses.includes(c.id)
  );
  
  const catalogClasses = baseCatalogClasses.filter((c) => 
    c.name.toLowerCase().includes(catalogSearchQuery.toLowerCase()) || 
    c.description.toLowerCase().includes(catalogSearchQuery.toLowerCase())
  );

  const myClassesGrouped = myClasses.reduce((acc, cls) => {
    if (!acc[cls.generationName]) acc[cls.generationName] = [];
    acc[cls.generationName].push(cls);
    return acc;
  }, {} as Record<string, Class[]>);

  const catalogClassesGrouped = catalogClasses.reduce((acc, cls) => {
    if (!acc[cls.generationName]) acc[cls.generationName] = [];
    acc[cls.generationName].push(cls);
    return acc;
  }, {} as Record<string, Class[]>);

  // Retrieve current active class object
  const activeClass = classes.find((c) => c.id === selectedClassId);

  // Retrieve materials including custom ones from localStorage
  const materials = React.useMemo(() => {
    if (!selectedClassId || !activeClass) return [];
    const base = getMaterialsForClass(selectedClassId, activeClass.name);
    try {
      const stored = localStorage.getItem('lms_custom_materials');
      if (stored) {
        const parsed = JSON.parse(stored) as Material[];
        const classCustoms = parsed.filter((m) => m.classId === selectedClassId);
        // Ensure no duplicates by ID
        const combined = [...base];
        classCustoms.forEach(cMat => {
          if (!combined.some(bMat => bMat.id === cMat.id)) {
            combined.push(cMat);
          }
        });
        return combined;
      }
    } catch (e) {
      console.error(e);
    }
    return base;
  }, [selectedClassId, activeClass]);

  const activeMaterial = materials.find((m) => m.id === activeMaterialId);

  // Selected class quiz
  const isAdvanceClass = activeClass?.category === 'ADVANCE';
  const quizTemplate = isAdvanceClass ? QUIZ_TEMPLATES.advance : QUIZ_TEMPLATES.reguler;

  // Quiz Countdown Timer Effect
  useEffect(() => {
    if (classroomTab !== 'quiz' || quizSubmitted || !selectedClassId) return;
    const interval = setInterval(() => {
      setQuizTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [classroomTab, quizSubmitted, selectedClassId]);

  // Voice Note Recording countdown simulator
  useEffect(() => {
    if (!isRecordingVoice) return;
    const interval = setInterval(() => {
      setVoiceRecordSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  // Handle click on a class to open the classroom
  const handleOpenClassroom = (classId: string) => {
    setSelectedClassId(classId);
    const classMaterials = getMaterialsForClass(classId, classes.find((c) => c.id === classId)?.name || '');
    const firstVideo = classMaterials.find(m => m.type === 'video');
    setActiveMaterialId(firstVideo?.id || classMaterials[0]?.id || null);
    setClassroomTab('video');
    setActiveVideoId(null);
    setIsPlaying(false);
    setVideoProgress(15);
    setUserNote('');
    setNoteSaved(false);
    setReaderFileId(null);
    setAttachedImage(null);
    setAttachedGif(null);
    setAttachedVoiceDuration(null);
    setIsRecordingVoice(false);
    setVoiceRecordSeconds(0);
    // Reset quiz state
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizResult(null);
    setQuizTimeLeft(2700);
  };

  // Handle purchasing class triggering the checkout modal
  const handleCheckoutInit = (classId: string) => {
    setCheckoutClassId(classId);
    setCheckoutStep('form');
  };

  // Perform purchase
  const handleConfirmPayment = () => {
    if (!checkoutClassId) return;
    const cls = classes.find((c) => c.id === checkoutClassId);
    if (!cls) return;

    onPurchaseSuccess(cls.id, cls.price, selectedPayment);
    setCheckoutStep('success');
  };

  const handleCloseCheckoutSuccess = () => {
    setCheckoutClassId(null);
    setCheckoutStep('form');
    setActiveTab('my-classes');
    if (checkoutClassId) {
      handleOpenClassroom(checkoutClassId);
    }
  };

  // Handle quiz question answer selection
  const handleSelectQuizAnswer = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  // Submit quiz
  const handleQuizSubmitLocal = () => {
    if (!selectedClassId) return;
    
    let correctCount = 0;
    quizTemplate.questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctOption) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / quizTemplate.questions.length) * 100);
    const passed = score >= quizTemplate.passingScore;

    setQuizResult({ score, passed });
    setQuizSubmitted(true);
    onQuizSubmit(selectedClassId, score, passed);
  };

  // Handle Forum Post submit
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId || !newPostTitle.trim() || !newPostContent.trim()) return;

    onAddForumPost(selectedClassId, newPostTitle, newPostContent);
    setNewPostTitle('');
    setNewPostContent('');
    setIsAddingPost(false);
  };

  // Handle Forum Reply submit
  const handleCreateReply = (postId: string) => {
    const replyText = newReplyContent[postId];
    if (!replyText || !replyText.trim()) return;

    onAddForumReply(postId, replyText);
    setNewReplyContent((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="bg-[#0F1115] text-slate-200 min-h-screen font-sans">
      {/* Tab Navigation */}
      <div className="bg-[#16181D] border-b border-white/10 sticky top-14 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2 sm:gap-4 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('my-classes');
              setSelectedClassId(null);
            }}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold transition shrink-0 ${
              activeTab === 'my-classes' && !selectedClassId
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/10 font-bold'
                : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Kelas Saya</span>
            {myClasses.length > 0 && (
              <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === 'my-classes' && !selectedClassId ? 'bg-black text-emerald-400 font-bold' : 'bg-white/10 text-slate-300'
              }`}>
                {myClasses.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('catalog');
              setSelectedClassId(null);
            }}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold transition shrink-0 ${
              activeTab === 'catalog'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/10 font-bold'
                : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Beli Kelas Baru</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('transactions');
              setSelectedClassId(null);
            }}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold transition shrink-0 ${
              activeTab === 'transactions'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/10 font-bold'
                : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <Receipt className="h-4 w-4" />
            <span>Riwayat Tagihan</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('certificates');
              setSelectedClassId(null);
            }}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold transition shrink-0 ${
              activeTab === 'certificates'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/10 font-bold'
                : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <Award className="h-4 w-4" />
            <span>Sertifikat</span>
          </button>

          <button
            onClick={onLogOut}
            className="text-xs px-3 py-1.5 border border-white/10 hover:bg-white/5 text-slate-400 rounded-lg transition ml-auto shrink-0"
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW 1: CLASSROOM (Active when selectedClassId is set) */}
        {selectedClassId && activeClass && (
          <div className="space-y-6">
            
            {/* Header / Back button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 text-left">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedClassId(null)}
                  className="p-2 hover:bg-white/5 text-slate-400 hover:text-white rounded-full transition cursor-pointer"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <span>{activeClass.generationName}</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold">{activeClass.category}</span>
                  </div>
                  <h1 className="text-2xl font-display font-medium text-white mt-0.5">{activeClass.name}</h1>
                </div>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10 self-start sm:self-center">
                <span>Dosen Pembimbing:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-emerald-400" /> Apoteker Rahmato
                </span>
              </div>
            </div>

            {/* Elegant Horizontal Classroom Tabs */}
            <div className="flex items-center gap-1 bg-[#16181D] p-1 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar scroll-smooth">
              <button
                onClick={() => setClassroomTab('video')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 cursor-pointer ${
                  classroomTab === 'video'
                    ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/10'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <Play className="h-4 w-4 shrink-0" />
                <span>Video Materi</span>
              </button>
              
              <button
                onClick={() => setClassroomTab('files')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 cursor-pointer ${
                  classroomTab === 'files'
                    ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/10'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <FileText className="h-4 w-4 shrink-0" />
                <span>File Referensi & Unduhan</span>
              </button>

              <button
                onClick={() => setClassroomTab('quiz')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 cursor-pointer ${
                  classroomTab === 'quiz'
                    ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/10'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <CheckSquare className="h-4 w-4 shrink-0" />
                <span>Kuis & Ujian Akhir</span>
              </button>

              <button
                onClick={() => setClassroomTab('forum')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 cursor-pointer ${
                  classroomTab === 'forum'
                    ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/10'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span>Forum Diskusi Kelas</span>
              </button>
            </div>

            {/* TAB RENDERING VIEWPORTS */}
            <div className="mt-4">
              {classroomTab === 'video' && (
                <ClassroomVideoTab
                  activeClass={activeClass}
                  materials={materials}
                  onMaterialAccess={handleMaterialAccess}
                />
              )}

              {classroomTab === 'files' && (
                <ClassroomFilesTab
                  activeClass={activeClass}
                  materials={materials}
                  onMaterialAccess={handleMaterialAccess}
                />
              )}

              {classroomTab === 'quiz' && (
                <ClassroomQuizTab
                  selectedClassId={selectedClassId}
                  quizTemplate={quizTemplate}
                  onQuizSubmit={onQuizSubmit}
                />
              )}

              {classroomTab === 'forum' && (
                <ClassroomForumTab
                  selectedClassId={selectedClassId}
                  currentUser={currentUser}
                  forumPosts={forumPosts}
                  onAddForumPost={onAddForumPost}
                  onAddForumReply={onAddForumReply}
                />
              )}
            </div>

          </div>
        )}

        {/* VIEW 2: MY ENROLLED CLASSES (Main screen) */}
        {activeTab === 'my-classes' && !selectedClassId && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-display font-light text-white">Kelas Aktif Belajar</h1>
              <p className="text-slate-400 text-sm mt-1">Pilih kelas terdaftar di bawah untuk membuka kurikulum, materi video, kuis evaluasi, dan ruang forum konsultasi.</p>
            </div>

            {myClasses.length === 0 ? (
              <div className="bg-[#16181D] border border-white/10 rounded-2xl p-8 text-center max-w-lg mx-auto space-y-4 shadow-sm">
                <div className="mx-auto w-12 h-12 bg-white/5 text-slate-500 rounded-full flex items-center justify-center">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Anda Belum Terdaftar di Kelas Apapun</h3>
                  <p className="text-xs text-slate-400 mt-1">Anda baru mendaftar di sistem kami. Klik tab "Beli Kelas Baru" untuk memilih kelas pertama Anda di Generasi terbaru (Generasi 6) dan saksikan proses pendaftaran otomatis.</p>
                </div>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg text-xs transition"
                >
                  Jelajahi Kelas Generasi 6
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(myClassesGrouped).map(([genName, classesInGen]) => {
                  const isExpanded = expandedMyClassesGen[genName] ?? false;
                  return (
                    <div key={genName} className="bg-[#16181D] border border-white/10 rounded-2xl overflow-hidden shadow-sm">
                      <button
                        onClick={() => setExpandedMyClassesGen(prev => ({ ...prev, [genName]: !prev[genName] }))}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <BookOpen className="h-5 w-5 text-emerald-400" />
                          </div>
                          <div className="text-left">
                            <h2 className="text-lg font-display font-medium text-white">{genName}</h2>
                            <p className="text-xs text-slate-400">{classesInGen.length} Kelas Aktif</p>
                          </div>
                        </div>
                        <ChevronLeft className={`h-5 w-5 text-slate-400 transition-transform ${isExpanded ? '-rotate-90' : 'rotate-180'}`} />
                      </button>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 pt-2 border-t border-white/10 bg-black/20">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {classesInGen.map((cls) => {
                                  const isAdvance = cls.category === 'ADVANCE';
                                  const classAttempts = attempts.filter((at) => at.classId === cls.id);
                                  const isPassed = classAttempts.some((at) => at.passed);
                                  
                                  const classAccessed = accessedMaterials[cls.id] || [];
                                  const totalMats = 10; // 6 videos + 4 PDFs (based on ClassroomVideoTab & ClassroomFilesTab defaults)
                                  const progressPercent = Math.min(Math.round((classAccessed.length / totalMats) * 100), 100);
                                  
                                  return (
                                    <div
                                      key={cls.id}
                                      className="bg-[#16181D] border border-white/10 rounded-2xl p-5 shadow-sm hover:border-emerald-500/50 transition flex flex-col justify-between"
                                    >
                                      <div>
                                        <div className="flex justify-between items-center mb-3">
                                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                                            isAdvance ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                          }`}>
                                            {cls.category}
                                          </span>
                                        </div>
                                        <h3 className="text-lg font-display font-medium text-white leading-tight">{cls.name}</h3>
                                        <p className="text-slate-400 text-xs mt-2 line-clamp-3 leading-relaxed">{cls.description}</p>
                                      </div>

                                      <div className="mt-5 pt-4 border-t border-white/10 space-y-4">
                                        {/* Progress Bar */}
                                        <div className="space-y-1.5">
                                          <div className="flex justify-between items-center text-[10px] font-bold">
                                            <span className="text-slate-400 uppercase tracking-wider">Progress Belajar</span>
                                            <span className="text-emerald-400">{progressPercent}%</span>
                                          </div>
                                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                            <div 
                                              className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out" 
                                              style={{ width: `${progressPercent}%` }}
                                            />
                                          </div>
                                          <p className="text-[10px] text-slate-500">{classAccessed.length} dari {totalMats} materi diakses</p>
                                        </div>

                                        <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                                          <span>Dosen: Apoteker Rahmato</span>
                                          {isPassed ? (
                                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                                              <CheckCircle2 className="h-3.5 w-3.5" /> Lulus Evaluasi
                                            </span>
                                          ) : classAttempts.length > 0 ? (
                                            <span className="text-rose-400 font-semibold">Gagal Evaluasi ({classAttempts[0].score})</span>
                                          ) : (
                                            <span className="text-slate-500">Belum Ujian</span>
                                          )}
                                        </div>

                                        <button
                                          onClick={() => handleOpenClassroom(cls.id)}
                                          className="w-full py-2 bg-[#0F1115] hover:bg-emerald-500 hover:text-black text-slate-300 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5"
                                        >
                                          <span>Masuk Ruang Kelas</span>
                                          <ChevronRight className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: NEW CLASSES CATALOG */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-display font-light text-white">Beli Kelas & Daftar Otomatis</h1>
                <p className="text-slate-400 text-sm mt-1">Beli salah satu kelas di bawah untuk mendaftar secara otomatis. Kelas yang dibeli akan langsung masuk ke tab "Kelas Saya" Anda.</p>
              </div>
              <div className="w-full md:w-72 shrink-0">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari kelas atau topik materi..."
                    value={catalogSearchQuery}
                    onChange={(e) => setCatalogSearchQuery(e.target.value)}
                    className="w-full bg-[#16181D] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition shadow-sm"
                  />
                </div>
              </div>
            </div>

            {baseCatalogClasses.length === 0 ? (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-8 text-center max-w-lg mx-auto space-y-3">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                <h3 className="font-extrabold text-white">Luar Biasa!</h3>
                <p className="text-xs text-slate-300">Anda sudah membeli dan terdaftar di seluruh kelas yang aktif di Generasi 6 saat ini. Selamat belajar!</p>
                <button
                  onClick={() => setActiveTab('my-classes')}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg text-xs"
                >
                  Buka Kelas Saya
                </button>
              </div>
            ) : catalogClasses.length === 0 ? (
              <div className="text-center py-12 bg-[#16181D] rounded-2xl border border-white/10 space-y-2">
                <Search className="h-8 w-8 text-slate-500 mx-auto" />
                <p className="text-slate-400 text-sm">Tidak ada kelas yang sesuai dengan kata kunci pencarian Anda.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(catalogClassesGrouped).map(([genName, classesInGen]) => {
                  const isExpanded = expandedCatalogGen[genName] ?? false;
                  return (
                    <div key={genName} className="bg-[#16181D] border border-white/10 rounded-2xl overflow-hidden shadow-sm">
                      <button
                        onClick={() => setExpandedCatalogGen(prev => ({ ...prev, [genName]: !prev[genName] }))}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <ShoppingBag className="h-5 w-5 text-emerald-400" />
                          </div>
                          <div className="text-left">
                            <h2 className="text-lg font-display font-medium text-white">{genName}</h2>
                            <p className="text-xs text-slate-400">{classesInGen.length} Kelas Tersedia</p>
                          </div>
                        </div>
                        <ChevronLeft className={`h-5 w-5 text-slate-400 transition-transform ${isExpanded ? '-rotate-90' : 'rotate-180'}`} />
                      </button>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 pt-2 border-t border-white/10 bg-black/20">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {classesInGen.map((cls) => {
                                  const isAdvance = cls.category === 'ADVANCE';
                                  return (
                                    <div
                                      key={cls.id}
                                      className="bg-[#16181D] border border-white/10 rounded-2xl p-5 shadow-sm hover:border-emerald-500/50 transition flex flex-col justify-between"
                                    >
                                      <div>
                                        <div className="flex justify-between items-center mb-3">
                                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                                            isAdvance ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                          }`}>
                                            {cls.category}
                                          </span>
                                        </div>
                                        <h3 className="text-lg font-display font-medium text-white leading-tight">{cls.name}</h3>
                                        <p className="text-slate-400 text-xs mt-2 line-clamp-3 leading-relaxed">{cls.description}</p>
                                      </div>

                                      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                                        <div>
                                          <div className="text-[10px] text-slate-500">Investasi Kelas</div>
                                          <div className="text-base font-black text-emerald-400">
                                            Rp {cls.price.toLocaleString('id-ID')}
                                          </div>
                                        </div>

                                        <button
                                          onClick={() => handleCheckoutInit(cls.id)}
                                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg text-xs transition"
                                        >
                                          Beli Kelas
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: TRANSACTION BILLINGS */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-display font-light text-white">Riwayat Tagihan Pembelian</h1>
              <p className="text-slate-400 text-sm mt-1">Invoice pendaftaran kelas Anda yang berhasil diverifikasi secara otomatis oleh sistem.</p>
            </div>

            {myTransactions.length === 0 ? (
              <div className="text-center py-12 bg-[#16181D] rounded-2xl border border-white/10 text-slate-500 text-xs">
                Belum ada transaksi pembelian kelas.
              </div>
            ) : (
              <div className="bg-[#16181D] border border-white/10 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#0F1115] text-slate-400 border-b border-white/10 uppercase font-bold">
                        <th className="p-4">ID Transaksi</th>
                        <th className="p-4">Kelas</th>
                        <th className="p-4">Metode Bayar</th>
                        <th className="p-4">Tanggal Pembelian</th>
                        <th className="p-4">Jumlah</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {myTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-white/5">
                          <td className="p-4 font-mono font-semibold text-slate-400">{tx.id}</td>
                          <td className="p-4">
                            <span className="font-bold text-white">{tx.className}</span>
                            <span className="block text-[10px] text-slate-500">{tx.generationName}</span>
                          </td>
                          <td className="p-4 text-slate-300 font-medium">{tx.paymentMethod}</td>
                          <td className="p-4 text-slate-400">{new Date(tx.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                          <td className="p-4 font-bold text-emerald-400">Rp {tx.amount.toLocaleString('id-ID')}</td>
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
            )}
          </div>
        )}

        {/* VIEW 5: CERTIFICATE DRAWER */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-display font-light text-white">Sertifikat Resmi Kelulusan</h1>
              <p className="text-slate-400 text-sm mt-1">Kerjakan dan lulus kuis evaluasi komprehensif pada tiap kelas dengan skor minimum 75 untuk menerbitkan sertifikat resmi Anda.</p>
            </div>

            {/* Check passed classes */}
            {classes
              .filter((c) => currentUser.enrolledClasses.includes(c.id))
              .filter((c) => attempts.some((at) => at.classId === c.id && at.passed)).length === 0 ? (
              <div className="bg-[#16181D] border border-white/10 rounded-2xl p-8 text-center max-w-lg mx-auto space-y-3">
                <Award className="h-10 w-10 text-slate-500 mx-auto" />
                <h3 className="font-bold text-white text-sm">Belum Ada Sertifikat yang Terbit</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sertifikat diterbitkan secara realtime setelah Anda menyelesaikan kuis akhir evaluasi modul di kelas aktif Anda dengan nilai kelulusan minimum 75. Silakan kerjakan kuis di ruang kelas aktif Anda!
                </p>
                <button
                  onClick={() => setActiveTab('my-classes')}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg text-xs font-semibold"
                >
                  Buka Kelas & Kerjakan Kuis
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {classes
                  .filter((c) => currentUser.enrolledClasses.includes(c.id))
                  .filter((c) => attempts.some((at) => at.classId === c.id && at.passed))
                  .map((cls) => (
                    <div
                      key={cls.id}
                      className="bg-[#16181D] border border-white/10 shadow-2xl rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between"
                      style={{ backgroundImage: 'radial-gradient(circle at top right, rgba(251,191,36,0.05), transparent)' }}
                    >
                      {/* Ribbon decoration */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center rotate-45 translate-x-5 -translate-y-5">
                        LULUS
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Award className="h-8 w-8 text-amber-500 shrink-0" />
                          <div>
                            <span className="text-[10px] text-amber-400 font-bold tracking-wider uppercase">Sertifikat Kelulusan Resmi</span>
                            <h3 className="font-display font-medium text-white">Rahmato Pharmacy Academy</h3>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/10 text-center">
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Diberikan Kepada</p>
                          <h4 className="font-display text-lg font-bold text-white underline decoration-amber-500/40 underline-offset-4 mt-1">
                            {currentUser.name}
                          </h4>
                          <p className="text-xs text-slate-300 mt-1">Tenaga Kesehatan: {currentUser.profession}</p>
                          
                          <p className="text-[10px] text-slate-500 mt-4 leading-relaxed">
                            Atas keberhasilan menempuh seluruh materi pengajaran klinis medis dan lulus ujian kelulusan akhir berstandar di bidang:
                          </p>
                          <h5 className="font-bold text-sm text-emerald-400 mt-1">{cls.name} ({cls.generationName})</h5>
                        </div>
                      </div>

                      <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                        <div>
                          <span>ID Sertifikat:</span>
                          <span className="block font-mono font-semibold text-slate-300 uppercase">CERT-{cls.id}-{currentUser.id.slice(8)}</span>
                        </div>
                        <div className="text-right">
                          <span className="block italic font-serif">Apoteker Rahmato</span>
                          <span className="text-[9px] text-slate-500">Mentor Tunggal & Praktisi</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* BILLING / CHECKOUT MODAL */}
      <AnimatePresence>
        {checkoutClassId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#16181D] rounded-2xl max-w-md w-full shadow-2xl border border-white/10 overflow-hidden"
            >
              
              {checkoutStep === 'form' ? (
                <div>
                  <div className="p-6 bg-[#0F1115] text-white flex justify-between items-center border-b border-white/10">
                    <div>
                      <h3 className="font-extrabold text-lg">Billing & Pendaftaran</h3>
                      <p className="text-slate-400 text-xs">Simulasi Sistem Pembayaran LMS</p>
                    </div>
                    <button
                      onClick={() => setCheckoutClassId(null)}
                      className="text-slate-400 hover:text-white text-sm"
                    >
                      Batal
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Class being bought */}
                    {(() => {
                      const cls = classes.find((c) => c.id === checkoutClassId);
                      if (!cls) return null;
                      return (
                        <div className="p-4 bg-[#0F1115] rounded-xl border border-white/10">
                          <span className="text-[9px] font-bold text-slate-500 uppercase">{cls.generationName}</span>
                          <h4 className="font-black text-white text-sm">{cls.name}</h4>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-1">{cls.description}</p>
                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                            <span className="text-xs text-slate-400">Biaya Kelas</span>
                            <span className="font-black text-emerald-400">Rp {cls.price.toLocaleString('id-ID')}</span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Choose simulated payment method */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 block">Pilih Metode Pembayaran (Simulasi):</label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          'Bank Transfer (BCA)',
                          'Bank Transfer (Mandiri)',
                          'E-Wallet (GoPay)',
                          'E-Wallet (OVO)',
                        ].map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setSelectedPayment(method)}
                            className={`p-3 border rounded-lg text-left text-xs transition flex items-center justify-between ${
                              selectedPayment === method
                                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold'
                                : 'border-white/10 text-slate-300 hover:bg-white/5'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-slate-400" />
                              {method}
                            </span>
                            {selectedPayment === method && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20">
                      <strong>Info Simulasi:</strong> Klik "Konfirmasi Pembayaran" di bawah ini akan menyimulasikan konfirmasi dana langsung. Murid akan otomatis terdaftar dan kelas langsung aktif!
                    </div>

                    <button
                      onClick={handleConfirmPayment}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-1"
                    >
                      <span>Selesaikan Pembayaran</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center space-y-6">
                  <div className="mx-auto w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Pembayaran Sukses!</h3>
                    <p className="text-sm text-slate-400 mt-2">
                      Konfirmasi otomatis berhasil. Anda telah terdaftar secara resmi di kelas baru Anda.
                    </p>
                  </div>

                  <div className="p-4 bg-[#0F1115] rounded-xl border border-white/10 text-left text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">ID Invoice:</span>
                      <span className="font-mono font-semibold text-white">TX-{(Math.random() * 1000).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Metode Bayar:</span>
                      <span className="font-medium text-slate-200">{selectedPayment}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCloseCheckoutSuccess}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-sm transition"
                  >
                    Buka Kelas Saya & Belajar
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
