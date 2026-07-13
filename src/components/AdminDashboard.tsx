import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Bell,
  BarChart2,
  Check,
  X,
  Copy,
  Send,
  UserCheck,
  UserX,
  ChevronDown,
  ChevronUp,
  Search,
  TrendingUp,
  Award,
  Clock,
  AlertCircle,
  Upload,
  Info,
  Settings,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { Class, User, Transaction, QuizAttempt } from '../types';
import { fetchRoles, saveRole, type UserRoleEntry, type AppRole } from '../lib/api';

// [MOCK] Platform stats — ganti dengan API call ketika backend ready
const PLATFORM_STATS_FALLBACK = {
  totalAlumni: 35247,
  totalRevenue: 892_500_000,
  activeStudents: 847,
  avgPassRate: 94.2,
  platformFeePercent: 5,
  maintenanceFeeMonthly: 500_000,
};

// Inline Notification type until types.ts is updated by the other agent
interface Notification {
  id: string;
  userId: string;
  type: 'payment' | 'material' | 'forum' | 'announcement';
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

interface AdminDashboardProps {
  classes: Class[];
  students: User[];
  transactions: Transaction[];
  attempts: QuizAttempt[];
  notifications: Notification[];
  onConfirmPayment: (txId: string, action: 'success' | 'failed') => void;
  onToggleUserActive: (userId: string) => void;
  onSendNotification: (notif: Omit<Notification, 'id' | 'createdAt'>) => void;
  onAddEnrollment: (userId: string, classId: string) => void;
  onRemoveEnrollment: (userId: string, classId: string) => void;
}

type AdminTab = 'ringkasan' | 'billing' | 'users' | 'notif' | 'laporan' | 'pengaturan' | 'roles';
type BillingFilter = 'all' | 'pending' | 'success' | 'failed';
type NotifView = 'send' | 'history';
type NotifTarget = 'all' | 'pending' | 'pick';
type TemplateKey = 'payment' | 'material' | 'announcement' | 'billing' | 'custom';
type LaporanFilter = 'all' | 'month' | '3months';

const PROFESSIONS: User['profession'][] = ['Apoteker', 'Dokter', 'Mahasiswa', 'Perawat', 'Bidan', 'Lainnya'];

const NOTIF_TEMPLATES: Record<TemplateKey, string> = {
  payment: 'Halo {nama}, pembayaran Anda untuk kelas {kelas} telah kami terima. Selamat belajar! 🎓',
  material: 'Halo {nama}, materi baru telah tersedia di kelas {kelas}. Segera akses di dashboard Anda!',
  announcement: 'Halo {nama}, ada pengumuman penting untuk kelas {kelas}. Silakan cek forum diskusi.',
  billing: 'Halo {nama}, kami menginformasikan bahwa transaksi Anda sebesar Rp {jumlah} telah diproses. Platform fee 5% (Rp {fee}) telah dipotong. Silakan cek dashboard untuk detail.',
  custom: '',
};

const TEMPLATE_LABELS: Record<TemplateKey, string> = {
  payment: 'Konfirmasi Pembayaran',
  material: 'Materi Baru',
  announcement: 'Pengumuman',
  billing: 'Tagihan & Fee',
  custom: 'Custom',
};

function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function StatusBadge({ status }: { status: Transaction['status'] }) {
  if (status === 'pending') {
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
        Pending
      </span>
    );
  }
  if (status === 'success') {
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        Sukses
      </span>
    );
  }
  return (
    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
      Gagal
    </span>
  );
}

export default function AdminDashboard({
  classes,
  students,
  transactions,
  attempts,
  notifications,
  onConfirmPayment,
  onToggleUserActive,
  onSendNotification,
  onAddEnrollment,
  onRemoveEnrollment,
}: AdminDashboardProps) {
  const [adminTab, setAdminTab] = useState<AdminTab>('ringkasan');

  // --- Kelola Peran (user_roles) states ---
  const [roles, setRoles] = useState<UserRoleEntry[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesError, setRolesError] = useState<string | null>(null);
  const [roleEmail, setRoleEmail] = useState('');
  const [roleValue, setRoleValue] = useState<AppRole>('mentor');
  const [roleSaving, setRoleSaving] = useState(false);
  const [roleNotice, setRoleNotice] = useState<string | null>(null);

  const loadRoles = async () => {
    setRolesLoading(true);
    setRolesError(null);
    try {
      setRoles(await fetchRoles());
    } catch (err) {
      setRolesError(String((err as Error).message ?? err));
    } finally {
      setRolesLoading(false);
    }
  };

  // Muat daftar peran saat pertama kali tab dibuka.
  useEffect(() => {
    if (adminTab === 'roles' && roles.length === 0 && !rolesError) {
      loadRoles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminTab]);

  const handleSaveRole = async (email: string, role: AppRole) => {
    const target = email.trim().toLowerCase();
    if (!target) {
      setRoleNotice('Email wajib diisi');
      return;
    }
    setRoleSaving(true);
    setRoleNotice(null);
    try {
      const saved = await saveRole(target, role);
      setRoles((prev) => {
        const rest = prev.filter((r) => r.email !== saved.email);
        return [saved, ...rest];
      });
      setRoleEmail('');
      setRoleNotice(`Peran ${target} disetel jadi ${role}.`);
    } catch (err) {
      setRoleNotice(`Gagal: ${String((err as Error).message ?? err)}`);
    } finally {
      setRoleSaving(false);
    }
  };

  // --- Billing states ---
  const [billingFilter, setBillingFilter] = useState<BillingFilter>('all');
  const [billingClassFilter, setBillingClassFilter] = useState<string>('all');

  // --- User management states ---
  const [userSearch, setUserSearch] = useState('');
  const [userProfFilter, setUserProfFilter] = useState<string>('all');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [enrollSelectId, setEnrollSelectId] = useState<Record<string, string>>({});

  // --- Notification states ---
  const [notifView, setNotifView] = useState<NotifView>('send');
  const [notifTarget, setNotifTarget] = useState<NotifTarget>('all');
  const [pickedUserIds, setPickedUserIds] = useState<string[]>([]);
  const [templateKey, setTemplateKey] = useState<TemplateKey>('payment');
  const [customMessage, setCustomMessage] = useState('');
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  // --- Laporan states ---
  const [laporanFilter, setLaporanFilter] = useState<LaporanFilter>('all');

  // ===================== COMPUTED VALUES =====================

  const totalRevenue = useMemo(
    () =>
      transactions
        .filter((t) => t.status === 'success')
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const pendingCount = useMemo(
    () => transactions.filter((t) => t.status === 'pending').length,
    [transactions]
  );

  const activeStudentsCount = useMemo(
    () => students.filter((s) => (s as any).isActive !== false).length,
    [students]
  );

  const topClass = useMemo(() => {
    if (!classes.length) return null;
    return [...classes].sort((a, b) => b.studentsCount - a.studentsCount)[0];
  }, [classes]);

  const passRate = useMemo(() => {
    if (!attempts.length) return 84;
    return Math.round((attempts.filter((a) => a.passed).length / attempts.length) * 100);
  }, [attempts]);

  const recentTransactions = useMemo(
    () => [...transactions].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    [transactions]
  );

  // Billing filtered
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchStatus = billingFilter === 'all' || t.status === billingFilter;
      const matchClass = billingClassFilter === 'all' || t.classId === billingClassFilter;
      return matchStatus && matchClass;
    });
  }, [transactions, billingFilter, billingClassFilter]);

  const thisMonthRevenue = useMemo(() => {
    const now = new Date();
    return transactions
      .filter((t) => {
        const d = new Date(t.createdAt);
        return t.status === 'success' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const pendingAmount = useMemo(
    () => transactions.filter((t) => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  // User filtered
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = userSearch.toLowerCase();
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
      const matchProf = userProfFilter === 'all' || s.profession === userProfFilter;
      return matchSearch && matchProf;
    });
  }, [students, userSearch, userProfFilter]);

  // Notif targets
  const notifTargetUsers = useMemo(() => {
    if (notifTarget === 'all') return students;
    if (notifTarget === 'pending') {
      const pendingUserIds = new Set(
        transactions.filter((t) => t.status === 'pending').map((t) => t.userId)
      );
      return students.filter((s) => pendingUserIds.has(s.id));
    }
    return students.filter((s) => pickedUserIds.includes(s.id));
  }, [notifTarget, students, transactions, pickedUserIds]);

  // Laporan filtered transactions
  const laporanTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter((t) => {
      if (laporanFilter === 'all') return true;
      const d = new Date(t.createdAt);
      if (laporanFilter === 'month') {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }
      // 3months
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      return d >= threeMonthsAgo;
    });
  }, [transactions, laporanFilter]);

  // Revenue per generasi
  const revenueByGen = useMemo(() => {
    const map: Record<string, number> = {};
    laporanTransactions.forEach((t) => {
      if (t.status === 'success') {
        map[t.generationName] = (map[t.generationName] || 0) + t.amount;
      }
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [laporanTransactions]);

  const maxGenRevenue = useMemo(() => Math.max(...revenueByGen.map(([, v]) => v), 1), [revenueByGen]);

  // Top classes
  const topClasses = useMemo(
    () => [...classes].sort((a, b) => b.studentsCount - a.studentsCount).slice(0, 6),
    [classes]
  );

  const totalStudentsCount = useMemo(() => classes.reduce((s, c) => s + c.studentsCount, 0), [classes]);

  // Revenue per class (from transactions)
  const revenueByClass = useMemo(() => {
    const map: Record<string, number> = {};
    laporanTransactions
      .filter((t) => t.status === 'success')
      .forEach((t) => {
        map[t.classId] = (map[t.classId] || 0) + t.amount;
      });
    return map;
  }, [laporanTransactions]);

  // Students by profession
  const studentsByProf = useMemo(() => {
    const map: Record<string, number> = {};
    students.forEach((s) => {
      map[s.profession] = (map[s.profession] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [students]);

  const maxProfCount = useMemo(() => Math.max(...studentsByProf.map(([, v]) => v), 1), [studentsByProf]);

  // Total billing platform fee
  const totalPlatformFee = useMemo(
    () => filteredTransactions.filter((t) => t.status === 'success').reduce((sum, t) => sum + t.amount * 0.05, 0),
    [filteredTransactions]
  );
  const totalNetKlien = useMemo(
    () => filteredTransactions.filter((t) => t.status === 'success').reduce((sum, t) => sum + t.amount * 0.95, 0),
    [filteredTransactions]
  );

  // ===================== HANDLERS =====================

  function resolveMessage(template: string, user: User): string {
    const userTx = transactions.find((t) => t.userId === user.id);
    const kelas = userTx?.className || user.enrolledClasses[0] || 'kelas Anda';
    const jumlah = userTx?.amount?.toLocaleString('id-ID') || '0';
    const fee = userTx ? Math.round(userTx.amount * 0.05).toLocaleString('id-ID') : '0';
    return template
      .replace('{nama}', user.name)
      .replace('{kelas}', kelas)
      .replace('{jumlah}', jumlah)
      .replace('{fee}', fee);
  }

  function getActiveTemplate(): string {
    if (templateKey === 'custom') return customMessage;
    return NOTIF_TEMPLATES[templateKey];
  }

  function handleSendAll() {
    const template = getActiveTemplate();
    if (!template.trim()) {
      window.alert('Tulis pesan terlebih dahulu.');
      return;
    }
    notifTargetUsers.forEach((user) => {
      if (!sentIds.has(user.id)) {
        onSendNotification({
          userId: user.id,
          type: templateKey === 'payment' || templateKey === 'billing' ? 'payment' : templateKey === 'material' ? 'material' : 'announcement',
          title: TEMPLATE_LABELS[templateKey],
          body: resolveMessage(template, user),
          read: false,
        });
      }
    });
    setSentIds(new Set(notifTargetUsers.map((u) => u.id)));
    window.alert('Notifikasi tersimpan');
  }

  function handleMarkSent(userId: string) {
    setSentIds((prev) => new Set([...prev, userId]));
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
  }

  function togglePickUser(uid: string) {
    setPickedUserIds((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  }

  const PROF_BAR_COLORS = [
    'bg-emerald-500',
    'bg-teal-500',
    'bg-emerald-600',
    'bg-slate-500',
    'bg-teal-600',
    'bg-slate-600',
  ];

  // ===================== RENDER =====================

  return (
    <div className="bg-[#0F1115] min-h-screen text-[#F3F4F6]">

      {/* Tab Navigation */}
      <div className="sticky top-14 z-30 bg-[#16181D] border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs sm:text-sm">
          {(
            [
              { id: 'ringkasan', label: 'Ringkasan', icon: LayoutDashboard },
              { id: 'billing', label: 'Billing', icon: CreditCard },
              { id: 'users', label: 'Manajemen User', icon: Users },
              { id: 'notif', label: 'Notifikasi', icon: Bell },
              { id: 'laporan', label: 'Laporan', icon: BarChart2 },
              { id: 'roles', label: 'Kelola Peran', icon: ShieldCheck },
              { id: 'pengaturan', label: 'Pengaturan Platform', icon: Settings },
            ] as { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[]
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setAdminTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition shrink-0 cursor-pointer ${
                adminTab === id
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ==================== TAB 1: RINGKASAN ==================== */}
        {adminTab === 'ringkasan' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-black text-white">Dashboard Admin</h1>
              <p className="text-slate-400 text-sm mt-1">Ringkasan performa keseluruhan platform LMS Farmasi.</p>
            </div>

            {/* 8 KPI Cards 4x2 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Alumni */}
              <div className="bg-[#16181D] border border-emerald-500/20 rounded-2xl p-5 shadow-lg flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 shrink-0">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Alumni</div>
                  <div className="text-lg font-black text-emerald-400 mt-0.5 truncate">
                    {PLATFORM_STATS_FALLBACK.totalAlumni.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] text-slate-500">Seluruh angkatan</div>
                </div>
              </div>

              {/* Total Revenue (historical) */}
              <div className="bg-[#16181D] border border-white/10 rounded-2xl p-5 shadow-lg flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-xl text-slate-300 shrink-0">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</div>
                  <div className="text-lg font-black text-white mt-0.5 truncate">
                    {formatRupiah(PLATFORM_STATS_FALLBACK.totalRevenue)}
                  </div>
                  <div className="text-[10px] text-slate-500">Historical</div>
                </div>
              </div>

              {/* User Aktif Gen 6 */}
              <div className="bg-[#16181D] border border-white/10 rounded-2xl p-5 shadow-lg flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-xl text-slate-300 shrink-0">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">User Aktif (Gen 6)</div>
                  <div className="text-lg font-black text-white mt-0.5">
                    {PLATFORM_STATS_FALLBACK.activeStudents}
                  </div>
                  <div className="text-[10px] text-slate-500">Angkatan berjalan</div>
                </div>
              </div>

              {/* Pending Pembayaran */}
              <div className="bg-[#16181D] border border-yellow-500/20 rounded-2xl p-5 shadow-lg flex items-center gap-4">
                <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-400 shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Pending Bayar</div>
                  <div className="text-lg font-black text-yellow-400 mt-0.5">{pendingCount}</div>
                  <div className="text-[10px] text-slate-500">Menunggu konfirmasi</div>
                </div>
              </div>

              {/* Kelas Terlaris */}
              <div className="bg-[#16181D] border border-white/10 rounded-2xl p-5 shadow-lg flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-xl text-slate-300 shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Kelas Terlaris</div>
                  <div className="text-sm font-black text-white mt-0.5 truncate">{topClass?.name || '-'}</div>
                  <div className="text-[10px] text-slate-500">{topClass?.studentsCount || 0} murid</div>
                </div>
              </div>

              {/* Tingkat Kelulusan */}
              <div className="bg-[#16181D] border border-white/10 rounded-2xl p-5 shadow-lg flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-xl text-slate-300 shrink-0">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Tingkat Kelulusan</div>
                  <div className="text-lg font-black text-white mt-0.5">{PLATFORM_STATS_FALLBACK.avgPassRate}%</div>
                  <div className="text-[10px] text-slate-500">Rata-rata kuis</div>
                </div>
              </div>

              {/* Platform Fee (5%) */}
              <div className="bg-[#16181D] border border-amber-500/20 rounded-2xl p-5 shadow-lg flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 shrink-0">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Pendapatan Platform</div>
                  <div className="text-lg font-black text-amber-400 mt-0.5 truncate">
                    {formatRupiah(Math.round(PLATFORM_STATS_FALLBACK.totalRevenue * 0.05))}
                  </div>
                  <div className="text-[10px] text-slate-500">Platform fee 5%</div>
                </div>
              </div>

              {/* Maintenance Fee */}
              <div className="bg-[#16181D] border border-slate-500/20 rounded-2xl p-5 shadow-lg flex items-center gap-4">
                <div className="p-3 bg-slate-500/10 rounded-xl text-slate-400 shrink-0">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Biaya Maintenance</div>
                  <div className="text-lg font-black text-slate-300 mt-0.5">Rp 500.000</div>
                  <div className="text-[10px] text-slate-500">Per bulan</div>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-[#16181D] border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white">Transaksi Terbaru</h3>
                <button
                  onClick={() => setAdminTab('billing')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold transition cursor-pointer"
                >
                  Lihat Semua
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-slate-400 text-[10px] uppercase tracking-wider border-b border-white/10">
                      <th className="pb-3 pr-4">User</th>
                      <th className="pb-3 pr-4">Kelas</th>
                      <th className="pb-3 pr-4">Jumlah</th>
                      <th className="pb-3 pr-4">Tanggal</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 pr-4 font-semibold text-white">{tx.userName}</td>
                        <td className="py-3 pr-4 text-slate-300">{tx.className}</td>
                        <td className="py-3 pr-4 font-bold text-white">{formatRupiah(tx.amount)}</td>
                        <td className="py-3 pr-4 text-slate-400">{formatDate(tx.createdAt)}</td>
                        <td className="py-3">
                          <StatusBadge status={tx.status} />
                        </td>
                      </tr>
                    ))}
                    {!recentTransactions.length && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-500 italic">
                          Belum ada transaksi
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setAdminTab('billing')}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition cursor-pointer shadow-lg shadow-emerald-950/40 flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                Konfirmasi Pembayaran
              </button>
              <button
                onClick={() => setAdminTab('users')}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl font-bold text-xs transition cursor-pointer border border-white/10 flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Tambah User
              </button>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: BILLING ==================== */}
        {adminTab === 'billing' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h1 className="text-2xl font-black text-white">Billing & Pembayaran</h1>
                <p className="text-slate-400 text-sm mt-1">Kelola dan konfirmasi pembayaran masuk dari seluruh peserta.</p>
              </div>
              <button
                onClick={() => window.alert('[MOCK] Export CSV: Fitur akan aktif setelah integrasi Supabase. Data akan mencakup semua transaksi dengan breakdown platform fee.')}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl font-bold text-xs transition cursor-pointer border border-white/10 shrink-0"
              >
                Export CSV
              </button>
            </div>

            {/* Platform fee note */}
            <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
              Platform fee 5% dipotong otomatis · Maintenance Rp 500.000/bulan
            </div>

            {/* Summary Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#16181D] border border-white/10 rounded-xl p-4">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Revenue</div>
                <div className="text-lg font-black text-emerald-400 mt-1">{formatRupiah(totalRevenue)}</div>
              </div>
              <div className="bg-[#16181D] border border-white/10 rounded-xl p-4">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bulan Ini</div>
                <div className="text-lg font-black text-white mt-1">{formatRupiah(thisMonthRevenue)}</div>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Total Platform Fee</div>
                <div className="text-lg font-black text-amber-400 mt-1">{formatRupiah(Math.round(totalPlatformFee))}</div>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Net ke Apoteker Rahmato</div>
                <div className="text-lg font-black text-white mt-1">{formatRupiah(Math.round(totalNetKlien))}</div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                {(['all', 'pending', 'success', 'failed'] as BillingFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setBillingFilter(f)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      billingFilter === f
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {f === 'all' ? 'Semua' : f === 'pending' ? 'Pending' : f === 'success' ? 'Sukses' : 'Gagal'}
                  </button>
                ))}
              </div>
              <select
                value={billingClassFilter}
                onChange={(e) => setBillingClassFilter(e.target.value)}
                className="text-xs p-2 bg-[#0F1115] border border-white/10 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all" className="bg-[#16181D]">Semua Kelas</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#16181D]">
                    {c.generationName} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Transactions Table */}
            <div className="bg-[#16181D] border border-white/10 rounded-2xl overflow-hidden shadow-lg">
              {filteredTransactions.length === 0 ? (
                <div className="py-16 text-center text-slate-500 text-xs italic">
                  Tidak ada transaksi untuk filter yang dipilih.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#111111] text-slate-400 text-[10px] uppercase tracking-wider border-b border-white/10">
                        <th className="p-4">No</th>
                        <th className="p-4">Transaction ID</th>
                        <th className="p-4">Nama User</th>
                        <th className="p-4">Kelas</th>
                        <th className="p-4">Metode</th>
                        <th className="p-4">Tanggal</th>
                        <th className="p-4">Jumlah</th>
                        <th className="p-4">Platform Fee (5%)</th>
                        <th className="p-4">Net ke Klien</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredTransactions.map((tx, idx) => (
                        <tr key={tx.id} className="hover:bg-white/5 transition-colors bg-[#111111]">
                          <td className="p-4 text-slate-500">{idx + 1}</td>
                          <td className="p-4 font-mono text-slate-400 text-[10px]">{tx.id}</td>
                          <td className="p-4">
                            <div className="font-bold text-white">{tx.userName}</div>
                            <div className="text-[10px] text-slate-400">{tx.userEmail}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-white">{tx.className}</div>
                            <div className="text-[10px] text-slate-400">{tx.generationName}</div>
                          </td>
                          <td className="p-4 text-slate-300">{tx.paymentMethod}</td>
                          <td className="p-4 text-slate-400">{formatDate(tx.createdAt)}</td>
                          <td className="p-4 font-bold text-white">{formatRupiah(tx.amount)}</td>
                          <td className="p-4 font-bold text-amber-400">
                            {formatRupiah(Math.round(tx.amount * 0.05))}
                          </td>
                          <td className="p-4 font-bold text-emerald-400">
                            {formatRupiah(Math.round(tx.amount * 0.95))}
                          </td>
                          <td className="p-4">
                            <StatusBadge status={tx.status} />
                          </td>
                          <td className="p-4">
                            {tx.status === 'pending' ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => onConfirmPayment(tx.id, 'success')}
                                  className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[10px] transition cursor-pointer"
                                >
                                  <Check className="h-3 w-3" />
                                  Konfirmasi
                                </button>
                                <button
                                  onClick={() => onConfirmPayment(tx.id, 'failed')}
                                  className="flex items-center gap-1 px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-[10px] transition cursor-pointer"
                                >
                                  <X className="h-3 w-3" />
                                  Tolak
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-500 text-[10px] italic">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: MANAJEMEN USER ==================== */}
        {adminTab === 'users' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-white">Manajemen User</h1>
              <p className="text-slate-400 text-sm mt-1">Kelola akun peserta, enrollment kelas, dan status aktif.</p>
            </div>

            {/* Alumni migration info bar */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2.5 text-xs text-blue-300 flex items-center gap-2">
              <Info className="h-4 w-4 shrink-0" />
              35.247 total alumni tercatat di sistem lama · Migrasi data akan dilakukan setelah backend Supabase aktif
            </div>

            {/* Search + Filter + Import CSV */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="h-4 w-4 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Cari nama / email..."
                  className="text-xs pl-8 pr-3 py-2 bg-[#16181D] border border-white/10 text-white rounded-lg w-48 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <select
                value={userProfFilter}
                onChange={(e) => setUserProfFilter(e.target.value)}
                className="text-xs p-2 bg-[#16181D] border border-white/10 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all" className="bg-[#16181D]">Semua Profesi</option>
                {PROFESSIONS.map((p) => (
                  <option key={p} value={p} className="bg-[#16181D]">{p}</option>
                ))}
              </select>
              <button
                onClick={() => alert('[MOCK] Fitur import CSV akan tersedia setelah integrasi backend Supabase. Format: nama,email,profesi,kelas')}
                className="flex items-center gap-2 px-4 py-2 border border-white/10 text-slate-300 hover:border-emerald-500 hover:text-emerald-400 rounded-lg text-sm font-semibold transition cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                Import CSV
              </button>
            </div>

            {/* User Table */}
            <div className="bg-[#16181D] border border-white/10 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#111111] text-slate-400 text-[10px] uppercase tracking-wider border-b border-white/10">
                      <th className="p-4">User</th>
                      <th className="p-4">Profesi</th>
                      <th className="p-4">Kelas Enrolled</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-500 italic">
                          Tidak ada user ditemukan.
                        </td>
                      </tr>
                    )}
                    {filteredStudents.map((student) => {
                      const isActive = (student as any).isActive !== false;
                      const isExpanded = expandedUserId === student.id;
                      return (
                        <React.Fragment key={student.id}>
                          <tr className="border-t border-white/5 hover:bg-white/5 transition-colors bg-[#111111]">
                            {/* Avatar + Name */}
                            <td className="p-4">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={student.avatar}
                                  alt={student.name}
                                  className="w-10 h-10 rounded-full object-cover shrink-0"
                                />
                                <div>
                                  <div className="font-bold text-white">{student.name}</div>
                                  <div className="text-[10px] text-slate-400">{student.email}</div>
                                </div>
                              </div>
                            </td>
                            {/* Profesi */}
                            <td className="p-4">
                              <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-slate-300 rounded-full text-[10px] font-semibold">
                                {student.profession}
                              </span>
                            </td>
                            {/* Enrolled count */}
                            <td className="p-4 text-slate-300 font-bold">
                              {student.enrolledClasses.length} Kelas
                            </td>
                            {/* Status toggle */}
                            <td className="p-4">
                              <button
                                onClick={() => onToggleUserActive(student.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[10px] transition cursor-pointer border ${
                                  isActive
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                    : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                                }`}
                              >
                                {isActive ? (
                                  <>
                                    <UserCheck className="h-3 w-3" />
                                    Aktif
                                  </>
                                ) : (
                                  <>
                                    <UserX className="h-3 w-3" />
                                    Nonaktif
                                  </>
                                )}
                              </button>
                            </td>
                            {/* Expand toggle */}
                            <td className="p-4">
                              <button
                                onClick={() => setExpandedUserId(isExpanded ? null : student.id)}
                                className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition cursor-pointer text-slate-300"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </button>
                            </td>
                          </tr>

                          {/* Expanded Row */}
                          {isExpanded && (
                            <tr className="bg-[#0F1115] border-t border-white/5">
                              <td colSpan={5} className="p-4">
                                <div className="space-y-4">
                                  {/* Enrolled classes list */}
                                  <div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                                      Kelas Terdaftar ({student.enrolledClasses.length})
                                    </div>
                                    {student.enrolledClasses.length === 0 ? (
                                      <p className="text-slate-500 text-xs italic">Belum terdaftar di kelas manapun.</p>
                                    ) : (
                                      <div className="flex flex-wrap gap-2">
                                        {student.enrolledClasses.map((cid) => {
                                          const cls = classes.find((c) => c.id === cid);
                                          return (
                                            <div
                                              key={cid}
                                              className="flex items-center gap-1.5 bg-[#16181D] border border-white/10 px-2.5 py-1 rounded-lg"
                                            >
                                              <span className="text-xs text-white font-semibold">
                                                {cls ? `${cls.generationName} — ${cls.name}` : cid}
                                              </span>
                                              <button
                                                onClick={() => onRemoveEnrollment(student.id, cid)}
                                                className="text-red-400 hover:text-red-300 cursor-pointer transition ml-1"
                                                title="Hapus dari kelas"
                                              >
                                                <X className="h-3 w-3" />
                                              </button>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>

                                  {/* Add enrollment */}
                                  <div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                                      Tambah Kelas
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <select
                                        value={enrollSelectId[student.id] || ''}
                                        onChange={(e) =>
                                          setEnrollSelectId((prev) => ({
                                            ...prev,
                                            [student.id]: e.target.value,
                                          }))
                                        }
                                        className="text-xs p-2 bg-[#16181D] border border-white/10 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 flex-1 max-w-xs"
                                      >
                                        <option value="" className="bg-[#16181D]">-- Pilih Kelas --</option>
                                        {classes
                                          .filter((c) => !student.enrolledClasses.includes(c.id))
                                          .map((c) => (
                                            <option key={c.id} value={c.id} className="bg-[#16181D]">
                                              {c.generationName} — {c.name}
                                            </option>
                                          ))}
                                      </select>
                                      <button
                                        onClick={() => {
                                          const cid = enrollSelectId[student.id];
                                          if (!cid) return;
                                          onAddEnrollment(student.id, cid);
                                          setEnrollSelectId((prev) => ({ ...prev, [student.id]: '' }));
                                        }}
                                        disabled={!enrollSelectId[student.id]}
                                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-bold text-xs transition cursor-pointer"
                                      >
                                        Enroll
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: NOTIFIKASI ==================== */}
        {adminTab === 'notif' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h1 className="text-2xl font-black text-white">Notifikasi</h1>
                <p className="text-slate-400 text-sm mt-1">Kirim pesan ke peserta atau lihat riwayat notifikasi.</p>
              </div>
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                {(['send', 'history'] as NotifView[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setNotifView(v)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      notifView === v
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {v === 'send' ? 'Kirim Pesan' : 'Riwayat'}
                  </button>
                ))}
              </div>
            </div>

            {/* SUB VIEW: SEND */}
            {notifView === 'send' && (
              <div className="space-y-6">
                {/* Target Selector */}
                <div className="bg-[#16181D] border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
                  <h3 className="font-bold text-white text-sm">Target Penerima</h3>
                  <div className="flex flex-wrap gap-2">
                    {([
                      { id: 'all', label: 'Semua User' },
                      { id: 'pending', label: 'User Pending' },
                      { id: 'pick', label: 'Pilih User' },
                    ] as { id: NotifTarget; label: string }[]).map(({ id, label }) => (
                      <button
                        key={id}
                        onClick={() => {
                          setNotifTarget(id);
                          setSentIds(new Set());
                        }}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer border ${
                          notifTarget === id
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-950/40'
                            : 'text-slate-400 border-white/10 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Multi-select for 'pick' */}
                  {notifTarget === 'pick' && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {students.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => togglePickUser(s.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                            pickedUserIds.includes(s.id)
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {pickedUserIds.includes(s.id) && <Check className="h-3 w-3" />}
                          {s.name}
                        </button>
                      ))}
                      {!students.length && (
                        <p className="text-slate-500 text-xs italic">Tidak ada user terdaftar.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Template Selector */}
                <div className="bg-[#16181D] border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
                  <h3 className="font-bold text-white text-sm">Template Pesan</h3>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(TEMPLATE_LABELS) as TemplateKey[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => setTemplateKey(key)}
                        className={`px-3 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                          templateKey === key
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-950/40'
                            : 'text-slate-400 border-white/10 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {TEMPLATE_LABELS[key]}
                      </button>
                    ))}
                  </div>

                  {templateKey === 'custom' && (
                    <textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Tulis pesan custom Anda... Gunakan {nama} dan {kelas} untuk substitusi."
                      rows={4}
                      className="w-full text-xs p-3 bg-[#0F1115] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                    />
                  )}

                  {templateKey !== 'custom' && (
                    <div className="bg-[#0F1115] border border-white/5 rounded-xl p-3">
                      <p className="text-xs text-slate-300 leading-relaxed">{NOTIF_TEMPLATES[templateKey]}</p>
                    </div>
                  )}
                </div>

                {/* Preview Section */}
                {notifTargetUsers.length > 0 && (
                  <div className="bg-[#16181D] border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-sm">
                        Preview ({notifTargetUsers.filter((u) => !sentIds.has(u.id)).length} user belum terkirim)
                      </h3>
                      <button
                        onClick={handleSendAll}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition cursor-pointer shadow-lg shadow-emerald-950/40"
                      >
                        <Send className="h-3.5 w-3.5" />
                        Kirim Semua
                      </button>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {notifTargetUsers.map((user) => {
                        const isSent = sentIds.has(user.id);
                        const message = resolveMessage(getActiveTemplate(), user);
                        return (
                          <div
                            key={user.id}
                            className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
                              isSent
                                ? 'bg-emerald-500/5 border-emerald-500/20 opacity-60'
                                : 'bg-[#0F1115] border-white/10'
                            }`}
                          >
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-white text-xs">{user.name}</span>
                                <span className="text-[9px] text-slate-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                                  {user.profession}
                                </span>
                                {isSent && (
                                  <span className="text-[9px] text-emerald-400 font-bold">
                                    Terkirim
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{message || '—'}</p>
                            </div>
                            {!isSent && (
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => handleCopy(message)}
                                  className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                                  title="Copy pesan"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleMarkSent(user.id)}
                                  className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-emerald-400 transition cursor-pointer"
                                  title="Tandai terkirim"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {notifTargetUsers.length === 0 && (
                  <div className="bg-[#16181D] border border-white/10 rounded-2xl p-12 text-center text-slate-500 text-xs italic shadow-lg">
                    Tidak ada user untuk target yang dipilih.
                  </div>
                )}
              </div>
            )}

            {/* SUB VIEW: HISTORY */}
            {notifView === 'history' && (
              <div className="space-y-3">
                {[...notifications]
                  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                  .map((notif) => {
                    const iconMap: Record<string, React.ReactNode> = {
                      payment: <CreditCard className="h-4 w-4" />,
                      material: <BarChart2 className="h-4 w-4" />,
                      forum: <Bell className="h-4 w-4" />,
                      announcement: <Bell className="h-4 w-4" />,
                    };
                    return (
                      <div
                        key={notif.id}
                        className={`bg-[#16181D] border rounded-xl p-4 flex items-start gap-3 shadow-lg ${
                          notif.read ? 'border-white/10' : 'border-emerald-500/20'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg shrink-0 ${
                            notif.read ? 'bg-white/5 text-slate-400' : 'bg-emerald-500/10 text-emerald-400'
                          }`}
                        >
                          {iconMap[notif.type] || <Bell className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-xs">{notif.title}</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-white/5 text-slate-400 border border-white/10">
                              {notif.type}
                            </span>
                            {!notif.read && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Baru
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{notif.body}</p>
                          <span className="text-[10px] text-slate-500 mt-1 block">{formatDate(notif.createdAt)}</span>
                        </div>
                      </div>
                    );
                  })}
                {!notifications.length && (
                  <div className="bg-[#16181D] border border-white/10 rounded-2xl p-12 text-center text-slate-500 text-xs italic shadow-lg">
                    Belum ada riwayat notifikasi.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 5: LAPORAN ==================== */}
        {adminTab === 'laporan' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h1 className="text-2xl font-black text-white">Laporan & Analitik</h1>
                <p className="text-slate-400 text-sm mt-1">Analisis performa revenue, kelas, dan demografi peserta.</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                  {([
                    { id: 'all', label: 'Semua' },
                    { id: 'month', label: 'Bulan Ini' },
                    { id: '3months', label: '3 Bulan' },
                  ] as { id: LaporanFilter; label: string }[]).map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setLaporanFilter(id)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                        laporanFilter === id
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => window.alert('[MOCK] Export CSV: Fitur akan aktif setelah integrasi Supabase. Data akan mencakup semua transaksi dengan breakdown platform fee.')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl font-bold text-xs transition cursor-pointer border border-white/10"
                >
                  Export CSV
                </button>
              </div>
            </div>

            {/* Revenue Sharing Breakdown */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-[#16181D] border border-white/10 rounded-xl p-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Total Revenue</p>
                <p className="text-xl font-black text-white mt-1">Rp {totalRevenue.toLocaleString('id-ID')}</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <p className="text-xs text-amber-400 uppercase tracking-wider">Platform Fee (5%)</p>
                <p className="text-xl font-black text-amber-400 mt-1">Rp {Math.round(totalRevenue * 0.05).toLocaleString('id-ID')}</p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <p className="text-xs text-emerald-400 uppercase tracking-wider">Net Apoteker Rahmato</p>
                <p className="text-xl font-black text-emerald-400 mt-1">Rp {Math.round(totalRevenue * 0.95).toLocaleString('id-ID')}</p>
              </div>
            </div>

            {/* Revenue per Generasi */}
            <div className="bg-[#16181D] border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
              <h3 className="font-bold text-white">Revenue per Generasi</h3>
              {revenueByGen.length === 0 ? (
                <p className="text-slate-500 text-xs italic">Tidak ada data revenue untuk periode ini.</p>
              ) : (
                <div className="space-y-3">
                  {revenueByGen.map(([genName, amount]) => {
                    const widthPercent = Math.round((amount / maxGenRevenue) * 100);
                    const isActive = genName.toLowerCase().includes('6') || genName.toLowerCase().includes('aktif');
                    return (
                      <div key={genName} className="flex items-center gap-3">
                        <div className="w-36 shrink-0 text-xs text-slate-300 font-semibold truncate" title={genName}>
                          {genName}
                        </div>
                        <div className="flex-1 h-6 bg-white/5 rounded-lg overflow-hidden">
                          <div
                            style={{ width: `${widthPercent}%` }}
                            className={`h-full rounded-lg transition-all duration-500 ${
                              isActive ? 'bg-emerald-500' : 'bg-slate-600'
                            }`}
                          />
                        </div>
                        <div className="w-28 shrink-0 text-xs text-slate-300 font-bold text-right">
                          {formatRupiah(amount)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Top Kelas by Enrollment */}
            <div className="bg-[#16181D] border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
              <h3 className="font-bold text-white">Top Kelas by Enrollment</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-slate-400 text-[10px] uppercase tracking-wider border-b border-white/10">
                      <th className="pb-3 pr-4">Nama Kelas</th>
                      <th className="pb-3 pr-4">Kategori</th>
                      <th className="pb-3 pr-4">Jumlah Murid</th>
                      <th className="pb-3 pr-4">Revenue</th>
                      <th className="pb-3">% dari Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {topClasses.map((cls) => {
                      const pct = totalStudentsCount > 0
                        ? Math.round((cls.studentsCount / totalStudentsCount) * 100)
                        : 0;
                      const rev = revenueByClass[cls.id] || 0;
                      return (
                        <tr key={cls.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 pr-4">
                            <div className="font-bold text-white">{cls.name}</div>
                            <div className="text-[10px] text-slate-400">{cls.generationName}</div>
                          </td>
                          <td className="py-3 pr-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                                cls.category === 'ADVANCE'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              }`}
                            >
                              {cls.category}
                            </span>
                          </td>
                          <td className="py-3 pr-4 font-bold text-white">{cls.studentsCount.toLocaleString('id-ID')}</td>
                          <td className="py-3 pr-4 text-slate-300">{rev > 0 ? formatRupiah(rev) : '—'}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-white/5 rounded-full overflow-hidden">
                                <div
                                  style={{ width: `${pct}%` }}
                                  className="h-full bg-emerald-500 rounded-full"
                                />
                              </div>
                              <span className="text-slate-400">{pct}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Student by Profession */}
            <div className="bg-[#16181D] border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
              <h3 className="font-bold text-white">Peserta per Profesi</h3>
              {studentsByProf.length === 0 ? (
                <p className="text-slate-500 text-xs italic">Tidak ada data peserta.</p>
              ) : (
                <div className="space-y-3">
                  {studentsByProf.map(([prof, count], idx) => {
                    const widthPercent = Math.round((count / maxProfCount) * 100);
                    const barColor = PROF_BAR_COLORS[idx % PROF_BAR_COLORS.length];
                    return (
                      <div key={prof} className="flex items-center gap-3">
                        <div className="w-24 shrink-0 text-xs text-slate-300 font-semibold">{prof}</div>
                        <div className="flex-1 h-5 bg-white/5 rounded-lg overflow-hidden">
                          <div
                            style={{ width: `${widthPercent}%` }}
                            className={`h-full rounded-lg transition-all duration-500 ${barColor}`}
                          />
                        </div>
                        <div className="w-16 shrink-0 text-xs text-slate-400 text-right">
                          {count} orang
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 6: PENGATURAN ==================== */}
        {adminTab === 'pengaturan' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-black text-white">Pengaturan Platform</h1>
              <p className="text-slate-400 text-sm mt-1">Konfigurasi revenue share, payment gateway, dan migrasi data.</p>
            </div>

            <div className="space-y-4">

              {/* Revenue Share */}
              <div className="bg-[#16181D] border border-white/10 rounded-2xl p-6 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">Revenue Share</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Fee platform per transaksi sukses</p>
                  </div>
                  <span className="text-[10px] text-slate-500 bg-white/5 border border-white/10 px-2 py-1 rounded-lg">
                    Dikonfigurasi oleh platform
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value="5% per transaksi"
                    disabled
                    className="text-sm px-4 py-2.5 bg-[#0F1115] border border-white/10 text-slate-400 rounded-xl w-48 cursor-not-allowed"
                  />
                  <span className="text-xs text-amber-400 font-semibold">
                    = Rp {Math.round(PLATFORM_STATS_FALLBACK.totalRevenue * 0.05).toLocaleString('id-ID')} dari total historical
                  </span>
                </div>
              </div>

              {/* Maintenance Fee */}
              <div className="bg-[#16181D] border border-white/10 rounded-2xl p-6 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">Maintenance Fee</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Biaya bulanan hosting & maintenance platform</p>
                  </div>
                  <span className="text-[10px] text-slate-500 bg-white/5 border border-white/10 px-2 py-1 rounded-lg">
                    Dikonfigurasi oleh platform
                  </span>
                </div>
                <input
                  type="text"
                  value="Rp 500.000 / bulan"
                  disabled
                  className="text-sm px-4 py-2.5 bg-[#0F1115] border border-white/10 text-slate-400 rounded-xl w-48 cursor-not-allowed"
                />
              </div>

              {/* Payment Gateway */}
              <div className="bg-[#16181D] border border-amber-500/20 rounded-2xl p-6 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">Payment Gateway</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Midtrans / Xendit akan terhubung setelah integrasi selesai</p>
                  </div>
                  <span className="px-3 py-1 text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                    Integrasi Berlangsung (Rafli)
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'API credentials configured', done: true },
                    { label: 'Webhook endpoint ready', done: true },
                    { label: 'Testing sandbox', done: false, inProgress: true },
                    { label: 'Go live', done: false },
                  ].map(({ label, done, inProgress }) => (
                    <div key={label} className="flex items-center gap-2.5 text-xs">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                        done
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : inProgress
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-white/5 text-slate-500 border border-white/10'
                      }`}>
                        {done ? <Check className="h-3 w-3" /> : inProgress ? '⏳' : '○'}
                      </span>
                      <span className={done ? 'text-slate-300' : inProgress ? 'text-amber-400' : 'text-slate-500'}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform Info */}
              <div className="bg-[#16181D] border border-white/10 rounded-2xl p-6 shadow-lg">
                <h3 className="font-bold text-white text-sm mb-4">Platform Info</h3>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-slate-500 uppercase tracking-wider text-[10px]">Versi App</p>
                    <p className="text-white font-bold mt-1">v1.0.0</p>
                  </div>
                  <div>
                    <p className="text-slate-500 uppercase tracking-wider text-[10px]">Last Deploy</p>
                    <p className="text-white font-bold mt-1">11 Jul 2026</p>
                  </div>
                  <div>
                    <p className="text-slate-500 uppercase tracking-wider text-[10px]">Environment</p>
                    <p className="text-emerald-400 font-bold mt-1">Production</p>
                  </div>
                </div>
              </div>

              {/* Data Migration */}
              <div className="bg-[#16181D] border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
                <div>
                  <h3 className="font-bold text-white text-sm">Migrasi Data</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    35.247 user dari sistem lama siap diimport ke Supabase
                  </p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2.5 text-xs text-blue-300 flex items-center gap-2">
                  <Info className="h-4 w-4 shrink-0" />
                  Proses migrasi akan memindahkan seluruh data alumni, enrollment, dan riwayat transaksi ke backend baru.
                </div>
                <button
                  disabled
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-slate-500 rounded-xl font-bold text-xs cursor-not-allowed opacity-60"
                >
                  <Upload className="h-4 w-4" />
                  Mulai Migrasi
                  <span className="text-[10px] font-normal ml-1">(Tersedia setelah backend aktif)</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {adminTab === 'roles' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-black text-white">Kelola Peran</h1>
              <p className="text-slate-400 text-sm mt-1">
                Peran (Murid / Dosen / Admin) diatur di sini — <strong>tanpa perlu ke SSO</strong>.
                Cukup masukkan email pengguna lalu pilih perannya.
              </p>
            </div>

            {/* Form set peran */}
            <div className="bg-[#16181D] border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
              <h3 className="font-bold text-white text-sm">Setel Peran Pengguna</h3>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Email Pengguna</label>
                  <input
                    type="email"
                    value={roleEmail}
                    onChange={(e) => setRoleEmail(e.target.value)}
                    placeholder="nama@contoh.com"
                    className="w-full text-sm px-4 py-2.5 bg-[#0F1115] border border-white/10 rounded-xl text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Peran</label>
                  <select
                    value={roleValue}
                    onChange={(e) => setRoleValue(e.target.value as AppRole)}
                    className="text-sm px-4 py-2.5 bg-[#0F1115] border border-white/10 rounded-xl text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="student" className="bg-[#16181D]">Murid</option>
                    <option value="mentor" className="bg-[#16181D]">Dosen</option>
                    <option value="admin" className="bg-[#16181D]">Admin</option>
                  </select>
                </div>
                <button
                  onClick={() => handleSaveRole(roleEmail, roleValue)}
                  disabled={roleSaving}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {roleSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  Simpan Peran
                </button>
              </div>
              {roleNotice && (
                <div className="text-xs text-slate-300 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  {roleNotice}
                </div>
              )}
            </div>

            {/* Daftar peran */}
            <div className="bg-[#16181D] border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">Daftar Peran Terdaftar</h3>
                <button
                  onClick={loadRoles}
                  disabled={rolesLoading}
                  className="text-xs px-3 py-1.5 border border-white/10 hover:bg-white/5 text-slate-300 rounded-lg transition disabled:opacity-60 flex items-center gap-1.5"
                >
                  {rolesLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                  Muat Ulang
                </button>
              </div>

              {rolesError && (
                <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{rolesError}</span>
                </div>
              )}

              {!rolesError && roles.length === 0 && !rolesLoading && (
                <p className="text-xs text-slate-500">Belum ada peran yang disetel. Tambahkan lewat form di atas.</p>
              )}

              {roles.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[10px] text-slate-500 uppercase border-b border-white/10">
                        <th className="p-3">Email</th>
                        <th className="p-3">Peran</th>
                        <th className="p-3 text-right">Ubah</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roles.map((r) => (
                        <tr key={r.email} className="border-b border-white/5">
                          <td className="p-3 text-slate-200">{r.email}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              r.role === 'admin'
                                ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                : r.role === 'mentor'
                                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                : 'text-slate-300 bg-white/5 border-white/10'
                            }`}>
                              {r.role === 'admin' ? 'Admin' : r.role === 'mentor' ? 'Dosen' : 'Murid'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <select
                              value={r.role}
                              onChange={(e) => handleSaveRole(r.email, e.target.value as AppRole)}
                              disabled={roleSaving}
                              className="text-xs px-2 py-1.5 bg-[#0F1115] border border-white/10 rounded-lg text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none disabled:opacity-60"
                            >
                              <option value="student" className="bg-[#16181D]">Murid</option>
                              <option value="mentor" className="bg-[#16181D]">Dosen</option>
                              <option value="admin" className="bg-[#16181D]">Admin</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
