// MASTER DATA STORE — Little Blooms (Mock Database -> Ready for API Integration)
const schoolDB = {
    schoolInfo: {
        name: "Little Blooms",
        tagline: "Little Blooms Early Learning Centre",
        academicYear: "2025-26",
        address: "123 Blossom Street, Garden Colony, Mumbai, Maharashtra - 400001",
        contact: "+91 98765 43210",
        whatsapp: "919876543210",
        email: "admissions@preschool.edu.in",
        programs: ["Playgroup", "Nursery", "LKG", "UKG"],
        feeStructure: {
            Playgroup: { term1: 18000, term2: 18000 },
            Nursery:   { term1: 20000, term2: 20000 },
            LKG:       { term1: 22000, term2: 22000 },
            UKG:       { term1: 24000, term2: 24000 }
        },
        term1: { label: "Term 1", months: "April – September", dueDate: "2025-04-10" },
        term2: { label: "Term 2", months: "October – March",   dueDate: "2025-10-10" }
    },

    students: [
        // ── Playgroup ───────────────────────────────────────────────────────────────
        { id: "STD-001", name: "Aanya Sharma",   class: "Playgroup", division: "Butterflies", roll_no: 1,  guardian_name: "Rajesh Sharma",  phone: "9876543210", email: "rajesh.sharma@example.com",  status: "Active", db_id: 1,  gender: "Female", dob: "2022-03-12", blood_group: "A+", allergies: "None", doctor_name: "Dr. Patil",   emergency_contact: "9876543210", parent_name: "Rajesh Sharma",  parent_email: "rajesh.sharma@example.com",  parent_phone: "9876543210" },
        { id: "STD-002", name: "Kabir Mehta",    class: "Playgroup", division: "Butterflies", roll_no: 2,  guardian_name: "Neha Mehta",     phone: "9988776655", email: "neha.mehta@example.com",     status: "Active", db_id: 2,  gender: "Male",   dob: "2022-07-20", blood_group: "B+", allergies: "Peanuts", doctor_name: "Dr. Kulkarni", emergency_contact: "9988776655", parent_name: "Neha Mehta",    parent_email: "neha.mehta@example.com",     parent_phone: "9988776655" },
        { id: "STD-003", name: "Riya Patel",     class: "Playgroup", division: "Sunflowers",  roll_no: 1,  guardian_name: "Kiran Patel",    phone: "9765432109", email: "kiran.patel@example.com",    status: "Active", db_id: 3,  gender: "Female", dob: "2022-01-08", blood_group: "O+", allergies: "None", doctor_name: "Dr. Sharma",   emergency_contact: "9765432109", parent_name: "Kiran Patel",   parent_email: "kiran.patel@example.com",    parent_phone: "9765432109" },
        { id: "STD-004", name: "Ayaan Khan",     class: "Playgroup", division: "Sunflowers",  roll_no: 2,  guardian_name: "Arif Khan",      phone: "9654321098", email: "arif.khan@example.com",      status: "Active", db_id: 4,  gender: "Male",   dob: "2022-05-30", blood_group: "AB+", allergies: "Dairy", doctor_name: "Dr. Joshi",    emergency_contact: "9654321098", parent_name: "Arif Khan",     parent_email: "arif.khan@example.com",      parent_phone: "9654321098" },

        // ── Nursery ─────────────────────────────────────────────────────────────────
        { id: "STD-005", name: "Diya Reddy",     class: "Nursery",   division: "Rainbows",    roll_no: 1,  guardian_name: "Suresh Reddy",   phone: "9543210987", email: "suresh.reddy@example.com",   status: "Active", db_id: 5,  gender: "Female", dob: "2021-09-14", blood_group: "A-", allergies: "None", doctor_name: "Dr. Iyer",     emergency_contact: "9543210987", parent_name: "Suresh Reddy",  parent_email: "suresh.reddy@example.com",   parent_phone: "9543210987" },
        { id: "STD-006", name: "Rohan Gupta",    class: "Nursery",   division: "Rainbows",    roll_no: 2,  guardian_name: "Manoj Gupta",    phone: "9432109876", email: "manoj.gupta@example.com",    status: "Active", db_id: 6,  gender: "Male",   dob: "2021-06-22", blood_group: "O+", allergies: "Eggs", doctor_name: "Dr. Patil",    emergency_contact: "9432109876", parent_name: "Manoj Gupta",   parent_email: "manoj.gupta@example.com",    parent_phone: "9432109876" },
        { id: "STD-007", name: "Ishani Verma",   class: "Nursery",   division: "Stars",       roll_no: 1,  guardian_name: "Sanjay Verma",   phone: "9123456789", email: "sanjay.verma@example.com",   status: "Active", db_id: 7,  gender: "Female", dob: "2021-11-02", blood_group: "B-", allergies: "None", doctor_name: "Dr. Nair",     emergency_contact: "9123456789", parent_name: "Sanjay Verma",  parent_email: "sanjay.verma@example.com",   parent_phone: "9123456789" },
        { id: "STD-008", name: "Vivaan Kumar",   class: "Nursery",   division: "Stars",       roll_no: 2,  guardian_name: "Dinesh Kumar",   phone: "9456789012", email: "dinesh.kumar@example.com",   status: "Active", db_id: 8,  gender: "Male",   dob: "2021-04-18", blood_group: "A+", allergies: "None", doctor_name: "Dr. Sharma",   emergency_contact: "9456789012", parent_name: "Dinesh Kumar",  parent_email: "dinesh.kumar@example.com",   parent_phone: "9456789012" },
        { id: "STD-009", name: "Saanvi Nair",    class: "Nursery",   division: "Stars",       roll_no: 3,  guardian_name: "Ravi Nair",      phone: "9567890123", email: "ravi.nair@example.com",      status: "Active", db_id: 9,  gender: "Female", dob: "2021-02-25", blood_group: "O-", allergies: "Gluten", doctor_name: "Dr. Kulkarni", emergency_contact: "9567890123", parent_name: "Ravi Nair",    parent_email: "ravi.nair@example.com",      parent_phone: "9567890123" },

        // ── LKG ─────────────────────────────────────────────────────────────────────
        { id: "STD-010", name: "Ananya Singh",   class: "LKG",       division: "Daisies",     roll_no: 1,  guardian_name: "Pradeep Singh",  phone: "9345678901", email: "pradeep.singh@example.com",  status: "Active", db_id: 10, gender: "Female", dob: "2020-08-05", blood_group: "B+", allergies: "None", doctor_name: "Dr. Joshi",    emergency_contact: "9345678901", parent_name: "Pradeep Singh", parent_email: "pradeep.singh@example.com",  parent_phone: "9345678901" },
        { id: "STD-011", name: "Kabir Joshi",    class: "LKG",       division: "Daisies",     roll_no: 2,  guardian_name: "Rahul Joshi",    phone: "9234567890", email: "rahul.joshi@example.com",    status: "Active", db_id: 11, gender: "Male",   dob: "2020-12-17", blood_group: "A+", allergies: "None", doctor_name: "Dr. Patil",    emergency_contact: "9234567890", parent_name: "Rahul Joshi",   parent_email: "rahul.joshi@example.com",    parent_phone: "9234567890" },
        { id: "STD-012", name: "Zoya Khan",      class: "LKG",       division: "Tulips",      roll_no: 1,  guardian_name: "Farid Khan",     phone: "9822334455", email: "farid.khan@example.com",     status: "Active", db_id: 12, gender: "Female", dob: "2020-03-09", blood_group: "O+", allergies: "Nuts", doctor_name: "Dr. Iyer",     emergency_contact: "9822334455", parent_name: "Farid Khan",   parent_email: "farid.khan@example.com",     parent_phone: "9822334455" },
        { id: "STD-013", name: "Mira Desai",     class: "LKG",       division: "Tulips",      roll_no: 2,  guardian_name: "Ketan Desai",    phone: "9789012345", email: "ketan.desai@example.com",    status: "Active", db_id: 13, gender: "Female", dob: "2020-06-28", blood_group: "AB-", allergies: "None", doctor_name: "Dr. Sharma",   emergency_contact: "9789012345", parent_name: "Ketan Desai",  parent_email: "ketan.desai@example.com",    parent_phone: "9789012345" },
        { id: "STD-014", name: "Arjun Pillai",   class: "LKG",       division: "Tulips",      roll_no: 3,  guardian_name: "Venkat Pillai",  phone: "9890123456", email: "venkat.pillai@example.com",  status: "Active", db_id: 14, gender: "Male",   dob: "2020-10-01", blood_group: "B+", allergies: "None", doctor_name: "Dr. Nair",     emergency_contact: "9890123456", parent_name: "Venkat Pillai", parent_email: "venkat.pillai@example.com",  parent_phone: "9890123456" },

        // ── UKG ─────────────────────────────────────────────────────────────────────
        { id: "STD-015", name: "Anika Rajput",   class: "UKG",       division: "Roses",       roll_no: 1,  guardian_name: "Harish Rajput",  phone: "9678904532", email: "harish.rajput@example.com",  status: "Active", db_id: 15, gender: "Female", dob: "2019-07-11", blood_group: "A+", allergies: "None", doctor_name: "Dr. Kulkarni", emergency_contact: "9678904532", parent_name: "Harish Rajput", parent_email: "harish.rajput@example.com",  parent_phone: "9678904532" },
        { id: "STD-016", name: "Anaya Das",      class: "UKG",       division: "Roses",       roll_no: 2,  guardian_name: "Vikram Das",     phone: "9600778899", email: "vikram.das@example.com",     status: "Active", db_id: 16, gender: "Female", dob: "2019-03-24", blood_group: "O+", allergies: "None", doctor_name: "Dr. Joshi",    emergency_contact: "9600778899", parent_name: "Vikram Das",    parent_email: "vikram.das@example.com",     parent_phone: "9600778899" },
        { id: "STD-017", name: "Aditya Rao",     class: "UKG",       division: "Lilies",      roll_no: 1,  guardian_name: "Prakash Rao",    phone: "9901234567", email: "prakash.rao@example.com",    status: "Active", db_id: 17, gender: "Male",   dob: "2019-11-30", blood_group: "B+", allergies: "Soy", doctor_name: "Dr. Patil",    emergency_contact: "9901234567", parent_name: "Prakash Rao",   parent_email: "prakash.rao@example.com",    parent_phone: "9901234567" },
        { id: "STD-018", name: "Kiara Menon",    class: "UKG",       division: "Lilies",      roll_no: 2,  guardian_name: "Anand Menon",    phone: "9012345678", email: "anand.menon@example.com",    status: "Active", db_id: 18, gender: "Female", dob: "2019-05-16", blood_group: "A-", allergies: "None", doctor_name: "Dr. Iyer",     emergency_contact: "9012345678", parent_name: "Anand Menon",   parent_email: "anand.menon@example.com",    parent_phone: "9012345678" },
        { id: "STD-019", name: "Reyansh Seth",   class: "UKG",       division: "Lilies",      roll_no: 3,  guardian_name: "Rohit Seth",     phone: "9812345678", email: "rohit.seth@example.com",     status: "Active", db_id: 19, gender: "Male",   dob: "2019-09-07", blood_group: "O+", allergies: "None", doctor_name: "Dr. Sharma",   emergency_contact: "9812345678", parent_name: "Rohit Seth",    parent_email: "rohit.seth@example.com",     parent_phone: "9812345678" }
    ],

    staff: [
        { id: "STF-001", name: "Mrs. Priya Sharma",     email: "priya.sharma@littleblooms.edu",    role: "teacher", subject: "General (Playgroup)", status: "Active", designation: "Head Mistress",       class_assigned: "Playgroup", division_assigned: "Butterflies", experience: 14, qualification: "M.Ed (Early Childhood)", phone: "9876501001", basic_salary: 35000, hra: 8750, conveyance: 2000, special_allowance: 4000 },
        { id: "STF-002", name: "Ms. Sneha Joshi",       email: "sneha.joshi@littleblooms.edu",     role: "teacher", subject: "General (Playgroup)", status: "Active", designation: "Class Teacher",       class_assigned: "Playgroup", division_assigned: "Sunflowers",  experience: 6,  qualification: "B.Ed",                   phone: "9876501002", basic_salary: 22000, hra: 5500, conveyance: 1500, special_allowance: 2000 },
        { id: "STF-003", name: "Mrs. Anita Iyer",       email: "anita.iyer@littleblooms.edu",      role: "teacher", subject: "General (Nursery)",  status: "Active", designation: "Class Teacher",       class_assigned: "Nursery",   division_assigned: "Rainbows",    experience: 9,  qualification: "B.Ed (Montessori)",      phone: "9876501003", basic_salary: 26000, hra: 6500, conveyance: 1500, special_allowance: 2500 },
        { id: "STF-004", name: "Ms. Kavitha Nair",      email: "kavitha.nair@littleblooms.edu",    role: "teacher", subject: "General (Nursery)",  status: "Active", designation: "Class Teacher",       class_assigned: "Nursery",   division_assigned: "Stars",       experience: 5,  qualification: "B.Ed",                   phone: "9876501004", basic_salary: 20000, hra: 5000, conveyance: 1500, special_allowance: 1500 },
        { id: "STF-005", name: "Mrs. Deepa Kulkarni",   email: "deepa.kulkarni@littleblooms.edu",  role: "teacher", subject: "General (LKG)",     status: "Active", designation: "Senior Teacher",      class_assigned: "LKG",       division_assigned: "Daisies",     experience: 11, qualification: "M.Ed",                   phone: "9876501005", basic_salary: 29000, hra: 7250, conveyance: 2000, special_allowance: 3000 },
        { id: "STF-006", name: "Ms. Ritu Pandey",       email: "ritu.pandey@littleblooms.edu",     role: "teacher", subject: "General (LKG)",     status: "Active", designation: "Class Teacher",       class_assigned: "LKG",       division_assigned: "Tulips",      experience: 7,  qualification: "B.Ed",                   phone: "9876501006", basic_salary: 23000, hra: 5750, conveyance: 1500, special_allowance: 2000 },
        { id: "STF-007", name: "Mrs. Sunita Pillai",    email: "sunita.pillai@littleblooms.edu",   role: "teacher", subject: "General (UKG)",     status: "Active", designation: "Senior Teacher",      class_assigned: "UKG",       division_assigned: "Roses",       experience: 12, qualification: "M.Ed (Early Childhood)", phone: "9876501007", basic_salary: 30000, hra: 7500, conveyance: 2000, special_allowance: 3000 },
        { id: "STF-008", name: "Ms. Divya Joshi",       email: "divya.joshi@littleblooms.edu",     role: "teacher", subject: "Art & Craft",        status: "Active", designation: "Activity Teacher",    class_assigned: "All",       division_assigned: "All",         experience: 5,  qualification: "Diploma in Fine Arts",   phone: "9876501008", basic_salary: 18000, hra: 4500, conveyance: 1500, special_allowance: 1500 },
        { id: "STF-009", name: "Mr. Varun Desai",       email: "varun.desai@littleblooms.edu",     role: "teacher", subject: "Music & Rhymes",     status: "Active", designation: "Music Teacher",       class_assigned: "All",       division_assigned: "All",         experience: 8,  qualification: "Diploma in Music",       phone: "9876501009", basic_salary: 19000, hra: 4750, conveyance: 1500, special_allowance: 1500 }
    ],

    fees: [
        // ── Term 1 Pending ──────────────────────────────────────────────────────────
        { id: "FEE-T1-001", student_id: "STD-001", student: "Aanya Sharma",  class: "Playgroup", type: "Term 1 Fee", amount: 18000, status: "Pending", dueDate: "2025-04-10", due_date: "2025-04-10" },
        { id: "FEE-T1-002", student_id: "STD-005", student: "Diya Reddy",    class: "Nursery",   type: "Term 1 Fee", amount: 20000, status: "Pending", dueDate: "2025-04-10", due_date: "2025-04-10" },
        { id: "FEE-T1-003", student_id: "STD-010", student: "Ananya Singh",  class: "LKG",       type: "Term 1 Fee", amount: 22000, status: "Pending", dueDate: "2025-04-10", due_date: "2025-04-10" },
        { id: "FEE-T1-004", student_id: "STD-015", student: "Anika Rajput",  class: "UKG",       type: "Term 1 Fee", amount: 24000, status: "Pending", dueDate: "2025-04-10", due_date: "2025-04-10" },
        { id: "FEE-T1-005", student_id: "STD-017", student: "Aditya Rao",    class: "UKG",       type: "Term 1 Fee", amount: 24000, status: "Pending", dueDate: "2025-04-10", due_date: "2025-04-10" },

        // ── Term 1 Paid ─────────────────────────────────────────────────────────────
        { id: "FEE-T1-006", student_id: "STD-002", student: "Kabir Mehta",   class: "Playgroup", type: "Term 1 Fee", amount: 18000, status: "Paid",    dueDate: "2025-04-10", due_date: "2025-04-10", paidDate: "2025-04-05", payment_date: "2025-04-05" },
        { id: "FEE-T1-007", student_id: "STD-016", student: "Anaya Das",     class: "UKG",       type: "Term 1 Fee", amount: 24000, status: "Paid",    dueDate: "2025-04-10", due_date: "2025-04-10", paidDate: "2025-04-08", payment_date: "2025-04-08" },
        { id: "FEE-T1-008", student_id: "STD-006", student: "Rohan Gupta",   class: "Nursery",   type: "Term 1 Fee", amount: 20000, status: "Paid",    dueDate: "2025-04-10", due_date: "2025-04-10", paidDate: "2025-04-03", payment_date: "2025-04-03" },
        { id: "FEE-T1-009", student_id: "STD-012", student: "Zoya Khan",     class: "LKG",       type: "Term 1 Fee", amount: 22000, status: "Paid",    dueDate: "2025-04-10", due_date: "2025-04-10", paidDate: "2025-04-01", payment_date: "2025-04-01" },

        // ── Admission Fee ────────────────────────────────────────────────────────────
        { id: "FEE-ADM-001", student_id: "STD-003", student: "Riya Patel",   class: "Playgroup", type: "Admission Fee", amount: 5000, status: "Paid",  dueDate: "2025-03-30", due_date: "2025-03-30", paidDate: "2025-03-25", payment_date: "2025-03-25" },
        { id: "FEE-ADM-002", student_id: "STD-018", student: "Kiara Menon",  class: "UKG",       type: "Admission Fee", amount: 5000, status: "Pending", dueDate: "2025-04-15", due_date: "2025-04-15" }
    ],

    attendance: [
        // Anaya Das (STD-016)
        { id: "ATT-001", student_id: "STD-016", date: "2026-01-06", status: "Present" },
        { id: "ATT-002", student_id: "STD-016", date: "2026-01-07", status: "Present" },
        { id: "ATT-003", student_id: "STD-016", date: "2026-01-08", status: "Absent" },
        { id: "ATT-004", student_id: "STD-016", date: "2026-01-13", status: "Present" },
        { id: "ATT-005", student_id: "STD-016", date: "2026-01-14", status: "Present" },
        { id: "ATT-006", student_id: "STD-016", date: "2026-01-15", status: "Present" },
        // Kabir Mehta (STD-002)
        { id: "ATT-007", student_id: "STD-002", date: "2026-01-06", status: "Present" },
        { id: "ATT-008", student_id: "STD-002", date: "2026-01-07", status: "Absent" },
        { id: "ATT-009", student_id: "STD-002", date: "2026-01-13", status: "Present" }
    ],

    exams: [
        { id: "EXM-001", class: "LKG",  subject: "General Awareness", date: "2026-05-08", time: "09:00 AM", venue: "LKG Room", examType: "Term Assessment" },
        { id: "EXM-002", class: "UKG",  subject: "English",           date: "2026-05-09", time: "09:00 AM", venue: "UKG Room", examType: "Term Assessment" },
        { id: "EXM-003", class: "Nursery", subject: "Rhymes & Stories", date: "2026-05-10", time: "09:30 AM", venue: "Nursery Room", examType: "Oral Assessment" }
    ],

    results: [
        { id: "RES-001", student_id: "STD-016", student: "Anaya Das",  subject: "English",           marks: 88, total: 100, grade: "A+", exam: "Term Assessment" },
        { id: "RES-002", student_id: "STD-016", student: "Anaya Das",  subject: "General Awareness", marks: 92, total: 100, grade: "A+", exam: "Term Assessment" },
        { id: "RES-003", student_id: "STD-016", student: "Anaya Das",  subject: "Mathematics",       marks: 85, total: 100, grade: "A",  exam: "Term Assessment" },
        { id: "RES-004", student_id: "STD-002", student: "Kabir Mehta",subject: "Rhymes & Stories",  marks: 78, total: 100, grade: "B+", exam: "Term Assessment" },
        { id: "RES-005", student_id: "STD-002", student: "Kabir Mehta",subject: "General Awareness", marks: 82, total: 100, grade: "A",  exam: "Term Assessment" }
    ],

    admissions: [
        { id: "ADM-001", student_name: "Arnav Kapoor",  parent_name: "Vikram Kapoor",  grade: "Nursery",   dob: "2021-09-10", phone: "9876500101", status: "Pending",  applied_at: "2025-03-10T10:00:00Z", parent_email: "vikram.kapoor@example.com",  docs: { birth_cert: "uploaded", address_proof: "missing" } },
        { id: "ADM-002", student_name: "Tara Bhat",     parent_name: "Ramesh Bhat",    grade: "Playgroup", dob: "2022-06-18", phone: "9109876543", status: "Pending",  applied_at: "2025-03-12T11:30:00Z", parent_email: "ramesh.bhat@example.com",    docs: { birth_cert: "uploaded", address_proof: "uploaded" } },
        { id: "ADM-003", student_name: "Pihu Saxena",   parent_name: "Pankaj Saxena",  grade: "LKG",       dob: "2020-11-05", phone: "9345671209", status: "Approved", applied_at: "2025-02-20T09:00:00Z", parent_email: "pankaj.saxena@example.com",  docs: { birth_cert: "uploaded", address_proof: "uploaded" } }
    ],

    notices: [
        { id: "NTC-001", title: "🌸 Annual Day 2025 — Save the Date!", content: "Little Blooms Annual Day will be held on 20th February 2026 at 9 AM in the school auditorium. All parents are cordially invited!", date: "2025-12-01", target: "Parents", audience: "Parents", priority: "High",   rsvp: true },
        { id: "NTC-002", title: "📚 Summer Camp Registration Open",   content: "Enroll your child for our engaging summer camp (April 1–15). Activities include art, dance, yoga, and storytelling.",            date: "2025-03-01", target: "Parents", audience: "Parents", priority: "Medium", rsvp: true  },
        { id: "NTC-003", title: "💉 Health Check-Up Drive",           content: "Free dental and vision check-up for all students on March 10 by certified medical professionals.",                                date: "2025-03-05", target: "All",     audience: "All",     priority: "High",   rsvp: false },
        { id: "NTC-004", title: "🎨 Art & Craft Exhibition",          content: "Display your child's artwork at our in-school exhibition on March 22. Voting by parents to select the best artwork.",            date: "2025-03-08", target: "Parents", audience: "Parents", priority: "Medium", rsvp: true  },
        { id: "NTC-005", title: "📅 PTM Notice — March Session",     content: "Parent-Teacher Meeting is scheduled for March 15 (Saturday). Please register your preferred slot via the portal.",               date: "2025-03-10", target: "Parents", audience: "Parents", priority: "High",   rsvp: true  }
    ],

    quizzes: [
        { id: "QZ-001", title: "Alphabet Recognition", subject: "English", class: "LKG", division: "Daisies", type: "Oral Quiz", date: "2026-01-08", totalMarks: 20 },
        { id: "QZ-002", title: "Counting 1-20",        subject: "Mathematics", class: "Nursery", division: "Stars", type: "Activity", date: "2026-01-10", totalMarks: 20 }
    ],

    subjects: [
        { id: "SUB-001", name: "English",              class: "Playgroup" },
        { id: "SUB-002", name: "Rhymes & Stories",     class: "Playgroup" },
        { id: "SUB-003", name: "General Awareness",    class: "Playgroup" },
        { id: "SUB-004", name: "English",              class: "Nursery" },
        { id: "SUB-005", name: "Mathematics",          class: "Nursery" },
        { id: "SUB-006", name: "Rhymes & Stories",     class: "Nursery" },
        { id: "SUB-007", name: "General Awareness",    class: "Nursery" },
        { id: "SUB-008", name: "English",              class: "LKG" },
        { id: "SUB-009", name: "Mathematics",          class: "LKG" },
        { id: "SUB-010", name: "General Awareness",    class: "LKG" },
        { id: "SUB-011", name: "Rhymes & Stories",     class: "LKG" },
        { id: "SUB-012", name: "English",              class: "UKG" },
        { id: "SUB-013", name: "Mathematics",          class: "UKG" },
        { id: "SUB-014", name: "General Awareness",    class: "UKG" },
        { id: "SUB-015", name: "Environmental Studies", class: "UKG" }
    ],

    homework: [
        { id: "HW-101", title: "Trace the Alphabets A–E",  subject: "English",           class: "Playgroup", class_grade: "Playgroup", division: "All",       assignedBy: "Ms. Sneha Joshi",     dueDate: "2026-01-25", assignedDate: "2026-01-20", file: null,              description: "Using the dotted alphabet tracing sheet provided, trace letters A through E carefully. Use a pencil and try to stay within the lines." },
        { id: "HW-102", title: "Count & Color: 1–10",      subject: "Mathematics",        class: "Nursery",   class_grade: "Nursery",   division: "Stars",     assignedBy: "Ms. Kavitha Nair",   dueDate: "2026-01-26", assignedDate: "2026-01-21", file: "counting_sheet.pdf", description: "Color the correct number of objects in each box (1 to 10). Use crayons to make it colorful!" },
        { id: "HW-103", title: "My Favourite Animal Drawing", subject: "General Awareness", class: "LKG",       class_grade: "LKG",       division: "All",       assignedBy: "Mrs. Deepa Kulkarni", dueDate: "2026-01-24", assignedDate: "2026-01-20", file: null,              description: "Draw your favourite animal and write its name below the picture. Share one fun fact about it with the class tomorrow." },
        { id: "HW-104", title: "Rhymes Practice: Twinkle Twinkle", subject: "Rhymes & Stories", class: "UKG",  class_grade: "UKG",       division: "Roses",     assignedBy: "Mrs. Sunita Pillai", dueDate: "2026-01-27", assignedDate: "2026-01-22", file: null,              description: "Practise reciting 'Twinkle Twinkle Little Star' with actions. Parents: Please record a 30-second video and upload it to the parent portal." }
    ],

    leaves: [
        { id: "LV-001", user_id: "STD-016", user_name: "Anaya Das",   user_role: "student", reason: "Fever",        start_date: "2026-01-15", end_date: "2026-01-16", status: "Approved", target_role: "staff" },
        { id: "LV-002", user_id: "VikramDas123", user_name: "Vikram Das", user_role: "parent", reason: "Family Function", start_date: "2026-01-22", end_date: "2026-01-23", status: "Pending", target_role: "staff" }
    ],

    // Preschool Events (for RSVP/acknowledgment)
    events: [
        { id: "EVT-001", title: "Annual Sports Day",         date: "2026-02-15", time: "08:30 AM", description: "Fun-filled outdoor activities for all children. Parents are invited to cheer!", venue: "School Ground", rsvpCount: 12 },
        { id: "EVT-002", title: "Fancy Dress Competition",   date: "2026-03-01", time: "10:00 AM", description: "Children dress up as their favourite storybook character. Prizes for all participants!", venue: "Main Hall",     rsvpCount: 18 },
        { id: "EVT-003", title: "Parent-Teacher Meeting",    date: "2026-03-15", time: "09:00 AM", description: "One-on-one session with class teachers to discuss your child's progress and wellbeing.", venue: "Respective Classrooms", rsvpCount: 7 }
    ]
};

// Global accessor
window.schoolDB = schoolDB;
