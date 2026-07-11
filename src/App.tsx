import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Sparkles,
  ToggleLeft,
  ChevronUp,
  ChevronDown,
  Activity,
  Award,
  LogIn,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { getOrInitState, saveState, MENTOR_RAHMATO, GENERATIONS } from './data/coursesData';
import { loadClasses } from './lib/api';
import { Class, User, Transaction, QuizAttempt, ForumPost, Material } from './types';
import LandingPage from './components/LandingPage';
import StudentDashboard from './components/StudentDashboard';
import MentorDashboard from './components/MentorDashboard';
import SyringeCursor from './components/SyringeCursor';
import { useAuth } from './contexts/AuthContext';

export default function App() {
  // Load State from local storage or pre-seed defaults
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  
  // Custom materials published in real-time by Apoteker Rahmato
  const [customMaterials, setCustomMaterials] = useState<Material[]>([]);

  // Simulator Identity States
  const [currentRole, setCurrentRole] = useState<'landing' | 'mentor' | 'student'>('landing');
  const [currentStudentId, setCurrentStudentId] = useState<string>(''); // empty means guest or landing
  
  // Collapsed status of the top simulation controller
  const [isSimulatorBarOpen, setIsSimulatorBarOpen] = useState(true);

  // Ventera SSO session (null = not logged in, loading = checking)
  const { user: ssoUser, loading: ssoLoading } = useAuth();

  // Initialize data on mount
  useEffect(() => {
    const data = getOrInitState();
    // Simulator-local state from localStorage (students, forum, transactions, attempts)
    setStudents(data.students);
    setForumPosts(data.forumPosts);
    setTransactions(data.transactions);
    setAttempts(data.attempts);

    const storedCustomMat = localStorage.getItem('lms_custom_materials');
    if (storedCustomMat) {
      setCustomMaterials(JSON.parse(storedCustomMat));
    }

    // Load real class catalog from Supabase (public read — no auth needed)
    loadClasses()
      .then(setClasses)
      .catch(() => {
        // Fallback to localStorage seed data if Supabase is unreachable
        setClasses(data.classes);
      });
  }, []);

  // Save changes to localStorage helper
  const triggerSaveState = (
    updatedClasses: Class[],
    updatedStudents: User[],
    updatedForum: ForumPost[],
    updatedTx: Transaction[],
    updatedAttempts: QuizAttempt[]
  ) => {
    saveState({
      classes: updatedClasses,
      students: updatedStudents,
      forumPosts: updatedForum,
      transactions: updatedTx,
      attempts: updatedAttempts,
    });
  };

  // 1. GUEST REGISTRATION: If they select Guest Student but don't have one, create it.
  const getOrCreateGuestUser = (): User => {
    const existingGuest = students.find((s) => s.id === 'student-guest');
    if (existingGuest) return existingGuest;

    // Create default guest profile
    const newGuest: User = {
      id: 'student-guest',
      name: 'Ayu Lestari, Amd.Keb',
      email: 'ayu.lestari@gmail.com',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60',
      profession: 'Bidan',
      enrolledClasses: [],
      completedClasses: [],
    };

    const newStudentsList = [...students, newGuest];
    setStudents(newStudentsList);
    triggerSaveState(classes, newStudentsList, forumPosts, transactions, attempts);
    return newGuest;
  };

  // Get current student object
  const getCurrentStudentObj = (): User => {
    if (currentStudentId === 'guest') {
      return getOrCreateGuestUser();
    }
    const stu = students.find((s) => s.id === currentStudentId);
    return stu || getOrCreateGuestUser();
  };

  // 2. PURCHASE SUCCESS (Checkout/Billing Automation)
  const handlePurchaseSuccess = (classId: string, amount: number, paymentMethod: string) => {
    const activeStudent = getCurrentStudentObj();
    
    // Create transaction receipt
    const txId = `TX-${Date.now().toString().slice(-6)}`;
    const cls = classes.find((c) => c.id === classId);
    if (!cls) return;

    const newTransaction: Transaction = {
      id: txId,
      userId: activeStudent.id,
      userName: activeStudent.name,
      userEmail: activeStudent.email,
      classId,
      className: cls.name,
      generationName: cls.generationName,
      amount,
      status: 'success',
      paymentMethod,
      createdAt: new Date().toISOString(),
    };

    // Update Student Enrollment
    const updatedStudents = students.map((s) => {
      if (s.id === activeStudent.id) {
        // Only append if not already in list
        const updatedEnrolled = s.enrolledClasses.includes(classId)
          ? s.enrolledClasses
          : [...s.enrolledClasses, classId];
        return { ...s, enrolledClasses: updatedEnrolled };
      }
      return s;
    });

    // Increment Class Student count
    const updatedClasses = classes.map((c) => {
      if (c.id === classId) {
        return { ...c, studentsCount: c.studentsCount + 1 };
      }
      return c;
    });

    const updatedTransactions = [newTransaction, ...transactions];

    setClasses(updatedClasses);
    setStudents(updatedStudents);
    setTransactions(updatedTransactions);

    triggerSaveState(updatedClasses, updatedStudents, forumPosts, updatedTransactions, attempts);
  };

  // 3. RELEASE MATERIAL (Admin publishing content)
  const handleAddMaterial = (
    classId: string,
    title: string,
    type: 'video' | 'pdf',
    description: string,
    durationOrPages: string,
    content: string
  ) => {
    const newMat: Material = {
      id: `custom-${Date.now()}`,
      classId,
      title,
      type,
      description,
      durationOrPages,
      content,
    };

    const newCustomMatList = [newMat, ...customMaterials];
    setCustomMaterials(newCustomMatList);
    localStorage.setItem('lms_custom_materials', JSON.stringify(newCustomMatList));

    // Update classes material counts visually
    const updatedClasses = classes.map((c) => {
      if (c.id === classId) {
        return { ...c, materialsCount: c.materialsCount + 1 };
      }
      return c;
    });

    setClasses(updatedClasses);
    triggerSaveState(updatedClasses, students, forumPosts, transactions, attempts);
  };

  // 4. ADD STUDENT MANUAL (Admin panel registering a user)
  const handleAddStudent = (
    name: string,
    email: string,
    profession: User['profession'],
    initialClassId?: string
  ) => {
    const randomId = `student-${Math.random().toString(36).slice(2, 9)}`;
    const randomAvatarIdx = Math.floor(Math.random() * 5);
    const avatars = [
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=60', // female doctor
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=60', // male doctor
      'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=150&auto=format&fit=crop&q=60', // hijab girl
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=60', // glasses doc
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60', // nurse
    ];

    const newStu: User = {
      id: randomId,
      name,
      email,
      role: 'student',
      avatar: avatars[randomAvatarIdx],
      profession,
      enrolledClasses: initialClassId ? [initialClassId] : [],
      completedClasses: [],
    };

    let updatedClasses = classes;
    if (initialClassId) {
      updatedClasses = classes.map((c) => {
        if (c.id === initialClassId) {
          return { ...c, studentsCount: c.studentsCount + 1 };
        }
        return c;
      });
      setClasses(updatedClasses);
    }

    const updatedStudents = [...students, newStu];
    setStudents(updatedStudents);
    triggerSaveState(updatedClasses, updatedStudents, forumPosts, transactions, attempts);
  };

  // 5. ADD DISCUSSION FORUM TOPIC (Student Posting)
  const handleAddForumPost = (classId: string, title: string, content: string) => {
    const activeStudent = getCurrentStudentObj();
    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      classId,
      userId: activeStudent.id,
      userName: activeStudent.name,
      userRole: 'student',
      userProfession: activeStudent.profession,
      avatar: activeStudent.avatar,
      title,
      content,
      createdAt: new Date().toISOString(),
      replies: [],
    };

    const updatedForum = [newPost, ...forumPosts];
    setForumPosts(updatedForum);
    triggerSaveState(classes, students, updatedForum, transactions, attempts);
  };

  // 6. ADD DISCUSSION FORUM REPLY (Interactive comments from both Student and Mentor)
  const handleAddForumReply = (postId: string, content: string) => {
    const activeUser = currentRole === 'mentor' ? MENTOR_RAHMATO : getCurrentStudentObj();
    
    const updatedForum = forumPosts.map((post) => {
      if (post.id === postId) {
        const newReply = {
          id: `reply-${Date.now()}`,
          userId: activeUser.id,
          userName: activeUser.name,
          userRole: activeUser.role,
          userProfession: activeUser.profession,
          avatar: activeUser.avatar,
          content,
          createdAt: new Date().toISOString(),
        };
        return { ...post, replies: [...post.replies, newReply] };
      }
      return post;
    });

    setForumPosts(updatedForum);
    triggerSaveState(classes, students, updatedForum, transactions, attempts);
  };

  // 7. SUBMIT QUIZ EVALUATION (Logging passed/failed attempts and certificate status)
  const handleQuizSubmit = (classId: string, score: number, passed: boolean) => {
    const activeStudent = getCurrentStudentObj();
    const newAttempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      studentId: activeStudent.id,
      quizId: `${classId}-quiz-final`,
      classId,
      score,
      passed,
      submittedAt: new Date().toISOString(),
    };

    // Update completed classes list on the student if passed
    const updatedStudents = students.map((s) => {
      if (s.id === activeStudent.id && passed) {
        const updatedCompleted = s.completedClasses.includes(classId)
          ? s.completedClasses
          : [...s.completedClasses, classId];
        return { ...s, completedClasses: updatedCompleted };
      }
      return s;
    });

    const updatedAttempts = [newAttempt, ...attempts];
    setStudents(updatedStudents);
    setAttempts(updatedAttempts);

    triggerSaveState(classes, updatedStudents, forumPosts, transactions, updatedAttempts);
  };

  // Selector callback on landing page to jump into dashboards
  const handleSelectRole = (role: 'mentor' | 'student', studentId?: string) => {
    setCurrentRole(role);
    if (studentId) {
      setCurrentStudentId(studentId);
    } else {
      setCurrentStudentId('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans select-none antialiased bg-[#0F1115] text-[#F3F4F6]">
      <SyringeCursor />
      
      {/* Ventera SSO Status Bar */}
      {!ssoLoading && (
        <div className="bg-[#0F1115] text-white border-b border-white/5 text-xs px-4 py-1.5 flex items-center justify-between gap-4 z-50">
          <span className="text-slate-500 font-mono">Ventera SSO</span>
          {ssoUser ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <UserCheck className="h-3.5 w-3.5" />
                {ssoUser.name ?? ssoUser.phone ?? ssoUser.sub}
                {ssoUser.realm && (
                  <span className="text-slate-500 font-normal">· {ssoUser.realm}</span>
                )}
              </span>
              <form action="/auth/logout" method="post" className="inline">
                <button
                  type="submit"
                  className="flex items-center gap-1 text-slate-400 hover:text-white border border-white/10 hover:border-white/20 px-2 py-0.5 rounded transition-colors cursor-pointer"
                >
                  <LogOut className="h-3 w-3" />
                  Logout SSO
                </button>
              </form>
            </div>
          ) : (
            <a
              href="/auth/login"
              className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/30 px-2 py-0.5 rounded transition-colors"
            >
              <LogIn className="h-3 w-3" />
              Login dengan Ventera SSO
            </a>
          )}
        </div>
      )}

      {/* Simulation Ribbon Bar (The Sandbox Playground controller) */}
      <div className="bg-[#16181D] text-white border-b border-white/10 text-xs select-text relative z-40">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span className="font-bold text-slate-200">Rahmato Academy Simulator:</span>
              <span className="text-slate-400 hidden sm:inline">Uji coba peran, checkout instan, kuis evaluasi, & rilis materi ajar.</span>
            </div>
          </div>

          <button
            onClick={() => setIsSimulatorBarOpen(!isSimulatorBarOpen)}
            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white bg-[#0F1115] border border-white/10 px-2 py-0.5 rounded font-bold transition-colors cursor-pointer"
          >
            <span>{isSimulatorBarOpen ? 'Sembunyikan' : 'Buka Panel Uji Coba'}</span>
            {isSimulatorBarOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>

        {/* Slidedown controls */}
        {isSimulatorBarOpen && (
          <div className="bg-[#1A1D24] border-t border-white/5 py-3 px-4 text-center sm:text-left">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              
              <div className="flex flex-wrap justify-center items-center gap-2">
                
                <button
                  onClick={() => setCurrentRole('landing')}
                  className={`px-3 py-1.5 rounded font-bold transition cursor-pointer ${
                    currentRole === 'landing'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
                      : 'bg-[#0F1115] hover:bg-[#20242C] text-slate-300 border border-white/5'
                  }`}
                >
                  🌐 Landing Page
                </button>

                <button
                  onClick={() => setCurrentRole('mentor')}
                  className={`px-3 py-1.5 rounded font-bold transition cursor-pointer ${
                    currentRole === 'mentor'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
                      : 'bg-[#0F1115] hover:bg-[#20242C] text-slate-300 border border-white/5'
                  }`}
                >
                  👨‍⚕️ Mentor (Apoteker Rahmato)
                </button>

                <span className="text-slate-700 font-bold px-1 hidden md:inline">|</span>

                <button
                  onClick={() => {
                    setCurrentRole('student');
                    setCurrentStudentId('student-farhan');
                  }}
                  className={`px-3 py-1.5 rounded font-bold transition cursor-pointer ${
                    currentRole === 'student' && currentStudentId === 'student-farhan'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
                      : 'bg-[#0F1115] hover:bg-[#20242C] text-slate-300 border border-white/5'
                  }`}
                >
                  🩺 dr. Farhan Malik (Dokter)
                </button>

                <button
                  onClick={() => {
                    setCurrentRole('student');
                    setCurrentStudentId('student-siti');
                  }}
                  className={`px-3 py-1.5 rounded font-bold transition cursor-pointer ${
                    currentRole === 'student' && currentStudentId === 'student-siti'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
                      : 'bg-[#0F1115] hover:bg-[#20242C] text-slate-300 border border-white/5'
                  }`}
                >
                  🎓 Siti Aminah, S.Farm (Mahasiswa)
                </button>

                <button
                  onClick={() => {
                    setCurrentRole('student');
                    setCurrentStudentId('guest');
                  }}
                  className={`px-3 py-1.5 rounded font-bold transition cursor-pointer ${
                    currentRole === 'student' && currentStudentId === 'guest'
                      ? 'bg-emerald-600 text-white border border-emerald-500 shadow-lg shadow-emerald-950/40'
                      : 'bg-[#0F1115] hover:bg-[#20242C] text-slate-300 border border-white/5'
                  }`}
                >
                  ✨ Siswa Baru / Guest
                </button>
              </div>

              <div className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full shrink-0">
                <Activity className="h-3.5 w-3.5 animate-pulse" />
                <span>Status: Simulasi Terhubung</span>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Main Content Render routing */}
      <div className="flex-1">
        {currentRole === 'landing' && (
          <LandingPage
            generations={GENERATIONS}
            classes={classes}
            students={students}
            currentStudentId={currentStudentId}
            onSelectRole={handleSelectRole}
          />
        )}

        {currentRole === 'student' && (
          <StudentDashboard
            currentUser={getCurrentStudentObj()}
            classes={classes}
            transactions={transactions}
            attempts={attempts}
            forumPosts={forumPosts}
            onPurchaseSuccess={handlePurchaseSuccess}
            onAddForumPost={handleAddForumPost}
            onAddForumReply={handleAddForumReply}
            onQuizSubmit={handleQuizSubmit}
            onLogOut={() => setCurrentRole('landing')}
          />
        )}

        {currentRole === 'mentor' && (
          <MentorDashboard
            classes={classes}
            students={students}
            transactions={transactions}
            attempts={attempts}
            forumPosts={forumPosts}
            onAddMaterial={handleAddMaterial}
            onAddStudent={handleAddStudent}
            onAddForumReply={handleAddForumReply}
            onLogOut={() => setCurrentRole('landing')}
          />
        )}
      </div>

    </div>
  );
}
