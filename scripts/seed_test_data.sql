-- =========================================================================
--    PUCHO SMS - SEED DATA FOR WORKFLOW TESTING (Supabase SQL Editor)
-- =========================================================================
-- Run this after the base schema + alter script.
-- Creates auth users + test data to trigger all 11 workflows.
-- =========================================================================

-- Enable uuid-ossp for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════
-- STEP 1: CREATE AUTH USERS
-- ═══════════════════════════════════════════════
-- NOTE: Run these one-by-one in SQL Editor.
-- The handle_new_user() trigger will auto-create profiles.
-- If this fails, use the Supabase Dashboard > Authentication > Add User.

-- Admin
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@greenwood.edu',
  crypt('Admin@123', gen_salt('bf')),
  NOW(),
  '{"full_name":"Rajesh Principal","role":"admin"}'
) ON CONFLICT (id) DO NOTHING;

-- Staff (Teacher 1)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'sunita.rao@greenwood.edu',
  crypt('Teacher@123', gen_salt('bf')),
  NOW(),
  '{"full_name":"Sunita Rao","role":"teacher"}'
) ON CONFLICT (id) DO NOTHING;

-- Staff (Teacher 2)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  'amit.kumar@greenwood.edu',
  crypt('Teacher@123', gen_salt('bf')),
  NOW(),
  '{"full_name":"Amit Kumar","role":"teacher"}'
) ON CONFLICT (id) DO NOTHING;

-- Staff (new onboard candidate)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES (
  '00000000-0000-0000-0000-000000000004',
  'priya.sharma@greenwood.edu',
  crypt('Teacher@123', gen_salt('bf')),
  NOW(),
  '{"full_name":"Priya Sharma","role":"teacher"}'
) ON CONFLICT (id) DO NOTHING;

-- Parent 1
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES (
  '00000000-0000-0000-0000-000000000005',
  'parent.anaya@email.com',
  crypt('Parent@123', gen_salt('bf')),
  NOW(),
  '{"full_name":"Ramesh Sharma","role":"parent"}'
) ON CONFLICT (id) DO NOTHING;

-- Parent 2
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES (
  '00000000-0000-0000-0000-000000000006',
  'parent.rohan@email.com',
  crypt('Parent@123', gen_salt('bf')),
  NOW(),
  '{"full_name":"Sita Verma","role":"parent"}'
) ON CONFLICT (id) DO NOTHING;

-- Student 1
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES (
  '00000000-0000-0000-0000-000000000007',
  'student.anaya@greenwood.edu',
  crypt('Student@123', gen_salt('bf')),
  NOW(),
  '{"full_name":"Anaya Sharma","role":"student"}'
) ON CONFLICT (id) DO NOTHING;

-- Student 2
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES (
  '00000000-0000-0000-0000-000000000008',
  'student.rohan@greenwood.edu',
  crypt('Student@123', gen_salt('bf')),
  NOW(),
  '{"full_name":"Rohan Verma","role":"student"}'
) ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════
-- STEP 2: ENSURE PROFILES (if trigger didn't fire)
-- ═══════════════════════════════════════════════
INSERT INTO public.profiles (id, full_name, role, email, phone) VALUES
('00000000-0000-0000-0000-000000000001', 'Rajesh Principal', 'admin', 'admin@greenwood.edu', '9990000001'),
('00000000-0000-0000-0000-000000000002', 'Sunita Rao', 'teacher', 'sunita.rao@greenwood.edu', '9990000002'),
('00000000-0000-0000-0000-000000000003', 'Amit Kumar', 'teacher', 'amit.kumar@greenwood.edu', '9990000003'),
('00000000-0000-0000-0000-000000000004', 'Priya Sharma', 'teacher', 'priya.sharma@greenwood.edu', '9990000004'),
('00000000-0000-0000-0000-000000000005', 'Ramesh Sharma', 'parent', 'parent.anaya@email.com', '9990000005'),
('00000000-0000-0000-0000-000000000006', 'Sita Verma', 'parent', 'parent.rohan@email.com', '9990000006'),
('00000000-0000-0000-0000-000000000007', 'Anaya Sharma', 'student', 'student.anaya@greenwood.edu', '9990000007'),
('00000000-0000-0000-0000-000000000008', 'Rohan Verma', 'student', 'student.rohan@greenwood.edu', '9990000008')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

-- ═══════════════════════════════════════════════
-- STEP 3: CLASSES
-- ═══════════════════════════════════════════════
INSERT INTO public.classes (id, name) VALUES
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

-- ═══════════════════════════════════════════════
-- STEP 4: SECTIONS (A, B for each class)
-- ═══════════════════════════════════════════════
INSERT INTO public.sections (id, class_id, name) VALUES
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A'),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'B'),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000004', 'A'),
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 'B'),
('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000008', 'A'),
('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000008', 'B'),
('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000012', 'A'),
('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000013', 'A')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════
-- STEP 5: SUBJECTS
-- ═══════════════════════════════════════════════
INSERT INTO public.subjects (id, name, class, code) VALUES
('30000000-0000-0000-0000-000000000001', 'Mathematics', '10th', 'MAT-10th'),
('30000000-0000-0000-0000-000000000002', 'Science', '10th', 'SCI-10th'),
('30000000-0000-0000-0000-000000000003', 'English', '10th', 'ENG-10th'),
('30000000-0000-0000-0000-000000000004', 'Mathematics', '9th', 'MAT-9th'),
('30000000-0000-0000-0000-000000000005', 'Science', '9th', 'SCI-9th'),
('30000000-0000-0000-0000-000000000006', 'English', '9th', 'ENG-9th'),
('30000000-0000-0000-0000-000000000007', 'Mathematics', '1st', 'MAT-1st'),
('30000000-0000-0000-0000-000000000008', 'English', '1st', 'ENG-1st')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════
-- STEP 6: STUDENTS
-- ═══════════════════════════════════════════════
INSERT INTO public.students (id, admission_no, roll_no, section_id, status, gender, dob, parent_id, parent_email, parent_phone, guardian_name) VALUES
('00000000-0000-0000-0000-000000000007', 'STD-001', 1, '20000000-0000-0000-0000-000000000007', 'Active', 'Female', '2012-06-15', '00000000-0000-0000-0000-000000000005', 'parent.anaya@email.com', '9990000005', 'Ramesh Sharma'),
('00000000-0000-0000-0000-000000000008', 'STD-002', 2, '20000000-0000-0000-0000-000000000008', 'Active', 'Male', '2011-03-22', '00000000-0000-0000-0000-000000000006', 'parent.rohan@email.com', '9990000006', 'Sita Verma')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════
-- STEP 7: STAFF
-- ═══════════════════════════════════════════════
INSERT INTO public.staff (employee_id, profiles_id, name, role, subject, email, basic_salary, hra, conveyance, special_allowance, department, designation, qualification, experience, joining_date, mobile, status, class_assigned, division_assigned)
VALUES
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Sunita Rao', 'Teacher', 'Mathematics', 'sunita.rao@greenwood.edu', 35000, 7000, 3000, 2000, 'Science', 'Senior Teacher', 'M.Sc. Mathematics', '5 years', '2020-06-15', '9990000002', 'Active', '10th', 'A'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'Amit Kumar', 'Teacher', 'Science', 'amit.kumar@greenwood.edu', 32000, 6000, 3000, 2000, 'Science', 'Teacher', 'B.Sc. Physics', '3 years', '2022-07-01', '9990000003', 'Active', '9th', 'A'),
('STF-101', '00000000-0000-0000-0000-000000000004', 'Priya Sharma', 'Teacher', 'English', 'priya.sharma@greenwood.edu', 30000, 5000, 3000, 2000, 'Humanities', 'Teacher', 'M.A. English', '2 years', '2023-08-01', '9990000004', 'Active', '1st', 'A')
ON CONFLICT (employee_id) DO NOTHING;

-- ═══════════════════════════════════════════════
-- STEP 8: EXAMS (for exam_schedule_flow + report_card_flow)
-- ═══════════════════════════════════════════════
INSERT INTO public.exams (id, title, class, subject, date, start_date, start_time, end_time, time, venue, exam_type, status) VALUES
('40000000-0000-0000-0000-000000000001', 'Mathematics (09:00 - 12:00)', '10th', 'Mathematics', '2026-07-10', '2026-07-10', '09:00', '12:00', '09:00 - 12:00', 'Hall A', 'Term Exam', 'Scheduled'),
('40000000-0000-0000-0000-000000000002', 'Science (09:00 - 12:00)', '10th', 'Science', '2026-07-12', '2026-07-12', '09:00', '12:00', '09:00 - 12:00', 'Lab 1', 'Term Exam', 'Scheduled')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════
-- STEP 9: RESULTS (for results_notification_flow)
-- ═══════════════════════════════════════════════
INSERT INTO public.results (id, exam_id, student_id, subject_id, subject_name, marks_obtained, total_marks, grade, exam_type) VALUES
('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000001', 'Mathematics', 85, 100, 'A', 'Term Exam')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════
-- STEP 10: FEES PAYMENTS (for fee_recovery + management_dashboard)
-- ═══════════════════════════════════════════════
INSERT INTO public.fees_payments (id, student_id, student_name, parent_email, type, payment_method, amount, amount_paid, status, due_date, month) VALUES
('FEE-001', '00000000-0000-0000-0000-000000000007', 'Anaya Sharma', 'parent.anaya@email.com', 'Tuition Fee', 'UPI', 15000, 15000, 'Paid', '2026-06-10', 'June 2026'),
('FEE-002', '00000000-0000-0000-0000-000000000008', 'Rohan Verma', 'parent.rohan@email.com', 'Tuition Fee', 'Cash', 15000, 0, 'Pending', '2026-06-10', 'June 2026'),
('FEE-003', '00000000-0000-0000-0000-000000000007', 'Anaya Sharma', 'parent.anaya@email.com', 'Library Fee', 'UPI', 2000, 0, 'Pending', '2026-06-30', 'June 2026')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════
-- STEP 11: ATTENDANCE
-- ═══════════════════════════════════════════════
INSERT INTO public.attendance (id, student_id, date, status, created_at) VALUES
('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000007', '2026-06-19', 'Present', NOW()),
('60000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000008', '2026-06-19', 'Absent', NOW())
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════
-- STEP 12: NOTICES (for notice_broadcast_flow)
-- ═══════════════════════════════════════════════
INSERT INTO public.notices (id, title, content, description, target, audience, image_url, class, division, priority, date) VALUES
('70000000-0000-0000-0000-000000000001', 'Parent-Teacher Meeting', 'PTM scheduled for 25th June 2026 at 10 AM in the school auditorium. All parents are requested to attend.', 'PTM scheduled for 25th June 2026 at 10 AM.', 'All', 'All', '', 'All', 'All', 'High', '2026-06-19')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════
-- STEP 13: HOMEWORK (for homework_upload_flow)
-- ═══════════════════════════════════════════════
INSERT INTO public.homework (id, title, subject, class_grade, class, division, description, assigned_by, due_date, date, status) VALUES
('HW-001', 'Algebra Chapter 5', 'Mathematics', '10th', '10th', 'A', 'Complete exercises 5.1 to 5.4 from textbook. Show all working steps clearly.', 'Sunita Rao', '2026-06-25', '2026-06-19', 'Active'),
('HW-002', 'Physics - Laws of Motion', 'Science', '9th', '9th', 'A', 'Write notes on Newton''s three laws with real-life examples. Submit by Friday.', 'Amit Kumar', '2026-06-24', '2026-06-19', 'Active')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════
-- STEP 14: LEAVES (for management_dashboard_flow staff salary)
-- ═══════════════════════════════════════════════
INSERT INTO public.leaves (id, user_id, user_name, user_role, reason, start_date, end_date, status, target_role) VALUES
('80000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Sunita Rao', 'staff', 'Medical appointment', '2026-06-15', '2026-06-15', 'Approved', 'admin'),
('80000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000008', 'Rohan Verma', 'student', 'Family function', '2026-06-20', '2026-06-20', 'Pending', 'staff')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════
-- STEP 15: ADMISSIONS (for admission_flow)
-- ═══════════════════════════════════════════════
INSERT INTO public.admissions (id, student_name, parent_name, grade, class, dob, phone, address, status, parent_email) VALUES
('ADM-2026-001', 'Aarav Joshi', 'Meera Joshi', 'Nursery', 'Nursery', '2022-03-15', '9988776655', '42 Park Street, Mumbai', 'Pending', 'meera.joshi@email.com')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════
-- STEP 16: EVENTS + RSVPs (for parent_portal_flow)
-- ═══════════════════════════════════════════════
INSERT INTO public.events (id, title, description, event_date, time, venue) VALUES
('90000000-0000-0000-0000-000000000001', 'Annual Sports Day', 'Inter-house sports competition with track and field events. Parents invited as spectators.', '2026-07-15', '08:00 AM', 'School Ground'),
('90000000-0000-0000-0000-000000000002', 'Science Exhibition', 'Students showcase their science projects. Judging panel from local university.', '2026-07-20', '10:00 AM', 'Auditorium')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.event_rsvps (id, event_id, parent_id, status, comments) VALUES
('A0000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 'Confirmed', 'Will attend with family')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════
-- STEP 17: QUIZZES
-- ═══════════════════════════════════════════════
INSERT INTO public.quizzes (id, title, subject, class, division, type, date, total_marks) VALUES
('B0000000-0000-0000-0000-000000000001', 'Weekly Math Quiz', 'Mathematics', '10th', 'A', 'Quiz', '2026-06-21', 20),
('B0000000-0000-0000-0000-000000000002', 'Science Unit Test', 'Science', '9th', 'A', 'Test', '2026-06-22', 50)
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════
-- STEP 18: PAYSLIPS (for management_dashboard_flow)
-- ═══════════════════════════════════════════════
INSERT INTO public.payslips (id, employee_id, month, base_salary, present_days, absent_days, net_salary, status) VALUES
('C0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'June 2026', 35000, 23, 1, 34000, 'Paid')
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- SEED DATA COMPLETE
-- =========================================================================
-- Test accounts:
--   admin@greenwood.edu      / Admin@123     (Admin)
--   sunita.rao@greenwood.edu / Teacher@123   (Teacher - Mathematics)
--   amit.kumar@greenwood.edu / Teacher@123   (Teacher - Science)
--   priya.sharma@greenwood.edu / Teacher@123  (Teacher - English)
--   parent.anaya@email.com   / Parent@123    (Parent of Anaya Sharma)
--   parent.rohan@email.com   / Parent@123    (Parent of Rohan Verma)
--
-- Data ready to test:
--   + Attendance workflow (Anaya=Present, Rohan=Absent)
--   + Results workflow (Anaya scored 85/100 in Math)
--   + Fee recovery (Rohan has Pending fees)
--   + Exam schedule (Math + Science exams scheduled)
--   + Homework (2 active assignments)
--   + Notices (1 PTM notice)
--   + Events + RSVPs (Sports Day confirmed)
--   + Staff onboarding (Priya Sharma already onboarded)
--   + Payslips (Sunita Rao June 2026 payslip)
--   + Admissions (Aarav Joshi pending)
--   + Leaves (Sunita approved, Rohan pending)
-- =========================================================================
