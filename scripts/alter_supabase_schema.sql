-- =========================================================================
--        PUCHO SMS - IDEMPOTENT ALTER SCRIPT (SAFE TO RE-RUN)
-- =========================================================================
-- Run this in your Supabase SQL Editor after the base schema.
-- All statements use IF NOT EXISTS / DO blocks to avoid errors on re-run.
-- =========================================================================

-- ──────────────────────────────────────────────
-- 1. FIX noticed table: Ensure image_url is lowercase
-- ──────────────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'notices' AND column_name = 'Image_url'
  ) THEN
    ALTER TABLE public.notices RENAME COLUMN "Image_url" TO "image_url";
  END IF;
END $$;

-- Add image_url if it doesn't exist at all
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'notices' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE public.notices ADD COLUMN image_url TEXT;
  END IF;
END $$;

-- ──────────────────────────────────────────────
-- 2. STAFF table: Ensure all dashboard columns exist
-- ──────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'staff' AND column_name = 'profiles_id'
  ) THEN
    ALTER TABLE public.staff ADD COLUMN profiles_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'staff' AND column_name = 'qualification'
  ) THEN
    ALTER TABLE public.staff ADD COLUMN qualification TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'staff' AND column_name = 'experience'
  ) THEN
    ALTER TABLE public.staff ADD COLUMN experience TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'staff' AND column_name = 'designation'
  ) THEN
    ALTER TABLE public.staff ADD COLUMN designation TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'staff' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.staff ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'staff' AND column_name = 'department'
  ) THEN
    ALTER TABLE public.staff ADD COLUMN department TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'staff' AND column_name = 'joining_date'
  ) THEN
    ALTER TABLE public.staff ADD COLUMN joining_date DATE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'staff' AND column_name = 'mobile'
  ) THEN
    ALTER TABLE public.staff ADD COLUMN mobile TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'staff' AND column_name = 'class_assigned'
  ) THEN
    ALTER TABLE public.staff ADD COLUMN class_assigned TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'staff' AND column_name = 'division_assigned'
  ) THEN
    ALTER TABLE public.staff ADD COLUMN division_assigned TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'staff' AND column_name = 'hra'
  ) THEN
    ALTER TABLE public.staff ADD COLUMN hra FLOAT DEFAULT 0.0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'staff' AND column_name = 'conveyance'
  ) THEN
    ALTER TABLE public.staff ADD COLUMN conveyance FLOAT DEFAULT 0.0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'staff' AND column_name = 'special_allowance'
  ) THEN
    ALTER TABLE public.staff ADD COLUMN special_allowance FLOAT DEFAULT 0.0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'staff' AND column_name = 'bank_account_no'
  ) THEN
    ALTER TABLE public.staff ADD COLUMN bank_account_no TEXT;
  END IF;
END $$;

-- ──────────────────────────────────────────────
-- 3. FEES_PAYMENTS: Ensure additional columns exist
-- ──────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'fees_payments' AND column_name = 'student_name'
  ) THEN
    ALTER TABLE public.fees_payments ADD COLUMN student_name TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'fees_payments' AND column_name = 'parent_email'
  ) THEN
    ALTER TABLE public.fees_payments ADD COLUMN parent_email TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'fees_payments' AND column_name = 'month'
  ) THEN
    ALTER TABLE public.fees_payments ADD COLUMN month TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'fees_payments' AND column_name = 'due_date'
  ) THEN
    ALTER TABLE public.fees_payments ADD COLUMN due_date DATE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'fees_payments' AND column_name = 'payment_date'
  ) THEN
    ALTER TABLE public.fees_payments ADD COLUMN payment_date TIMESTAMPTZ;
  END IF;
END $$;

-- ──────────────────────────────────────────────
-- 4. ATTENDANCE: Ensure marked_by column
-- ──────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'attendance' AND column_name = 'marked_by'
  ) THEN
    ALTER TABLE public.attendance ADD COLUMN marked_by TEXT;
  END IF;
END $$;

-- ──────────────────────────────────────────────
-- 5. Ensure Missing Indexes (IF NOT EXISTS safe)
-- ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_students_section_id ON public.students(section_id);
CREATE INDEX IF NOT EXISTS idx_students_parent_id ON public.students(parent_id);
CREATE INDEX IF NOT EXISTS idx_students_admission_no ON public.students(admission_no);
CREATE INDEX IF NOT EXISTS idx_staff_profiles_id ON public.staff(profiles_id);
CREATE INDEX IF NOT EXISTS idx_staff_email ON public.staff(email);
CREATE INDEX IF NOT EXISTS idx_sections_class_id ON public.sections(class_id);
CREATE INDEX IF NOT EXISTS idx_results_exam_id ON public.results(exam_id);
CREATE INDEX IF NOT EXISTS idx_results_student_id ON public.results(student_id);
CREATE INDEX IF NOT EXISTS idx_results_subject_id ON public.results(subject_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON public.attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(date);
CREATE INDEX IF NOT EXISTS idx_fees_payments_student_id ON public.fees_payments(student_id);
CREATE INDEX IF NOT EXISTS idx_fees_payments_status ON public.fees_payments(status);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_event_id ON public.event_rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_parent_id ON public.event_rsvps(parent_id);
CREATE INDEX IF NOT EXISTS idx_payslips_employee_id ON public.payslips(employee_id);
CREATE INDEX IF NOT EXISTS idx_payslips_month ON public.payslips(month);
CREATE INDEX IF NOT EXISTS idx_exams_class_id ON public.exams(class_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_class ON public.quizzes(class);
CREATE INDEX IF NOT EXISTS idx_homework_class_grade ON public.homework(class_grade);
CREATE INDEX IF NOT EXISTS idx_notices_audience ON public.notices(audience);
CREATE INDEX IF NOT EXISTS idx_notices_date ON public.notices(date);
CREATE INDEX IF NOT EXISTS idx_admissions_status ON public.admissions(status);
CREATE INDEX IF NOT EXISTS idx_leaves_user_id ON public.leaves(user_id);
CREATE INDEX IF NOT EXISTS idx_leaves_status ON public.leaves(status);
CREATE INDEX IF NOT EXISTS idx_results_exam_type ON public.results(exam_type);

-- =========================================================================
-- DONE. All ALTER operations are idempotent — safe to re-run anytime.
-- =========================================================================
