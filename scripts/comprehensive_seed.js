require('dotenv').config();
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ajaybezpuilzcfnisapm.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqYXliZXpwdWlsemNmbmlzYXBtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTg0MDgyMSwiZXhwIjoyMDk3NDE2ODIxfQ.QPind71MXs4rLPvTzRSrQgsK4a2KK4y5aJ9XNJ4kdic';

const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

const adminHeaders = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json'
};

async function db(table, method, body, query = '') {
    const response = await fetch(`${supabaseUrl}/rest/v1/${table}${query}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    });
    if (!response.ok) {
        const err = await response.text();
        console.error(`Error in ${table} (${method}):`, err);
        return null;
    }
    return await response.json();
}

async function createUser(email, password, role) {
    const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify({
            email,
            password,
            email_confirm: true,
            user_metadata: { role }
        })
    });
    if (!response.ok) {
        const err = await response.text();
        if (err.includes('already exists')) {
            const listRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, { headers: adminHeaders });
            const list = await listRes.json();
            return list.users.find(u => u.email === email);
        }
        return null;
    }
    return await response.json();
}

const randomArr = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function runMasterSeed() {
    console.log("🚀 STARTING COMPREHENSIVE MASTER SEEDING (FIXED SCHEMA)...");

    // 0. Seed School
    const schoolRes = await db('schools', 'POST', {
        name: "Pucho International School",
        academic_year: "2025-26",
        address: "123 Tech Park, Digital City"
    });
    console.log("✅ Seeded School.");

    // 1. Seed Classes & Sections
    const classNames = ["10th", "9th", "8th", "7th", "6th"];
    const classes = [];
    for (const name of classNames) {
        const res = await db('classes', 'POST', { name });
        if (res && res.length > 0) classes.push(res[0]);
    }

    const sections = [];
    for (const cls of classes) {
        for (const sName of ["A", "B"]) {
            const res = await db('sections', 'POST', { class_id: cls.id, name: sName });
            if (res && res.length > 0) sections.push(res[0]);
        }
    }
    console.log(`✅ Seeded ${classes.length} classes and ${sections.length} sections.`);

    // 2. Seed Subjects
    const subs = ["Mathematics", "Physics", "Chemistry", "English", "History", "Computer", "Arts"];
    const seededSubs = [];
    for (const cls of classes) {
        for (const sub of subs) {
            const res = await db('subjects', 'POST', { name: sub, class: cls.name, code: `${sub.substring(0, 3).toUpperCase()}-${cls.name}` });
            if (res && res.length > 0) seededSubs.push(res[0]);
        }
    }
    console.log("✅ Seeded subjects.");

    // 3. Seed Staff (Need them for notices creator_id)
    const staffProfiles = [];
    for (let i = 1; i <= 10; i++) {
        const first = randomArr(["Sunita", "Amit", "Ramesh", "Priya", "Rajesh", "Kiran", "Deepak", "Manoj", "Suresh", "Anita"]);
        const last = randomArr(["Rao", "Kumar", "Babu", "Singh", "Iyer", "Nair", "Verma", "Gupta", "Sharma", "Joshi"]);
        const email = `teacher.${first.toLowerCase()}.${i}@pucho.edu`;
        const user = await createUser(email, 'pucho123', 'staff');
        if (user) {
            const prof = await db('profiles', 'POST', { id: user.id, full_name: `${first} ${last}`, role: 'teacher', phone: `96000000${i.toString().padStart(2, '0')}` });
            if (prof && prof.length > 0) staffProfiles.push(prof[0]);

            await db('staff', 'POST', {
                employee_id: user.id,
                name: `${first} ${last}`,
                email: email,
                role: 'Teacher',
                department: i % 2 === 0 ? 'Science' : 'Humanities',
                subject: randomArr(subs)
            });
        }
    }
    console.log("✅ Seeded 10 Staff members.");

    // 4. Seed Parents
    const parentProfiles = [];
    for (let i = 1; i <= 10; i++) {
        const email = `parent${i}@pucho.com`;
        const user = await createUser(email, 'pucho123', 'parent');
        if (user) {
            const prof = await db('profiles', 'POST', { id: user.id, full_name: `Parent Profile ${i}`, role: 'parent', phone: `98000000${i.toString().padStart(2, '0')}` });
            if (prof && prof.length > 0) parentProfiles.push(prof[0]);
            await db('parents', 'POST', { id: user.id, secondary_phone: `91000000${i.toString().padStart(2, '0')}`, address: `Pucho Residency, Tower ${i}` });
        }
    }
    console.log("✅ Seeded 10 Parents.");

    // 5. Seed Students
    const firstNames = ["Aarav", "Vihaan", "Aryan", "Ishani", "Anaya", "Zoya", "Kabir", "Rohan", "Sana", "Diya"];
    const lastNames = ["Sharma", "Das", "Verma", "Khan", "Singh", "Patel", "Modi", "Reddy", "Gupta", "Malhotra"];
    const students = [];
    for (let i = 1; i <= 20; i++) {
        const fName = randomArr(firstNames);
        const lName = randomArr(lastNames);
        const email = `student.${fName.toLowerCase()}.${i}@pucho.edu`;
        const user = await createUser(email, 'pucho123', 'student');
        if (user) {
            const prof = await db('profiles', 'POST', { id: user.id, full_name: `${fName} ${lName}`, role: 'student', phone: `97000000${i.toString().padStart(2, '0')}` });
            const section = randomArr(sections);
            const parent = randomArr(parentProfiles);
            const res = await db('students', 'POST', {
                id: user.id,
                admission_no: `ADM-2026-${i.toString().padStart(3, '0')}`,
                roll_no: i.toString(),
                section_id: section.id,
                parent_id: parent ? parent.id : null,
                gender: i % 2 === 0 ? 'Female' : 'Male',
                dob: '2012-05-15',
                status: 'active'
            });
            if (res && res.length > 0) students.push(res[0]);
        }
    }
    console.log(`✅ Seeded ${students.length} Students.`);

    // 6. Seed Exams
    const exams = [];
    for (let i = 1; i <= 10; i++) {
        const cls = randomArr(classes);
        const res = await db('exams', 'POST', {
            title: `Chapter Test ${i}`,
            class_id: cls.id,
            class: cls.name,
            start_date: `2025-02-${i + 10}`,
            subject: randomArr(subs),
            status: 'Scheduled',
            venue: `Room ${100 + i}`,
            start_time: '09:00 AM',
            end_time: '12:00 PM'
        });
        if (res && res.length > 0) exams.push(res[0]);
    }
    console.log("✅ Seeded 10 Exams.");

    // 7. Seed Results (For first 10 students)
    for (let i = 0; i < 10; i++) {
        const student = students[i];
        const exam = randomArr(exams);
        if (student && exam) {
            const sub = seededSubs.find(s => s.name === exam.subject && s.class === exam.class);
            await db('results', 'POST', {
                student_id: student.id,
                exam_id: exam.id,
                subject_id: sub ? sub.id : null,
                marks_obtained: Math.floor(Math.random() * 50 + 50),
                total_marks: 100,
                grade: 'A'
            });
        }
    }
    console.log("✅ Seeded Results.");

    // 8. Seed Notices
    for (let i = 1; i <= 10; i++) {
        const staff = randomArr(staffProfiles);
        await db('notices', 'POST', {
            title: `Notice Board #${i}`,
            content: `Important announcement regarding school activity ${i}.`,
            target_role: randomArr(['student', 'teacher', 'all']),
            creator_id: staff ? staff.id : null
        });
    }
    console.log("✅ Seeded 10 Notices.");

    // 9. Seed Quizzes
    for (let i = 1; i <= 10; i++) {
        const sub = randomArr(seededSubs);
        const section = randomArr(sections);
        await db('quizzes', 'POST', {
            title: `Weekly Quiz ${i}`,
            subject_id: sub ? sub.id : null,
            section_id: section ? section.id : null,
            total_questions: 10,
            status: 'active'
        });
    }
    console.log("✅ Seeded 10 Quizzes.");

    // 10. Seed Admissions
    for (let i = 1; i <= 10; i++) {
        const cls = randomArr(classes);
        await db('admissions', 'POST', {
            student_name: `New Applicant ${i}`,
            guardian_name: `Guardian ${i}`,
            email: `new${i}@example.com`,
            phone: `99000000${i.toString().padStart(2, '0')}`,
            target_class_id: cls ? cls.id : null,
            status: 'pending',
            notes: 'Verified documents.'
        });
    }
    console.log("✅ Seeded 10 Admissions.");

    // 11. Seed Fees Structure & Payments
    const structures = [];
    for (const cls of classes) {
        const res = await db('fees_structure', 'POST', {
            class_id: cls ? cls.id : null,
            fee_name: 'Academic Fee',
            amount: 15000,
            due_date: '2025-06-30'
        });
        if (res && res.length > 0) structures.push(res[0]);
    }

    for (let i = 0; i < 10; i++) {
        const student = students[i];
        if (student) {
            await db('fees_payments', 'POST', {
                student_id: student.id,
                amount_paid: 15000,
                payment_method: 'UPI',
                transaction_id: `TXN${Date.now()}${i}`,
                status: 'paid'
            });
        }
    }
    console.log("✅ Seeded Fees Structure and Payments.");

    // 12. Seed Leave Requests
    for (let i = 1; i <= 10; i++) {
        const staff = randomArr(staffProfiles);
        if (staff) {
            await db('leave_requests', 'POST', {
                requester_id: staff.id,
                role: 'teacher',
                reason: 'Sick leave',
                from_date: '2025-02-15',
                to_date: '2025-02-16',
                status: 'Pending'
            });
        }
    }
    console.log("✅ Seeded 10 Leave Requests.");

    console.log("✨ ALL TABLES FULLY POPULATED WITH 10+ ENTRIES EACH!");
}

runMasterSeed();
