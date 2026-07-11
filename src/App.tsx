import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import {
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
import type { SSOUser } from './contexts/AuthContext';

// Guard component — redirects to SSO login if not authenticated
function RequireAuth({ children, requiredRealm }: { children: React.ReactNode; requiredRealm?: string }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-[#0F1115]" />;
  if (!user) { window.location.href = '/auth/login'; return null; }
  if (requiredRealm && user.realm !== requiredRealm) return <Navigate to="/kelas" replace />;
  return <>{children}</>;
}

// Build a User object from SSO claims, reusing existing localStorage record if present
function getSsoStudent(ssoUser: SSOUser, students: User[]): User {
  const existing = students.find(s => s.id === ssoUser.sub);
  if (existing) return existing;
  return {
    id: ssoUser.sub,
    name: ssoUser.name ?? 'Pengguna',
    email: ssoUser.email ?? '',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60',
    profession: 'Lainnya',
    enrolledClasses: [],
    completedClasses: [],
  };
}

export default function App() {
  const navigate = useNavigate();

  // Load State from local storage or pre-seed defaults
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  // Custom materials published in real-time by Apoteker Rahmato
  const [customMaterials, setCustomMaterials] = useState<Material[]>([]);

  // Ventera SSO session (null = not logged in, loading = checking)
  const { user: ssoUser, loading: ssoLoading } = useAuth();

  // Initialize data on mount
  useEffect(() => {
    const data = getOrInitState();
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

  // SSO student derived from session
  const ssoStudent = ssoUser ? getSsoStudent(ssoUser, students) : null;

  // 1. PURCHASE SUCCESS (Checkout/Billing Automation)
  const handlePurchaseSuccess = (classId: string, amount: number, paymentMethod: string) => {
    if (!ssoStudent) return;
    const activeStudent = ssoStudent;

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

    const updatedStudents = students.map((s) => {
      if (s.id === activeStudent.id) {
        const updatedEnrolled = s.enrolledClasses.includes(classId)
          ? s.enrolledClasses
          : [...s.enrolledClasses, classId];
        return { ...s, enrolledClasses: updatedEnrolled };
      }
      return s;
    });

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

  // 2. RELEASE MATERIAL (Admin publishing content)
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

    const updatedClasses = classes.map((c) => {
      if (c.id === classId) {
        return { ...c, materialsCount: c.materialsCount + 1 };
      }
      return c;
    });

    setClasses(updatedClasses);
    triggerSaveState(updatedClasses, students, forumPosts, transactions, attempts);
  };

  // 3. ADD STUDENT MANUAL (Admin panel registering a user)
  const handleAddStudent = (
    name: string,
    email: string,
    profession: User['profession'],
    initialClassId?: string
  ) => {
    const randomId = `student-${Math.random().toString(36).slice(2, 9)}`;
    const randomAvatarIdx = Math.floor(Math.random() * 5);
    const avatars = [
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=150&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60',
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

  // 4. ADD DISCUSSION FORUM TOPIC (Student posting)
  const handleAddForumPost = (classId: string, title: string, content: string) => {
    if (!ssoStudent) return;
    const activeStudent = ssoStudent;

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

  // 5. ADD DISCUSSION FORUM REPLY (Interactive comments from student or mentor)
  const handleAddForumReply = (postId: string, content: string) => {
    // On /mentor route ssoUser has realm=mentor, so use MENTOR_RAHMATO identity;
    // otherwise use the SSO student.
    const activeUser =
      ssoUser?.realm === 'mentor' ? MENTOR_RAHMATO : (ssoStudent ?? MENTOR_RAHMATO);

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

  // 6. SUBMIT QUIZ EVALUATION
  const handleQuizSubmit = (classId: string, score: number, passed: boolean) => {
    if (!ssoStudent) return;
    const activeStudent = ssoStudent;

    const newAttempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      studentId: activeStudent.id,
      quizId: `${classId}-quiz-final`,
      classId,
      score,
      passed,
      submittedAt: new Date().toISOString(),
    };

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

      <Routes>
        <Route path="/" element={
          <LandingPage
            generations={GENERATIONS}
            classes={classes}
            students={students}
            currentStudentId=""
          />
        } />

        <Route path="/kelas" element={
          <RequireAuth>
            <StudentDashboard
              currentUser={ssoStudent!}
              classes={classes}
              transactions={transactions.filter(t => t.userId === ssoStudent?.id)}
              attempts={attempts.filter(a => a.studentId === ssoStudent?.id)}
              forumPosts={forumPosts}
              onPurchaseSuccess={handlePurchaseSuccess}
              onAddForumPost={handleAddForumPost}
              onAddForumReply={handleAddForumReply}
              onQuizSubmit={handleQuizSubmit}
              onLogOut={() => navigate('/')}
            />
          </RequireAuth>
        } />

        <Route path="/mentor" element={
          <RequireAuth requiredRealm="mentor">
            <MentorDashboard
              classes={classes}
              students={students}
              transactions={transactions}
              attempts={attempts}
              forumPosts={forumPosts}
              onAddMaterial={handleAddMaterial}
              onAddStudent={handleAddStudent}
              onAddForumReply={handleAddForumReply}
              onLogOut={() => navigate('/')}
            />
          </RequireAuth>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
