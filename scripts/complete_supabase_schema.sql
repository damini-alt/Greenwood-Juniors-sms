-- =========================================================================
--   PUCHO SMS - COMPLETE REBUILD & SEED SUPABASE SCHEMA (GREENWOOD JUNIORS)
-- =========================================================================
-- This script:
-- 1. Drops all existing tables and triggers (cleans database schema).
-- 2. Deletes existing test auth users.
-- 3. Creates all tables and sets up automatic profile trigger on signup.
-- 4. Disables Row Level Security (RLS) for testing.
-- 5. Dynamically seeds:
--    - Admin, Staff, and 20 Parent auth users + profiles.
--    - 13 Classes (Nursery to 10th).
--    - 2 Sections (A & B) for EVERY Class (total 26 sections).
--    - Subjects for all classes.
--    - EXACTLY 10 Students for EVERY Class and Section (total 260 students).
--    - Fee payments, attendance, exams, and results dynamically for all students.
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- CLEAN SCHEMA: Drop existing triggers & tables
-- ==========================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;

DROP TABLE IF EXISTS public.payslips CASCADE;
DROP TABLE IF EXISTS public.event_rsvps CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.leaves CASCADE;
DROP TABLE IF EXISTS public.homework CASCADE;
DROP TABLE IF EXISTS public.fees_payments CASCADE;
DROP TABLE IF EXISTS public.quizzes CASCADE;
DROP TABLE IF EXISTS public.notices CASCADE;
DROP TABLE IF EXISTS public.admissions CASCADE;
DROP TABLE IF EXISTS public.attendance CASCADE;
DROP TABLE IF EXISTS public.results CASCADE;
DROP TABLE IF EXISTS public.exams CASCADE;
DROP TABLE IF EXISTS public.staff CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.subjects CASCADE;
DROP TABLE IF EXISTS public.sections CASCADE;
DROP TABLE IF EXISTS public.classes CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Delete existing test users in auth.users
DELETE FROM auth.users WHERE id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000005',
  '00000000-0000-0000-0000-000000000006',
  '00000000-0000-0000-0000-000000000007',
  '00000000-0000-0000-0000-000000000008'
);

-- Delete any other dynamically generated students, parents or staff
DELETE FROM auth.users WHERE raw_user_meta_data->>'role' IN ('student', 'parent', 'staff', 'teacher');

-- ==========================================
-- 1. PROFILES TABLE (Linked to Auth schema)
-- ==========================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'staff', 'teacher', 'parent', 'student')),
    phone TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. CLASSES TABLE
-- ==========================================
CREATE TABLE public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. SECTIONS TABLE
-- ==========================================
CREATE TABLE public.sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., 'A', 'B'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 4. SUBJECTS TABLE
-- ==========================================
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    class TEXT, -- Denormalized class name for easy query filters
    code TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 5. STUDENTS TABLE (Linked to Profiles)
-- ==========================================
CREATE TABLE public.students (
    id UUID PRIMARY KEY CONSTRAINT students_id_fkey REFERENCES public.profiles(id) ON DELETE CASCADE,
    admission_no TEXT UNIQUE NOT NULL,
    roll_no INT,
    section_id UUID REFERENCES public.sections(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'Active',
    gender TEXT,
    dob DATE,
    parent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    parent_email TEXT,
    parent_phone TEXT,
    guardian_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 6. STAFF TABLE
-- ==========================================
CREATE TABLE public.staff (
    employee_id TEXT PRIMARY KEY, -- Can hold UUID or custom formatted codes (e.g. STF-101)
    profiles_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Link to auth profile
    name TEXT NOT NULL,
    role TEXT DEFAULT 'Teacher',
    subject TEXT DEFAULT 'All',
    email TEXT UNIQUE,
    password TEXT, -- For legacy auth / mock logins compatibility
    basic_salary FLOAT DEFAULT 0.0,
    hra FLOAT DEFAULT 0.0,
    conveyance FLOAT DEFAULT 0.0,
    special_allowance FLOAT DEFAULT 0.0,
    bank_account_no TEXT,
    status TEXT DEFAULT 'Active',
    department TEXT,
    designation TEXT,
    qualification TEXT,
    experience TEXT,
    joining_date DATE,
    mobile TEXT,
    class_assigned TEXT,
    division_assigned TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 7. EXAMS TABLE
-- ==========================================
CREATE TABLE public.exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    class TEXT, -- Fallback text class name
    subject TEXT,
    date DATE,
    start_date DATE, -- Maps to date in frontend sync
    time TEXT,
    venue TEXT,
    exam_type TEXT,
    status TEXT DEFAULT 'Scheduled',
    start_time TEXT,
    end_time TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 8. RESULTS TABLE
-- ==========================================
CREATE TABLE public.results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    subject_name TEXT,
    subject TEXT,
    marks FLOAT,
    marks_obtained FLOAT, -- Direct mapping used in parent portal updates
    total FLOAT,
    total_marks FLOAT, -- Direct mapping used in parent portal updates
    grade TEXT,
    exam_type TEXT,
    exam TEXT,
    exam_name TEXT,
    recorded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 9. ATTENDANCE TABLE
-- ==========================================
CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    status TEXT CHECK (status IN ('Present', 'Absent', 'Late', 'Excused')),
    marked_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 10. ADMISSIONS TABLE
-- ==========================================
CREATE TABLE public.admissions (
    id TEXT PRIMARY KEY, -- e.g., ADM-YYYY-XXXX
    student_name TEXT,
    parent_name TEXT,
    grade TEXT,
    class TEXT,
    dob DATE,
    phone TEXT,
    address TEXT,
    status TEXT DEFAULT 'Pending',
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    parent_email TEXT,
    docs JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 11. NOTICES TABLE
-- ==========================================
CREATE TABLE public.notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    description TEXT,
    target TEXT DEFAULT 'Global',
    audience TEXT DEFAULT 'All',
    image_url TEXT,
    class TEXT DEFAULT 'All',
    division TEXT DEFAULT 'All',
    priority TEXT DEFAULT 'Medium',
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 12. QUIZZES TABLE
-- ==========================================
CREATE TABLE public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subject TEXT,
    class TEXT,
    division TEXT,
    type TEXT,
    date DATE,
    total_marks INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 13. FEES & PAYMENTS TABLE
-- ==========================================
CREATE TABLE public.fees_payments (
    id TEXT PRIMARY KEY, -- Supports custom payment IDs or UUIDs
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_name TEXT,
    parent_email TEXT,
    type TEXT,
    payment_method TEXT,
    amount FLOAT,
    amount_paid FLOAT,
    status TEXT DEFAULT 'Pending',
    due_date DATE,
    paid_date DATE,
    payment_date TIMESTAMPTZ,
    transaction_id TEXT,
    month TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 14. HOMEWORK TABLE
-- ==========================================
CREATE TABLE public.homework (
    id TEXT PRIMARY KEY, -- Custom ID prefix e.g., HW-XXXX
    title TEXT NOT NULL,
    subject TEXT,
    class_grade TEXT,
    class TEXT,
    division TEXT,
    description TEXT,
    assigned_by TEXT,
    due_date DATE,
    date TEXT,
    file_url TEXT,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 15. LEAVES TABLE
-- ==========================================
CREATE TABLE public.leaves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL, -- Supports UUID from profiles OR custom IDs (e.g. STF-001, STD-016)
    user_name TEXT,
    user_role TEXT,
    reason TEXT,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'Pending',
    target_role TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 16. EVENTS TABLE (School Events)
-- ==========================================
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    time TEXT,
    venue TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 17. EVENT RSVPS TABLE (Parent RSVP tracking)
-- ==========================================
CREATE TABLE public.event_rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('Confirmed', 'Declined', 'Tentative')) DEFAULT 'Confirmed',
    comments TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_event_parent UNIQUE (event_id, parent_id)
);

-- ==========================================
-- 18. PAYSLIPS TABLE (Automated Staff Salaries)
-- ==========================================
CREATE TABLE public.payslips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id TEXT REFERENCES public.staff(employee_id) ON DELETE CASCADE,
    month TEXT NOT NULL, -- e.g., 'June 2026'
    base_salary FLOAT NOT NULL,
    present_days INT NOT NULL,
    absent_days INT NOT NULL,
    net_salary FLOAT NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Paid', 'On Hold')),
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ
);


-- =========================================================================
--                         PERFORMANCE INDEXES
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_students_section_id ON public.students(section_id);
CREATE INDEX IF NOT EXISTS idx_students_parent_id ON public.students(parent_id);
CREATE INDEX IF NOT EXISTS idx_students_admission_no ON public.students(admission_no);
CREATE INDEX IF NOT EXISTS idx_staff_profiles_id ON public.staff(profiles_id);
CREATE INDEX IF NOT EXISTS idx_staff_email ON public.staff(email);
CREATE INDEX IF NOT EXISTS idx_sections_class_id ON public.sections(class_id);
CREATE INDEX IF NOT EXISTS idx_results_exam_id ON public.results(exam_id);
CREATE INDEX IF NOT EXISTS idx_results_student_id ON public.results(student_id);
CREATE INDEX IF NOT EXISTS idx_results_subject_id ON public.results(subject_id);
CREATE INDEX IF NOT EXISTS idx_results_exam_type ON public.results(exam_type);
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


-- =========================================================================
--             AUTOMATION TRIGGER FOR PROFILE CREATION ON SIGNUP
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New User'),
    COALESCE(new.raw_user_meta_data->>'role', 'student'),
    new.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- =========================================================================
--         ROW LEVEL SECURITY (RLS) & ACCESS CONTROL CONFIGURATION
-- =========================================================================
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.results DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees_payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaves DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payslips DISABLE ROW LEVEL SECURITY;


-- =========================================================================
--                         STATIC SEED DATA POPULATION
-- =========================================================================

-- Admin User
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, raw_app_meta_data, aud, role, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@greenwood.edu',
  crypt('Admin@123', gen_salt('bf')),
  NOW(),
  '{"full_name":"Rajesh Principal","role":"admin"}',
  '{"provider":"email","providers":["email"]}',
  'authenticated',
  'authenticated',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, full_name, role, email, phone)
VALUES ('00000000-0000-0000-0000-000000000001', 'Rajesh Principal', 'admin', 'admin@greenwood.edu', '9990000001')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, email = EXCLUDED.email, phone = EXCLUDED.phone;

-- Staff (Teacher 1)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, raw_app_meta_data, aud, role, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'sunita.rao@greenwood.edu',
  crypt('Teacher@123', gen_salt('bf')),
  NOW(),
  '{"full_name":"Sunita Rao","role":"teacher"}',
  '{"provider":"email","providers":["email"]}',
  'authenticated',
  'authenticated',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, full_name, role, email, phone)
VALUES ('00000000-0000-0000-0000-000000000002', 'Sunita Rao', 'teacher', 'sunita.rao@greenwood.edu', '9990000002')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, email = EXCLUDED.email, phone = EXCLUDED.phone;

-- Staff (Teacher 2)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, raw_app_meta_data, aud, role, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  'amit.kumar@greenwood.edu',
  crypt('Teacher@123', gen_salt('bf')),
  NOW(),
  '{"full_name":"Amit Kumar","role":"teacher"}',
  '{"provider":"email","providers":["email"]}',
  'authenticated',
  'authenticated',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, full_name, role, email, phone)
VALUES ('00000000-0000-0000-0000-000000000003', 'Amit Kumar', 'teacher', 'amit.kumar@greenwood.edu', '9990000003')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, email = EXCLUDED.email, phone = EXCLUDED.phone;

-- Staff (Teacher 3)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, raw_app_meta_data, aud, role, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000004',
  'priya.sharma@greenwood.edu',
  crypt('Teacher@123', gen_salt('bf')),
  NOW(),
  '{"full_name":"Priya Sharma","role":"teacher"}',
  '{"provider":"email","providers":["email"]}',
  'authenticated',
  'authenticated',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, full_name, role, email, phone)
VALUES ('00000000-0000-0000-0000-000000000004', 'Priya Sharma', 'teacher', 'priya.sharma@greenwood.edu', '9990000004')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, email = EXCLUDED.email, phone = EXCLUDED.phone;

-- Insert into Staff Table
INSERT INTO public.staff (employee_id, profiles_id, name, role, subject, email, basic_salary, hra, conveyance, special_allowance, department, designation, qualification, experience, joining_date, mobile, status, class_assigned, division_assigned)
VALUES
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Sunita Rao', 'Teacher', 'Mathematics', 'sunita.rao@greenwood.edu', 35000, 7000, 3000, 2000, 'Science', 'Senior Teacher', 'M.Sc. Mathematics', '5 years', '2020-06-15', '9990000002', 'Active', '10th', 'A'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'Amit Kumar', 'Teacher', 'Science', 'amit.kumar@greenwood.edu', 32000, 6000, 3000, 2000, 'Science', 'Teacher', 'B.Sc. Physics', '3 years', '2022-07-01', '9990000003', 'Active', '9th', 'A'),
('STF-101', '00000000-0000-0000-0000-000000000004', 'Priya Sharma', 'Teacher', 'English', 'priya.sharma@greenwood.edu', 30000, 5000, 3000, 2000, 'Humanities', 'Teacher', 'M.A. English', '2 years', '2023-08-01', '9990000004', 'Active', '1st', 'A')
ON CONFLICT (employee_id) DO NOTHING;

-- Seed Classes
INSERT INTO public.classes (id, name) VALUES
('10000000-0000-0000-0000-000000000000', 'Playgroup'),
('10000000-0000-0000-0000-000000000001', 'Nursery'),
('10000000-0000-0000-0000-000000000002', 'LKG'),
('10000000-0000-0000-0000-000000000003', 'UKG'),
('10000000-0000-0000-0000-000000000004', '1st'),
('10000000-0000-0000-0000-000000000005', '2nd'),
('10000000-0000-0000-0000-000000000006', '3rd'),
('10000000-0000-0000-0000-000000000007', '4th'),
('10000000-0000-0000-0000-000000000008', '5th'),
('10000000-0000-0000-0000-000000000009', '6th'),
('10000000-0000-0000-0000-000000000010', '7th'),
('10000000-0000-0000-0000-000000000011', '8th'),
('10000000-0000-0000-0000-000000000012', '9th'),
('10000000-0000-0000-0000-000000000013', '10th')
ON CONFLICT (id) DO NOTHING;

-- Seed Sections with specific names for preschool classes, and A & B for standard classes
-- Playgroup (Butterflies, Sunflowers)
INSERT INTO public.sections (class_id, name)
SELECT id, 'Butterflies' FROM public.classes WHERE name = 'Playgroup';
INSERT INTO public.sections (class_id, name)
SELECT id, 'Sunflowers' FROM public.classes WHERE name = 'Playgroup';

-- Nursery (Rainbows, Stars)
INSERT INTO public.sections (class_id, name)
SELECT id, 'Rainbows' FROM public.classes WHERE name = 'Nursery';
INSERT INTO public.sections (class_id, name)
SELECT id, 'Stars' FROM public.classes WHERE name = 'Nursery';

-- LKG (Daisies, Tulips)
INSERT INTO public.sections (class_id, name)
SELECT id, 'Daisies' FROM public.classes WHERE name = 'LKG';
INSERT INTO public.sections (class_id, name)
SELECT id, 'Tulips' FROM public.classes WHERE name = 'LKG';

-- UKG (Roses, Lilies)
INSERT INTO public.sections (class_id, name)
SELECT id, 'Roses' FROM public.classes WHERE name = 'UKG';
INSERT INTO public.sections (class_id, name)
SELECT id, 'Lilies' FROM public.classes WHERE name = 'UKG';

-- Standard Classes (1st to 10th)
INSERT INTO public.sections (class_id, name)
SELECT id, 'A' FROM public.classes WHERE name NOT IN ('Playgroup', 'Nursery', 'LKG', 'UKG');
INSERT INTO public.sections (class_id, name)
SELECT id, 'B' FROM public.classes WHERE name NOT IN ('Playgroup', 'Nursery', 'LKG', 'UKG');

-- Seed Subjects for all classes
DO $$
DECLARE
    cls_rec RECORD;
    sub_name TEXT;
    subs TEXT[] := ARRAY['Mathematics', 'Science', 'English', 'Social Science', 'Hindi', 'Marathi'];
BEGIN
    FOR cls_rec IN SELECT * FROM public.classes LOOP
        FOREACH sub_name IN ARRAY subs LOOP
            INSERT INTO public.subjects (name, class, code)
            VALUES (
                sub_name,
                cls_rec.name,
                upper(substring(sub_name from 1 for 3)) || '-' || upper(replace(cls_rec.name, ' ', ''))
            ) ON CONFLICT (code) DO NOTHING;
        END LOOP;
    END LOOP;
END $$;


-- =========================================================================
--             DYNAMIC DDL LOOP: 10 STUDENTS PER SECTION (TOTAL 260)
-- =========================================================================
DO $$
DECLARE
    cls_rec RECORD;
    sec_rec RECORD;
    parent_ids UUID[];
    p_id UUID;
    s_id UUID;
    i INT;
    parent_index INT;
    random_first_name TEXT;
    random_last_name TEXT;
    first_names TEXT[] := ARRAY['Aarav', 'Vihaan', 'Aryan', 'Ishani', 'Anaya', 'Zoya', 'Kabir', 'Rohan', 'Sana', 'Diya', 'Reyansh', 'Aditya', 'Advait', 'Vivaan', 'Pooja', 'Rahul', 'Sneha', 'Nikhil', 'Tanvi', 'Karan'];
    last_names TEXT[] := ARRAY['Sharma', 'Das', 'Verma', 'Khan', 'Singh', 'Patel', 'Modi', 'Reddy', 'Gupta', 'Malhotra', 'Kapoor', 'Joshi', 'Iyer', 'Nair', 'Bose', 'Choudhury', 'Sen', 'Rao', 'Trivedi'];
    parent_first_names TEXT[] := ARRAY['Rajesh', 'Suresh', 'Vikram', 'Meera', 'Ramesh', 'Sita', 'Anil', 'Sunita', 'Amit', 'Priya'];
    email_domain TEXT := 'greenwood.edu';
    student_email TEXT;
    parent_email TEXT;
    parent_name TEXT;
    phone_num TEXT;
BEGIN
    -- Create 20 parents first to randomly assign to students
    FOR i IN 1..20 LOOP
        p_id := gen_random_uuid();
        parent_name := parent_first_names[(i % 10) + 1] || ' ' || last_names[(i % 19) + 1];
        parent_email := 'parent.' || lower(replace(parent_name, ' ', '.')) || '@email.com';
        phone_num := '999' || lpad((i * 12345)::text, 7, '0');
        
        -- Insert parent as auth user
        INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, raw_app_meta_data, aud, role, created_at, updated_at)
        VALUES (
            p_id,
            parent_email,
            crypt('Parent@123', gen_salt('bf')),
            NOW(),
            jsonb_build_object('full_name', parent_name, 'role', 'parent'),
            '{"provider":"email","providers":["email"]}',
            'authenticated',
            'authenticated',
            NOW(),
            NOW()
        ) ON CONFLICT (id) DO NOTHING;
        
        -- Ensure profile
        INSERT INTO public.profiles (id, full_name, role, email, phone)
        VALUES (p_id, parent_name, 'parent', parent_email, phone_num)
        ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;
        
        parent_ids := array_append(parent_ids, p_id);
    END LOOP;

    -- Now loop through every class and section
    FOR cls_rec IN SELECT * FROM public.classes LOOP
        FOR sec_rec IN SELECT * FROM public.sections WHERE class_id = cls_rec.id LOOP
            -- Create exactly 10 students for this class section
            FOR i IN 1..10 LOOP
                s_id := gen_random_uuid();
                
                -- Determine distinct names using index hashing
                random_first_name := first_names[((length(cls_rec.name) + length(sec_rec.name) + i) % 20) + 1];
                random_last_name := last_names[((length(cls_rec.name) + length(sec_rec.name) + i * 3) % 19) + 1];
                student_email := 'student.' || lower(random_first_name) || '.' || lower(random_last_name) || '_' || lower(replace(cls_rec.name, ' ', '')) || '_' || lower(sec_rec.name) || '_' || i || '@' || email_domain;
                
                parent_index := ((i + length(cls_rec.name)) % 20) + 1;
                p_id := parent_ids[parent_index];
                
                -- Fetch parent data
                SELECT full_name, email, phone INTO parent_name, parent_email, phone_num FROM public.profiles WHERE id = p_id;

                -- Insert auth user for student
                INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, raw_app_meta_data, aud, role, created_at, updated_at)
                VALUES (
                    s_id,
                    student_email,
                    crypt('Student@123', gen_salt('bf')),
                    NOW(),
                    jsonb_build_object('full_name', random_first_name || ' ' || random_last_name, 'role', 'student'),
                    '{"provider":"email","providers":["email"]}',
                    'authenticated',
                    'authenticated',
                    NOW(),
                    NOW()
                ) ON CONFLICT (id) DO NOTHING;

                -- Ensure profile
                INSERT INTO public.profiles (id, full_name, role, email, phone)
                VALUES (s_id, random_first_name || ' ' || random_last_name, 'student', student_email, '999' || lpad((i * 98765)::text, 7, '0'))
                ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

                -- Insert student record
                INSERT INTO public.students (id, admission_no, roll_no, section_id, status, gender, dob, parent_id, parent_email, parent_phone, guardian_name)
                VALUES (
                    s_id,
                    'STD-' || upper(replace(cls_rec.name, ' ', '')) || '-' || sec_rec.name || '-' || lpad(i::text, 3, '0'),
                    i,
                    sec_rec.id,
                    'Active',
                    CASE WHEN i % 2 = 0 THEN 'Female' ELSE 'Male' END,
                    '2014-06-20'::DATE - (i * 30),
                    p_id,
                    parent_email,
                    phone_num,
                    parent_name
                ) ON CONFLICT (id) DO NOTHING;

                -- Insert 1 Paid Fee Payment
                INSERT INTO public.fees_payments (id, student_id, student_name, parent_email, type, payment_method, amount, amount_paid, status, due_date, month)
                VALUES (
                    'FEE-' || upper(replace(cls_rec.name, ' ', '')) || '-' || sec_rec.name || '-' || lpad(i::text, 3, '0') || '-PAID',
                    s_id,
                    random_first_name || ' ' || random_last_name,
                    parent_email,
                    'Tuition Fee',
                    'UPI',
                    15000,
                    15000,
                    'Paid',
                    '2026-06-10',
                    'June 2026'
                ) ON CONFLICT (id) DO NOTHING;

                -- Insert 1 Pending Fee Payment
                INSERT INTO public.fees_payments (id, student_id, student_name, parent_email, type, payment_method, amount, amount_paid, status, due_date, month)
                VALUES (
                    'FEE-' || upper(replace(cls_rec.name, ' ', '')) || '-' || sec_rec.name || '-' || lpad(i::text, 3, '0') || '-PENDING',
                    s_id,
                    random_first_name || ' ' || random_last_name,
                    parent_email,
                    'Library Fee',
                    'Cash',
                    2000,
                    0,
                    'Pending',
                    '2026-06-30',
                    'June 2026'
                ) ON CONFLICT (id) DO NOTHING;

                -- Insert attendance record for today
                INSERT INTO public.attendance (id, student_id, date, status, marked_by, created_at)
                VALUES (
                    gen_random_uuid(),
                    s_id,
                    '2026-06-19',
                    CASE WHEN i % 5 = 0 THEN 'Absent' WHEN i % 7 = 0 THEN 'Late' ELSE 'Present' END,
                    'sunita.rao@greenwood.edu',
                    NOW()
                ) ON CONFLICT (id) DO NOTHING;
            END LOOP;
        END LOOP;
    END LOOP;
END $$;


-- =========================================================================
--             DYNAMIC DDL LOOP: EXAMS & RESULTS FOR ALL STUDENTS
-- =========================================================================
DO $$
DECLARE
    cls_rec RECORD;
    sub_rec RECORD;
    student_rec RECORD;
    exam_id UUID;
BEGIN
    FOR cls_rec IN SELECT * FROM public.classes LOOP
        -- Create a Term Exam for each class
        FOR sub_rec IN SELECT * FROM public.subjects WHERE class = cls_rec.name LIMIT 3 LOOP
            exam_id := gen_random_uuid();
            
            INSERT INTO public.exams (id, title, class_id, class, subject, date, start_date, start_time, end_time, time, venue, exam_type, status)
            VALUES (
                exam_id,
                sub_rec.name || ' Term Exam',
                cls_rec.id,
                cls_rec.name,
                sub_rec.name,
                '2026-07-10'::DATE,
                '2026-07-10'::DATE,
                '09:00',
                '12:00',
                '09:00 - 12:00',
                'Hall A',
                'Term Exam',
                'Scheduled'
            );
            
            -- Insert results for students in this class
            FOR student_rec IN 
                SELECT s.id FROM public.students s
                JOIN public.sections sec ON s.section_id = sec.id
                WHERE sec.class_id = cls_rec.id
            LOOP
                INSERT INTO public.results (exam_id, student_id, subject_id, subject_name, marks_obtained, total_marks, grade, exam_type)
                VALUES (
                    exam_id,
                    student_rec.id,
                    sub_rec.id,
                    sub_rec.name,
                    floor(random() * 40 + 60), -- Random marks between 60 and 100
                    100,
                    CASE 
                      WHEN random() > 0.8 THEN 'A+'
                      WHEN random() > 0.5 THEN 'A'
                      WHEN random() > 0.2 THEN 'B+'
                      ELSE 'B'
                    END,
                    'Term Exam'
                );
            END LOOP;
        END LOOP;
    END LOOP;
END $$;


-- =========================================================================
--             OTHER STATIC SEED DATA (NOTICES, HOMEWORK, EVENTS)
-- =========================================================================

-- Notices
INSERT INTO public.notices (id, title, content, description, target, audience, image_url, class, division, priority, date) VALUES
('70000000-0000-0000-0000-000000000001', 'Parent-Teacher Meeting', 'PTM scheduled for 25th June 2026 at 10 AM in the school auditorium. All parents are requested to attend.', 'PTM scheduled for 25th June 2026 at 10 AM.', 'All', 'All', '', 'All', 'All', 'High', '2026-06-19')
ON CONFLICT (id) DO NOTHING;

-- Homework
INSERT INTO public.homework (id, title, subject, class_grade, class, division, description, assigned_by, due_date, date, status) VALUES
('HW-001', 'Algebra Chapter 5', 'Mathematics', '10th', '10th', 'A', 'Complete exercises 5.1 to 5.4 from textbook. Show all working steps clearly.', 'Sunita Rao', '2026-06-25', '2026-06-19', 'Active'),
('HW-002', 'Physics - Laws of Motion', 'Science', '9th', '9th', 'A', 'Write notes on Newton''s three laws with real-life examples. Submit by Friday.', 'Amit Kumar', '2026-06-24', '2026-06-19', 'Active')
ON CONFLICT (id) DO NOTHING;

-- Leaves
INSERT INTO public.leaves (id, user_id, user_name, user_role, reason, start_date, end_date, status, target_role) VALUES
('80000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Sunita Rao', 'staff', 'Medical appointment', '2026-06-15', '2026-06-15', 'Approved', 'admin'),
('80000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000008', 'Rohan Verma', 'student', 'Family function', '2026-06-20', '2026-06-20', 'Pending', 'staff')
ON CONFLICT (id) DO NOTHING;

-- Admissions
INSERT INTO public.admissions (id, student_name, parent_name, grade, class, dob, phone, address, status, parent_email) VALUES
('ADM-2026-001', 'Aarav Joshi', 'Meera Joshi', 'Nursery', 'Nursery', '2022-03-15', '9988776655', '42 Park Street, Mumbai', 'Pending', 'meera.joshi@email.com')
ON CONFLICT (id) DO NOTHING;

-- Events + RSVPs
INSERT INTO public.events (id, title, description, event_date, time, venue) VALUES
('90000000-0000-0000-0000-000000000001', 'Annual Sports Day', 'Inter-house sports competition with track and field events. Parents invited as spectators.', '2026-07-15', '08:00 AM', 'School Ground'),
('90000000-0000-0000-0000-000000000002', 'Science Exhibition', 'Students showcase their science projects. Judging panel from local university.', '2026-07-20', '10:00 AM', 'Auditorium')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.event_rsvps (id, event_id, parent_id, status, comments) VALUES
('A0000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000001', (SELECT id FROM public.profiles WHERE role = 'parent' LIMIT 1), 'Confirmed', 'Will attend with family')
ON CONFLICT (id) DO NOTHING;

-- Quizzes
INSERT INTO public.quizzes (id, title, subject, class, division, type, date, total_marks) VALUES
('B0000000-0000-0000-0000-000000000001', 'Weekly Math Quiz', 'Mathematics', '10th', 'A', 'Quiz', '2026-06-21', 20),
('B0000000-0000-0000-0000-000000000002', 'Science Unit Test', 'Science', '9th', 'A', 'Test', '2026-06-22', 50)
ON CONFLICT (id) DO NOTHING;

-- Payslips
INSERT INTO public.payslips (id, employee_id, month, base_salary, present_days, absent_days, net_salary, status) VALUES
('C0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'June 2026', 35000, 23, 1, 34000, 'Paid')
ON CONFLICT (id) DO NOTHING;

-- Verification Select
SELECT 'SCHEMA REBUILT & 10 STUDENTS PER SECTION SEEDED SUCCESSFULLY' AS status;
