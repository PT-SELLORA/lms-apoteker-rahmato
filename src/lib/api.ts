// LMS Apoteker Rahmato — Supabase API Service
// Run `npm install @supabase/supabase-js` before using this module.

import { supabase } from './supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { Class, User, ForumPost, ForumReply, Material, Transaction, QuizAttempt } from '../types';

// =============================================================================
// AUTH
// =============================================================================

export async function signUp(
  email: string,
  password: string,
  name: string,
  profession: User['profession'],
  role: 'student' | 'mentor' = 'student'
): Promise<User> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, profession, role },
    },
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('Sign up failed: no user returned.');

  // Profile is created automatically via the DB trigger (handle_new_user).
  // Fetch and return it.
  return await getProfileById(data.user.id);
}

export async function signIn(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('Sign in failed.');
  return await getProfileById(data.user.id);
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return await getProfileById(user.id);
}

// ---------------------------------------------------------------------------
// Internal: fetch profile row and map to User type
// ---------------------------------------------------------------------------
async function getProfileById(id: string): Promise<User> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(`Profile fetch failed: ${error.message}`);
  if (!data) throw new Error('Profile not found.');

  const enrolledClasses = await getEnrolledClasses(id);
  const completedClasses = await getCompletedClasses(id);

  return mapProfileToUser(data, enrolledClasses, completedClasses);
}

function mapProfileToUser(
  row: {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'mentor';
    avatar_url: string | null;
    profession: User['profession'] | null;
    created_at: string;
  },
  enrolledClasses: string[],
  completedClasses: string[]
): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    avatar: row.avatar_url ?? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=60',
    profession: (row.profession ?? 'Lainnya') as User['profession'],
    enrolledClasses,
    completedClasses,
  };
}

// =============================================================================
// DATA LOADING
// =============================================================================

// ---------------------------------------------------------------------------
// loadClasses — reads all classes; studentsCount comes from the stored column
// (incremented on purchase). For a fully dynamic count, replace with a view
// that does COUNT(enrollments) grouped by class_id.
// ---------------------------------------------------------------------------
export async function loadClasses(): Promise<Class[]> {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .order('generation_id', { ascending: true });

  if (error) throw new Error(`loadClasses failed: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    generationId: row.generation_id,
    generationName: row.generation_name,
    name: row.name,
    category: row.category as Class['category'],
    price: row.price,
    description: row.description,
    materialsCount: row.materials_count,
    studentsCount: row.students_count,
    playlistUrl: row.playlist_url ?? undefined,
  }));
}

// ---------------------------------------------------------------------------
// loadStudents — mentor only; loads all student profiles
// ---------------------------------------------------------------------------
export async function loadStudents(): Promise<User[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`loadStudents failed: ${error.message}`);

  // Bulk fetch all enrollments once to avoid N+1 queries
  const { data: allEnrollments, error: enrollErr } = await supabase
    .from('enrollments')
    .select('user_id, class_id, completed');

  if (enrollErr) throw new Error(`loadStudents enrollments failed: ${enrollErr.message}`);

  return (data ?? []).map((profile) => {
    const userEnrollments = (allEnrollments ?? []).filter((e) => e.user_id === profile.id);
    const enrolledClasses = userEnrollments.map((e) => e.class_id);
    const completedClasses = userEnrollments.filter((e) => e.completed).map((e) => e.class_id);
    return mapProfileToUser(profile, enrolledClasses, completedClasses);
  });
}

// ---------------------------------------------------------------------------
// loadForumPosts — returns posts with replies + user info joined
// ---------------------------------------------------------------------------
export async function loadForumPosts(classId?: string): Promise<ForumPost[]> {
  let query = supabase
    .from('forum_posts')
    .select(`
      id,
      class_id,
      title,
      content,
      created_at,
      user_id,
      profiles:user_id (
        name,
        role,
        profession,
        avatar_url
      ),
      forum_replies (
        id,
        post_id,
        content,
        created_at,
        user_id,
        profiles:user_id (
          name,
          role,
          profession,
          avatar_url
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (classId) {
    query = query.eq('class_id', classId);
  }

  const { data, error } = await query;
  if (error) throw new Error(`loadForumPosts failed: ${error.message}`);

  return (data ?? []).map((post) => {
    // Supabase returns the joined profile as an object (not array) for !inner
    const postProfile = post.profiles as unknown as {
      name: string;
      role: string;
      profession: string | null;
      avatar_url: string | null;
    } | null;

    const replies: ForumReply[] = ((post.forum_replies as unknown[]) ?? []).map((r: unknown) => {
      const reply = r as {
        id: string;
        post_id: string;
        user_id: string;
        content: string;
        created_at: string;
        profiles: {
          name: string;
          role: string;
          profession: string | null;
          avatar_url: string | null;
        } | null;
      };
      const rProfile = reply.profiles;
      return {
        id: reply.id,
        userId: reply.user_id,
        userName: rProfile?.name ?? 'Unknown',
        userRole: (rProfile?.role ?? 'student') as ForumReply['userRole'],
        userProfession: rProfile?.profession ?? 'Lainnya',
        avatar: rProfile?.avatar_url ?? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=60',
        content: reply.content,
        createdAt: reply.created_at,
      };
    });

    // Sort replies oldest-first for display
    replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return {
      id: post.id,
      classId: post.class_id,
      userId: post.user_id,
      userName: postProfile?.name ?? 'Unknown',
      userRole: (postProfile?.role ?? 'student') as ForumPost['userRole'],
      userProfession: postProfile?.profession ?? 'Lainnya',
      avatar: postProfile?.avatar_url ?? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=60',
      title: post.title,
      content: post.content,
      createdAt: post.created_at,
      replies,
    };
  });
}

// ---------------------------------------------------------------------------
// loadTransactions — student sees own; mentor sees all (enforced by RLS)
// Provide userId to filter for a specific student (used by student dashboard).
// ---------------------------------------------------------------------------
export async function loadTransactions(userId?: string): Promise<Transaction[]> {
  let query = supabase
    .from('transactions')
    .select(`
      id,
      user_id,
      class_id,
      amount,
      status,
      payment_method,
      created_at,
      profiles:user_id (
        name,
        email
      ),
      classes:class_id (
        name,
        generation_name
      )
    `)
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;
  if (error) throw new Error(`loadTransactions failed: ${error.message}`);

  return (data ?? []).map((row) => {
    const profile = row.profiles as unknown as { name: string; email: string } | null;
    const cls = row.classes as unknown as { name: string; generation_name: string } | null;
    return {
      id: row.id,
      userId: row.user_id,
      userName: profile?.name ?? '',
      userEmail: profile?.email ?? '',
      classId: row.class_id,
      className: cls?.name ?? '',
      generationName: cls?.generation_name ?? '',
      amount: row.amount,
      status: row.status as Transaction['status'],
      paymentMethod: row.payment_method,
      createdAt: row.created_at,
    };
  });
}

// ---------------------------------------------------------------------------
// loadAttempts — student sees own; mentor sees all (RLS enforced)
// ---------------------------------------------------------------------------
export async function loadAttempts(userId?: string): Promise<QuizAttempt[]> {
  let query = supabase
    .from('quiz_attempts')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (userId) {
    query = query.eq('student_id', userId);
  }

  const { data, error } = await query;
  if (error) throw new Error(`loadAttempts failed: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    studentId: row.student_id,
    quizId: row.quiz_id,
    classId: row.class_id,
    score: row.score,
    passed: row.passed,
    submittedAt: row.submitted_at,
  }));
}

// =============================================================================
// PAYMENTS — Xendit via Internal Ventera gateway (prefix LMSRHMT)
// =============================================================================

export interface CreateInvoiceResult {
  invoice_id: string;
  external_id: string;
  invoice_url: string;
  amount: number;
}

/**
 * Membuat invoice Xendit untuk sebuah kelas lewat edge function
 * `lmsrhmt-create-invoice`. Mengembalikan invoice_url (halaman pembayaran
 * Xendit) yang harus dibuka/diarahkan ke user.
 *
 * Harga diambil ulang di server dari tabel classes — nominal dari client
 * tidak dipercaya.
 */
export async function createXenditInvoice(params: {
  classId: string;
  buyerName: string;
  buyerEmail: string;
  /** Base URL untuk redirect success/failed Xendit (default: origin server). */
  redirectBase?: string;
}): Promise<CreateInvoiceResult> {
  const { data, error } = await supabase.functions.invoke('lmsrhmt-create-invoice', {
    body: {
      class_id: params.classId,
      buyer_name: params.buyerName,
      buyer_email: params.buyerEmail,
      redirect_base: params.redirectBase,
    },
  });

  if (error) {
    // supabase.functions.invoke menyembunyikan body error untuk respons non-2xx.
    // Coba baca JSON { error } yang sebenarnya dari response.
    type WithContext = Error & { context?: { json?: () => Promise<unknown> } };
    const ctx = (error as WithContext).context;
    if (ctx?.json) {
      try {
        const payload = (await ctx.json()) as { error?: string };
        if (payload?.error) throw new Error(payload.error);
      } catch (e) {
        if (e instanceof Error && e.message !== error.message) throw e;
      }
    }
    throw new Error(error.message);
  }

  if (data?.error) throw new Error(data.error);
  if (!data?.invoice_url) throw new Error('Server tidak mengembalikan invoice_url.');
  return data as CreateInvoiceResult;
}

// =============================================================================
// ENROLLMENTS
// =============================================================================

export async function getEnrolledClasses(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('enrollments')
    .select('class_id')
    .eq('user_id', userId);

  if (error) throw new Error(`getEnrolledClasses failed: ${error.message}`);
  return (data ?? []).map((e) => e.class_id);
}

export async function getCompletedClasses(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('enrollments')
    .select('class_id')
    .eq('user_id', userId)
    .eq('completed', true);

  if (error) throw new Error(`getCompletedClasses failed: ${error.message}`);
  return (data ?? []).map((e) => e.class_id);
}

// =============================================================================
// PURCHASE
// =============================================================================

export async function purchaseClass(
  userId: string,
  classId: string,
  amount: number,
  paymentMethod: string
): Promise<Transaction> {
  // 1. Insert transaction
  const txId = `TX-${Date.now().toString().slice(-8)}`;
  const { error: txError } = await supabase.from('transactions').insert({
    id: txId,
    user_id: userId,
    class_id: classId,
    amount,
    status: 'success',
    payment_method: paymentMethod,
  });
  if (txError) throw new Error(`purchaseClass transaction failed: ${txError.message}`);

  // 2. Upsert enrollment (idempotent — won't error if already enrolled)
  const { error: enrollError } = await supabase
    .from('enrollments')
    .upsert({ user_id: userId, class_id: classId, completed: false }, { onConflict: 'user_id,class_id' });
  if (enrollError) throw new Error(`purchaseClass enrollment failed: ${enrollError.message}`);

  // 3. Increment students_count on the class
  const { error: rpcError } = await supabase.rpc('increment_students_count' as never, {
    class_id_input: classId,
  } as never);
  // If the RPC doesn't exist yet we fall back to a read-modify-write (less safe but functional)
  if (rpcError) {
    const { data: cls } = await supabase
      .from('classes')
      .select('students_count')
      .eq('id', classId)
      .single();
    if (cls) {
      await supabase
        .from('classes')
        .update({ students_count: cls.students_count + 1 })
        .eq('id', classId);
    }
  }

  // 4. Return the new transaction (with user/class info joined)
  const txList = await loadTransactions(userId);
  const newTx = txList.find((t) => t.id === txId);
  if (!newTx) throw new Error('Transaction created but could not be retrieved.');
  return newTx;
}

// =============================================================================
// MATERIALS (Mentor)
// =============================================================================

export async function addMaterial(
  classId: string,
  title: string,
  type: 'video' | 'pdf' | 'quiz',
  description: string,
  durationOrPages: string,
  content: string,
  videoUrl?: string,
  youtubeId?: string
): Promise<Material> {
  const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  // Derive order_index as count of existing materials + 1
  const { count } = await supabase
    .from('materials')
    .select('id', { count: 'exact', head: true })
    .eq('class_id', classId);

  const { data, error } = await supabase
    .from('materials')
    .insert({
      id,
      class_id: classId,
      title,
      type,
      description,
      duration_or_pages: durationOrPages,
      content,
      video_url: videoUrl ?? null,
      youtube_id: youtubeId ?? null,
      order_index: (count ?? 0) + 1,
    })
    .select()
    .single();

  if (error) throw new Error(`addMaterial failed: ${error.message}`);
  if (!data) throw new Error('addMaterial: no data returned.');

  // Increment materials_count on the class
  const { data: cls } = await supabase
    .from('classes')
    .select('materials_count')
    .eq('id', classId)
    .single();
  if (cls) {
    await supabase
      .from('classes')
      .update({ materials_count: cls.materials_count + 1 })
      .eq('id', classId);
  }

  return {
    id: data.id,
    classId: data.class_id,
    title: data.title,
    type: data.type as Material['type'],
    description: data.description,
    durationOrPages: data.duration_or_pages,
    content: data.content,
    videoUrl: data.video_url ?? undefined,
    youtubeId: data.youtube_id ?? undefined,
  };
}

export async function getMaterialsForClass(classId: string): Promise<Material[]> {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .eq('class_id', classId)
    .order('order_index', { ascending: true });

  if (error) throw new Error(`getMaterialsForClass failed: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    classId: row.class_id,
    title: row.title,
    type: row.type as Material['type'],
    description: row.description,
    durationOrPages: row.duration_or_pages,
    content: row.content,
    videoUrl: row.video_url ?? undefined,
    youtubeId: row.youtube_id ?? undefined,
  }));
}

// =============================================================================
// STUDENTS (Mentor — manual enrollment)
// =============================================================================

export async function addStudentManual(
  name: string,
  email: string,
  profession: User['profession'],
  initialClassId?: string
): Promise<User> {
  // Create the user via Supabase Auth Admin API requires a service-role key
  // which should NOT live on the client. In production, call a Supabase
  // Edge Function that uses the service-role key to call auth.admin.createUser().
  //
  // For now we call the public signUp with a random password so the mentor
  // can register them, then they receive a magic link or password reset email.
  const tempPassword = `Farmasi${Math.random().toString(36).slice(2, 10)}!`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password: tempPassword,
    options: {
      data: { name, profession, role: 'student' },
    },
  });
  if (error) throw new Error(`addStudentManual sign up failed: ${error.message}`);
  if (!data.user) throw new Error('addStudentManual: no user returned.');

  const userId = data.user.id;

  // If an initial class is provided, enroll them immediately
  if (initialClassId) {
    const { error: enrollError } = await supabase
      .from('enrollments')
      .upsert({ user_id: userId, class_id: initialClassId, completed: false }, { onConflict: 'user_id,class_id' });
    if (enrollError) throw new Error(`addStudentManual enrollment failed: ${enrollError.message}`);

    // Increment students_count
    const { data: cls } = await supabase
      .from('classes')
      .select('students_count')
      .eq('id', initialClassId)
      .single();
    if (cls) {
      await supabase
        .from('classes')
        .update({ students_count: cls.students_count + 1 })
        .eq('id', initialClassId);
    }
  }

  const enrolledClasses = initialClassId ? [initialClassId] : [];
  const profile = data.user;

  return {
    id: userId,
    name,
    email,
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=60',
    profession,
    enrolledClasses,
    completedClasses: [],
  };
}

// =============================================================================
// FORUM
// =============================================================================

export async function createForumPost(
  classId: string,
  userId: string,
  title: string,
  content: string
): Promise<ForumPost> {
  const { data, error } = await supabase
    .from('forum_posts')
    .insert({ class_id: classId, user_id: userId, title, content })
    .select()
    .single();

  if (error) throw new Error(`createForumPost failed: ${error.message}`);
  if (!data) throw new Error('createForumPost: no data returned.');

  // Fetch with user profile
  const posts = await loadForumPosts(classId);
  const newPost = posts.find((p) => p.id === data.id);
  if (!newPost) throw new Error('Post created but could not be retrieved.');
  return newPost;
}

export async function createForumReply(
  postId: string,
  userId: string,
  content: string
): Promise<ForumReply> {
  const { data, error } = await supabase
    .from('forum_replies')
    .insert({ post_id: postId, user_id: userId, content })
    .select()
    .single();

  if (error) throw new Error(`createForumReply failed: ${error.message}`);
  if (!data) throw new Error('createForumReply: no data returned.');

  // Fetch user profile to enrich the reply object
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('name, role, profession, avatar_url')
    .eq('id', userId)
    .single();

  if (profileError) throw new Error(`createForumReply profile fetch failed: ${profileError.message}`);

  return {
    id: data.id,
    userId: data.user_id,
    userName: profile?.name ?? 'Unknown',
    userRole: (profile?.role ?? 'student') as ForumReply['userRole'],
    userProfession: profile?.profession ?? 'Lainnya',
    avatar: profile?.avatar_url ?? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=60',
    content: data.content,
    createdAt: data.created_at,
  };
}

// =============================================================================
// QUIZ
// =============================================================================

export async function submitQuizAttempt(
  studentId: string,
  quizId: string,
  classId: string,
  score: number,
  passed: boolean
): Promise<QuizAttempt> {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({ student_id: studentId, quiz_id: quizId, class_id: classId, score, passed })
    .select()
    .single();

  if (error) throw new Error(`submitQuizAttempt failed: ${error.message}`);
  if (!data) throw new Error('submitQuizAttempt: no data returned.');

  // If passed, mark the enrollment as completed
  if (passed) {
    const { error: enrollError } = await supabase
      .from('enrollments')
      .update({ completed: true })
      .eq('user_id', studentId)
      .eq('class_id', classId);
    if (enrollError) {
      // Non-fatal: log but don't throw — the attempt was saved
      console.warn('submitQuizAttempt: could not mark enrollment as completed:', enrollError.message);
    }
  }

  return {
    id: data.id,
    studentId: data.student_id,
    quizId: data.quiz_id,
    classId: data.class_id,
    score: data.score,
    passed: data.passed,
    submittedAt: data.submitted_at,
  };
}

export async function getQuizAttempts(
  studentId: string,
  classId?: string
): Promise<QuizAttempt[]> {
  let query = supabase
    .from('quiz_attempts')
    .select('*')
    .eq('student_id', studentId)
    .order('submitted_at', { ascending: false });

  if (classId) {
    query = query.eq('class_id', classId);
  }

  const { data, error } = await query;
  if (error) throw new Error(`getQuizAttempts failed: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    studentId: row.student_id,
    quizId: row.quiz_id,
    classId: row.class_id,
    score: row.score,
    passed: row.passed,
    submittedAt: row.submitted_at,
  }));
}

// =============================================================================
// REALTIME SUBSCRIPTIONS
// =============================================================================

/**
 * Subscribe to new forum posts (and their replies) for a given class.
 * The callback receives the full updated posts list for that class.
 * Returns the channel so the caller can call channel.unsubscribe() on cleanup.
 */
export function subscribeToForumPosts(
  classId: string,
  callback: (posts: ForumPost[]) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`forum-posts-${classId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'forum_posts',
        filter: `class_id=eq.${classId}`,
      },
      async () => {
        // Re-fetch full data on any change so replies are included
        try {
          const posts = await loadForumPosts(classId);
          callback(posts);
        } catch (err) {
          console.error('subscribeToForumPosts fetch error:', err);
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'forum_replies',
      },
      async () => {
        try {
          const posts = await loadForumPosts(classId);
          callback(posts);
        } catch (err) {
          console.error('subscribeToForumPosts (replies) fetch error:', err);
        }
      }
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to material changes for a given class.
 * The callback receives the full updated materials list.
 */
export function subscribeToMaterials(
  classId: string,
  callback: (materials: Material[]) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`materials-${classId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'materials',
        filter: `class_id=eq.${classId}`,
      },
      async () => {
        try {
          const materials = await getMaterialsForClass(classId);
          callback(materials);
        } catch (err) {
          console.error('subscribeToMaterials fetch error:', err);
        }
      }
    )
    .subscribe();

  return channel;
}

// ============================================================================
// USER ROLES — peran (student/mentor/admin) dikelola di DB LMS via BFF /api/roles.
// Tabel user_roles privat (RLS server-only), jadi client TIDAK query Supabase
// langsung; semua lewat endpoint server yang dijaga admin.
// ============================================================================

export type AppRole = 'student' | 'mentor' | 'admin';

export interface UserRoleEntry {
  email: string;
  role: AppRole;
  updated_at: string;
}

/** Ambil daftar peran (khusus admin — server yang menegakkan). */
export async function fetchRoles(): Promise<UserRoleEntry[]> {
  const resp = await fetch('/api/roles', { credentials: 'include' });
  if (!resp.ok) {
    const { error } = await resp.json().catch(() => ({ error: `HTTP ${resp.status}` }));
    throw new Error(error ?? `HTTP ${resp.status}`);
  }
  const { roles } = (await resp.json()) as { roles: UserRoleEntry[] };
  return roles;
}

/** Set/ubah peran untuk sebuah email (khusus admin). */
export async function saveRole(email: string, role: AppRole): Promise<UserRoleEntry> {
  const resp = await fetch('/api/roles', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, role }),
  });
  if (!resp.ok) {
    const { error } = await resp.json().catch(() => ({ error: `HTTP ${resp.status}` }));
    throw new Error(error ?? `HTTP ${resp.status}`);
  }
  const { row } = (await resp.json()) as { row: UserRoleEntry };
  return row;
}
