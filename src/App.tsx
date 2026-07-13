import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { getOrInitState, saveState, MENTOR_RAHMATO, GENERATIONS } from './data/coursesData';
import { loadClasses } from './lib/api';
import { Class, User, Transaction, QuizAttempt, ForumPost, Material, Notification, DirectMessage } from './types';
import LandingPage from './components/LandingPage';
import StudentDashboard from './components/StudentDashboard';
import MentorDashboard from './components/MentorDashboard';
import AdminDashboard from './components/AdminDashboard';
import SyringeCursor from './components/SyringeCursor';
import Navbar from './components/Navbar';
import { useAuth } from './contexts/AuthContext';
import type { SSOUser } from './contexts/AuthContext';

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 'all', type: 'payment', title: 'Pembayaran Dikonfirmasi', body: 'Pembayaran kelas Reguler A - Generasi 6 telah dikonfirmasi. Selamat belajar!', read: false, createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
  { id: 'n2', userId: 'all', type: 'material', title: 'Materi Baru Tersedia', body: 'Materi baru "Farmakoterapi Lanjut: Monitoring ICU" telah diunggah di kelas Advance A.', read: false, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: 'n3', userId: 'all', type: 'forum', title: 'Mentor Membalas Forum Anda', body: 'Apoteker Rahmato membalas pertanyaan Anda di forum kelas Reguler B.', read: false, createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: 'n4', userId: 'all', type: 'announcement', title: 'Pengumuman Kelas', body: 'Jadwal Live Session Generasi 6 telah diperbarui. Cek tab Jadwal di dashboard.', read: true, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
];

const MOCK_MESSAGES: DirectMessage[] = [
  { id: 'm1', fromId: 'mentor-001', toId: 'current', content: 'Halo! Selamat bergabung di Farma Masterclass. Jangan ragu untuk bertanya di forum ya.', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), read: true },
  { id: 'm2', fromId: 'current', toId: 'mentor-001', content: 'Terima kasih Apoteker Rahmato! Saya sudah mulai materi pertama.', createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), read: true },
  { id: 'm3', fromId: 'mentor-001', toId: 'current', content: 'Bagus sekali! Jika ada pertanyaan tentang kalkulasi dosis, langsung tanya di sini atau di forum kelas.', createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), read: false },
];

// Guard component — redirects to SSO login if not authenticated
function RequireAuth({ children, requiredRealm }: { children: React.ReactNode; requiredRealm?: string | string[] }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-[#0F1115]" />;
  if (!user) { window.location.href = '/auth/login'; return null; }
  if (requiredRealm) {
    const allowed = Array.isArray(requiredRealm) ? requiredRealm : [requiredRealm];
    if (!user.realm || !allowed.includes(user.realm)) return <Navigate to="/kelas" replace />;
  }
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

  // Notifications & messages
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [messages, setMessages] = useState<DirectMessage[]>(MOCK_MESSAGES);

  // Notifikasi hasil pembayaran Xendit setelah redirect kembali dari Xendit
  const [paymentNotice, setPaymentNotice] = useState<
    { type: 'success' | 'failed'; className?: string } | null
  >(null);

  // Ventera SSO session (null = not logged in, loading = checking)
  const { user: ssoUser, loading: ssoLoading } = useAuth();

  // Initialize data on mount
  useEffect(() => {
    const data = getOrInitState();

    // --- Tangani redirect kembali dari pembayaran Xendit (?payment=success|failed) ---
    let students = data.students;
    let transactions = data.transactions;
    const params = new URLSearchParams(window.location.search);
    const paymentResult = params.get('payment');

    if (paymentResult === 'success' || paymentResult === 'failed') {
      let pending: {
        classId?: string;
        studentId?: string;
        studentName?: string;
        studentEmail?: string;
        amount?: number;
      } = {};
      try {
        pending = JSON.parse(localStorage.getItem('lms_pending_checkout') ?? '{}');
      } catch {
        pending = {};
      }
      const cls = data.classes.find((c) => c.id === (params.get('class') ?? pending.classId));

      if (paymentResult === 'success' && pending.classId && pending.studentId) {
        const sid = pending.studentId;
        const cid = pending.classId;
        // Tandai kelas aktif untuk peserta SSO (upsert bila belum ada di store lokal).
        const exists = data.students.some((s) => s.id === sid);
        students = exists
          ? data.students.map((s) =>
              s.id === sid && !s.enrolledClasses.includes(cid)
                ? { ...s, enrolledClasses: [...s.enrolledClasses, cid] }
                : s
            )
          : [
              ...data.students,
              {
                id: sid,
                name: pending.studentName ?? 'Peserta',
                email: pending.studentEmail ?? '',
                role: 'student',
                avatar:
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60',
                profession: 'Lainnya',
                enrolledClasses: [cid],
                completedClasses: [],
              } as User,
            ];
        const buyer = students.find((s) => s.id === sid);
        if (cls && buyer) {
          const newTx: Transaction = {
            id: `TX-${Date.now().toString().slice(-6)}`,
            userId: buyer.id,
            userName: buyer.name,
            userEmail: buyer.email,
            classId: cls.id,
            className: cls.name,
            generationName: cls.generationName,
            amount: pending.amount ?? cls.price,
            status: 'success',
            paymentMethod: 'Pembayaran Online',
            createdAt: new Date().toISOString(),
          };
          transactions = [newTx, ...data.transactions];
        }
        saveState({
          classes: data.classes,
          students,
          forumPosts: data.forumPosts,
          transactions,
          attempts: data.attempts,
        });
        setPaymentNotice({ type: 'success', className: cls?.name });
        // Bawa peserta ke dashboard kelasnya (sekaligus membersihkan query string).
        navigate('/kelas', { replace: true });
      } else if (paymentResult === 'failed') {
        setPaymentNotice({ type: 'failed', className: cls?.name });
        navigate('/kelas', { replace: true });
      } else {
        window.history.replaceState({}, '', window.location.pathname);
      }

      localStorage.removeItem('lms_pending_checkout');
    }

    setStudents(students);
    setForumPosts(data.forumPosts);
    setTransactions(transactions);
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
    // Di route /mentor, ssoUser ber-realm mentor/admin -> pakai identitas MENTOR_RAHMATO;
    // selain itu pakai SSO student.
    const activeUser =
      ssoUser?.realm === 'mentor' || ssoUser?.realm === 'admin'
        ? MENTOR_RAHMATO
        : (ssoStudent ?? MENTOR_RAHMATO);

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

  // 6. ADMIN: Confirm/reject payment
  const handleConfirmPayment = (txId: string, action: 'success' | 'failed') => {
    const updated = transactions.map(t => t.id === txId ? { ...t, status: action } : t);
    setTransactions(updated);
    triggerSaveState(classes, students, forumPosts, updated, attempts);
  };

  // 7. ADMIN: Toggle user active state
  const handleToggleUserActive = (userId: string) => {
    const updated = students.map(s => s.id === userId ? { ...s, isActive: s.isActive === false ? true : false } : s);
    setStudents(updated);
    triggerSaveState(classes, updated, forumPosts, transactions, attempts);
  };

  // 8. ADMIN: Send notification (store in state)
  const handleSendNotification = (notif: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotif: Notification = { ...notif, id: `n-${Date.now()}`, createdAt: new Date().toISOString() };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // 9. ADMIN: Add enrollment
  const handleAddEnrollment = (userId: string, classId: string) => {
    const updated = students.map(s => s.id === userId && !s.enrolledClasses.includes(classId)
      ? { ...s, enrolledClasses: [...s.enrolledClasses, classId] } : s);
    setStudents(updated);
    triggerSaveState(classes, updated, forumPosts, transactions, attempts);
  };

  // 10. ADMIN: Remove enrollment
  const handleRemoveEnrollment = (userId: string, classId: string) => {
    const updated = students.map(s => s.id === userId
      ? { ...s, enrolledClasses: s.enrolledClasses.filter(id => id !== classId) } : s);
    setStudents(updated);
    triggerSaveState(classes, updated, forumPosts, transactions, attempts);
  };

  // 11. STUDENT: Send direct message
  const handleSendMessage = (toId: string, content: string) => {
    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}`, fromId: ssoStudent?.id ?? 'current',
      toId, content, createdAt: new Date().toISOString(), read: false,
    };
    setMessages(prev => [...prev, newMsg]);
  };

  // 12. Mark notification read
  const handleMarkNotifRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  // 13. SUBMIT QUIZ EVALUATION
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
      <Navbar notifications={notifications} onMarkNotifRead={handleMarkNotifRead} />

      {/* Notifikasi hasil pembayaran Xendit */}
      <AnimatePresence>
        {paymentNotice && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden z-50"
          >
            <div
              className={`px-4 py-2.5 flex items-center justify-between gap-3 text-sm border-b ${
                paymentNotice.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <span className="flex items-center gap-2 font-semibold">
                {paymentNotice.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0" />
                )}
                {paymentNotice.type === 'success'
                  ? `Pembayaran diterima${paymentNotice.className ? ` — kelas "${paymentNotice.className}" kini aktif` : ''}. Terima kasih!`
                  : `Pembayaran belum selesai${paymentNotice.className ? ` untuk kelas "${paymentNotice.className}"` : ''}. Silakan coba lagi.`}
              </span>
              <button
                onClick={() => setPaymentNotice(null)}
                className="text-current/70 hover:text-current shrink-0"
                aria-label="Tutup notifikasi"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              notifications={notifications}
              messages={messages}
              onSendMessage={handleSendMessage}
              onMarkNotifRead={handleMarkNotifRead}
            />
          </RequireAuth>
        } />

        <Route path="/mentor" element={
          <RequireAuth requiredRealm={['mentor', 'admin']}>
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

        <Route path="/admin" element={
          <RequireAuth requiredRealm="admin">
            <AdminDashboard
              classes={classes}
              students={students}
              transactions={transactions}
              attempts={attempts}
              notifications={notifications}
              onConfirmPayment={handleConfirmPayment}
              onToggleUserActive={handleToggleUserActive}
              onSendNotification={handleSendNotification}
              onAddEnrollment={handleAddEnrollment}
              onRemoveEnrollment={handleRemoveEnrollment}
            />
          </RequireAuth>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
