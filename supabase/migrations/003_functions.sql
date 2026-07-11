-- =============================================================================
-- LMS Apoteker Rahmato / Farma Masterclass
-- Migration 003: Helper RPC Functions
-- =============================================================================

-- ---------------------------------------------------------------------------
-- increment_students_count
-- Called from api.ts purchaseClass() and addStudentManual() to atomically
-- increment the students_count on a class row. Using a function avoids the
-- read-modify-write race condition of doing SELECT + UPDATE on the client.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.increment_students_count(class_id_input text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.classes
  SET students_count = students_count + 1
  WHERE id = class_id_input;
$$;

-- Grant execute to authenticated users (called during purchase flow)
GRANT EXECUTE ON FUNCTION public.increment_students_count(text) TO authenticated;

-- ---------------------------------------------------------------------------
-- decrement_students_count (for future refund / unenroll flows)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.decrement_students_count(class_id_input text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.classes
  SET students_count = GREATEST(students_count - 1, 0)
  WHERE id = class_id_input;
$$;

GRANT EXECUTE ON FUNCTION public.decrement_students_count(text) TO authenticated;
