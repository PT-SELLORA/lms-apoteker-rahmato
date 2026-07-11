-- =============================================================================
-- LMS Apoteker Rahmato / Farma Masterclass
-- Migration 002: Row Level Security Policies
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Helper function: check if the current user is a mentor
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_mentor()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'mentor'
  );
$$;

-- ---------------------------------------------------------------------------
-- Enable RLS on every table
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions    ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- PROFILES
-- =============================================================================

-- Any authenticated user can read all profiles (needed for forum user info)
CREATE POLICY "profiles: authenticated users can read"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Users can only update their own profile
CREATE POLICY "profiles: users update own row"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Mentors can insert profiles when manually adding students via admin
CREATE POLICY "profiles: mentor can insert"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_mentor());

-- =============================================================================
-- GENERATIONS
-- =============================================================================

-- Public read — anyone (even anon) can browse generations
CREATE POLICY "generations: public read"
  ON public.generations FOR SELECT
  USING (true);

-- Only mentors can mutate generations
CREATE POLICY "generations: mentor insert"
  ON public.generations FOR INSERT
  TO authenticated
  WITH CHECK (public.is_mentor());

CREATE POLICY "generations: mentor update"
  ON public.generations FOR UPDATE
  TO authenticated
  USING (public.is_mentor())
  WITH CHECK (public.is_mentor());

CREATE POLICY "generations: mentor delete"
  ON public.generations FOR DELETE
  TO authenticated
  USING (public.is_mentor());

-- =============================================================================
-- CLASSES
-- =============================================================================

-- Public read — landing page browsing
CREATE POLICY "classes: public read"
  ON public.classes FOR SELECT
  USING (true);

CREATE POLICY "classes: mentor insert"
  ON public.classes FOR INSERT
  TO authenticated
  WITH CHECK (public.is_mentor());

CREATE POLICY "classes: mentor update"
  ON public.classes FOR UPDATE
  TO authenticated
  USING (public.is_mentor())
  WITH CHECK (public.is_mentor());

CREATE POLICY "classes: mentor delete"
  ON public.classes FOR DELETE
  TO authenticated
  USING (public.is_mentor());

-- =============================================================================
-- ENROLLMENTS
-- =============================================================================

-- Students can see their own enrollments; mentors can see everyone's
CREATE POLICY "enrollments: read own or mentor sees all"
  ON public.enrollments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_mentor());

-- Students insert their own enrollment on purchase
CREATE POLICY "enrollments: insert own"
  ON public.enrollments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Students can update their own enrollment (e.g., mark completed)
CREATE POLICY "enrollments: update own"
  ON public.enrollments FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Mentor can also update enrollments (e.g., manually marking completion)
CREATE POLICY "enrollments: mentor update"
  ON public.enrollments FOR UPDATE
  TO authenticated
  USING (public.is_mentor())
  WITH CHECK (public.is_mentor());

-- =============================================================================
-- MATERIALS
-- =============================================================================

-- Public read — enrolled students and visitors can see material metadata
CREATE POLICY "materials: public read"
  ON public.materials FOR SELECT
  USING (true);

CREATE POLICY "materials: mentor insert"
  ON public.materials FOR INSERT
  TO authenticated
  WITH CHECK (public.is_mentor());

CREATE POLICY "materials: mentor update"
  ON public.materials FOR UPDATE
  TO authenticated
  USING (public.is_mentor())
  WITH CHECK (public.is_mentor());

CREATE POLICY "materials: mentor delete"
  ON public.materials FOR DELETE
  TO authenticated
  USING (public.is_mentor());

-- =============================================================================
-- QUIZZES
-- =============================================================================

CREATE POLICY "quizzes: public read"
  ON public.quizzes FOR SELECT
  USING (true);

CREATE POLICY "quizzes: mentor insert"
  ON public.quizzes FOR INSERT
  TO authenticated
  WITH CHECK (public.is_mentor());

CREATE POLICY "quizzes: mentor update"
  ON public.quizzes FOR UPDATE
  TO authenticated
  USING (public.is_mentor())
  WITH CHECK (public.is_mentor());

CREATE POLICY "quizzes: mentor delete"
  ON public.quizzes FOR DELETE
  TO authenticated
  USING (public.is_mentor());

-- =============================================================================
-- QUIZ_QUESTIONS
-- =============================================================================

CREATE POLICY "quiz_questions: public read"
  ON public.quiz_questions FOR SELECT
  USING (true);

CREATE POLICY "quiz_questions: mentor insert"
  ON public.quiz_questions FOR INSERT
  TO authenticated
  WITH CHECK (public.is_mentor());

CREATE POLICY "quiz_questions: mentor update"
  ON public.quiz_questions FOR UPDATE
  TO authenticated
  USING (public.is_mentor())
  WITH CHECK (public.is_mentor());

CREATE POLICY "quiz_questions: mentor delete"
  ON public.quiz_questions FOR DELETE
  TO authenticated
  USING (public.is_mentor());

-- =============================================================================
-- QUIZ_ATTEMPTS
-- =============================================================================

-- Students see own attempts; mentors see all
CREATE POLICY "quiz_attempts: read own or mentor sees all"
  ON public.quiz_attempts FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_mentor());

-- Students insert own attempt
CREATE POLICY "quiz_attempts: insert own"
  ON public.quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

-- =============================================================================
-- FORUM_POSTS
-- =============================================================================

-- All authenticated users can read forum posts
CREATE POLICY "forum_posts: authenticated read"
  ON public.forum_posts FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can create posts
CREATE POLICY "forum_posts: authenticated insert"
  ON public.forum_posts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can only update/delete their own posts; mentor can update/delete any
CREATE POLICY "forum_posts: update own or mentor"
  ON public.forum_posts FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR public.is_mentor())
  WITH CHECK (user_id = auth.uid() OR public.is_mentor());

CREATE POLICY "forum_posts: delete own or mentor"
  ON public.forum_posts FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() OR public.is_mentor());

-- =============================================================================
-- FORUM_REPLIES
-- =============================================================================

CREATE POLICY "forum_replies: authenticated read"
  ON public.forum_replies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "forum_replies: authenticated insert"
  ON public.forum_replies FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "forum_replies: update own or mentor"
  ON public.forum_replies FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR public.is_mentor())
  WITH CHECK (user_id = auth.uid() OR public.is_mentor());

CREATE POLICY "forum_replies: delete own or mentor"
  ON public.forum_replies FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() OR public.is_mentor());

-- =============================================================================
-- TRANSACTIONS
-- =============================================================================

-- Students see own; mentors see all
CREATE POLICY "transactions: read own or mentor sees all"
  ON public.transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_mentor());

-- Students insert own transaction (purchase flow)
CREATE POLICY "transactions: insert own"
  ON public.transactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Mentor can insert transactions (manual enrollment with payment)
CREATE POLICY "transactions: mentor insert"
  ON public.transactions FOR INSERT
  TO authenticated
  WITH CHECK (public.is_mentor());

-- Mentor can update transaction status (e.g., confirm payment)
CREATE POLICY "transactions: mentor update"
  ON public.transactions FOR UPDATE
  TO authenticated
  USING (public.is_mentor())
  WITH CHECK (public.is_mentor());
