-- =============================================================================
-- LMS Apoteker Rahmato / Farma Masterclass
-- Migration 001: Full Schema
-- =============================================================================

-- ---------------------------------------------------------------------------
-- profiles (extends auth.users)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name         text NOT NULL DEFAULT '',
  email        text NOT NULL DEFAULT '',
  role         text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'mentor')),
  avatar_url   text,
  profession   text CHECK (
    profession IN ('Apoteker', 'Dokter', 'Mahasiswa', 'Perawat', 'Bidan', 'Lainnya')
  ),
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- generations
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.generations (
  id     text PRIMARY KEY,
  name   text NOT NULL,
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('active', 'completed', 'upcoming')),
  year   text NOT NULL
);

-- ---------------------------------------------------------------------------
-- classes
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.classes (
  id               text PRIMARY KEY,
  generation_id    text NOT NULL REFERENCES public.generations(id) ON DELETE CASCADE,
  generation_name  text NOT NULL,
  name             text NOT NULL,
  category         text NOT NULL CHECK (category IN ('REGULER', 'ADVANCE')),
  price            int  NOT NULL DEFAULT 0,
  description      text NOT NULL DEFAULT '',
  materials_count  int  NOT NULL DEFAULT 5,
  students_count   int  NOT NULL DEFAULT 0,
  playlist_url     text
);

-- ---------------------------------------------------------------------------
-- enrollments
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.enrollments (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_id    text        NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  completed   boolean     NOT NULL DEFAULT false,
  UNIQUE (user_id, class_id)
);

-- ---------------------------------------------------------------------------
-- materials
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.materials (
  id               text PRIMARY KEY,
  class_id         text NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  title            text NOT NULL,
  type             text NOT NULL CHECK (type IN ('video', 'pdf', 'quiz')),
  description      text NOT NULL DEFAULT '',
  duration_or_pages text NOT NULL DEFAULT '',
  content          text NOT NULL DEFAULT '',
  video_url        text,
  youtube_id       text,
  order_index      int  NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------------
-- quizzes
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quizzes (
  id            text PRIMARY KEY,
  class_id      text NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  title         text NOT NULL,
  passing_score int  NOT NULL DEFAULT 75
);

-- ---------------------------------------------------------------------------
-- quiz_questions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id             text    PRIMARY KEY,
  quiz_id        text    NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question       text    NOT NULL,
  options        jsonb   NOT NULL DEFAULT '[]',
  correct_option int     NOT NULL,
  explanation    text    NOT NULL DEFAULT '',
  order_index    int     NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------------
-- quiz_attempts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quiz_id      text        NOT NULL,
  class_id     text        NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  score        int         NOT NULL,
  passed       boolean     NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- forum_posts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id   text        NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  user_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title      text        NOT NULL,
  content    text        NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- forum_replies
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.forum_replies (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    uuid        NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content    text        NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- transactions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transactions (
  id             text        PRIMARY KEY,
  user_id        uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_id       text        NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  amount         int         NOT NULL DEFAULT 0,
  status         text        NOT NULL DEFAULT 'success' CHECK (status IN ('pending', 'success', 'failed')),
  payment_method text        NOT NULL DEFAULT '',
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Indexes for common query patterns
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id    ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_class_id   ON public.enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_materials_class_id     ON public.materials(class_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON public.quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student  ON public.quiz_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_class    ON public.quiz_attempts(class_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_class_id   ON public.forum_posts(class_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_post_id  ON public.forum_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id   ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_classes_generation_id  ON public.classes(generation_id);

-- ---------------------------------------------------------------------------
-- Trigger: auto-create profile row on auth.users insert
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, avatar_url, profession)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL),
    COALESCE(NEW.raw_user_meta_data->>'profession', 'Lainnya')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
