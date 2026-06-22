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
        return { error: err, status: response.status };
    }
    return { data: await response.json() };
}

async function createUser(email, password, role) {
    try {
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
        const result = await response.json();
        if (!response.ok) {
            const errStr = JSON.stringify(result);
            if (errStr.includes('exists') || errStr.includes('registered')) {
                const listRes = await fetch(`${supabaseUrl}/auth/v1/admin/users?per_page=1000`, { headers: adminHeaders });
                const listData = await listRes.json();
                const users = listData.users || listData;
                const user = (Array.isArray(users) ? users : []).find(u => u.email === email);
                if (user) return user;
            }
            console.error(`[createUser] ${email} failed: ${errStr}`);
            return null;
        }
        return result;
    } catch (e) {
        console.error(`[createUser] Exception for ${email}:`, e.message);
        return null;
    }
}

const firstNames = ["Aarav", "Vihaan", "Aryan", "Ishani", "Anaya", "Zoya", "Kabir", "Rohan", "Sana", "Diya", "Reyansh", "Aditya", "Advait", "Vivaan", "Imran"];
const lastNames = ["Sharma", "Das", "Verma", "Khan", "Singh", "Patel", "Modi", "Reddy", "Gupta", "Malhotra", "Kapoor", "Joshi", "Iyer", "Nair", "Bose"];

async function cleanDB() {
    console.log("🧹 Cleaning existing data...");
    const cleanupMap = [
        { table: 'homework', filter: '?id=not.is.null' },
        { table: 'attendance', filter: '?id=not.is.null' },
        { table: 'results', filter: '?id=not.is.null' },
        { table: 'fees_payments', filter: '?id=not.is.null' },
        { table: 'quizzes', filter: '?id=not.is.null' },
        { table: 'notices', filter: '?id=not.is.null' },
        { table: 'admissions', filter: '?id=not.is.null' },
        { table: 'leaves', filter: '?id=not.is.null' },
        { table: 'exams', filter: '?id=not.is.null' },
        { table: 'students', filter: '?id=not.is.null' },
        { table: 'staff', filter: '?employee_id=not.is.null' },
        { table: 'subjects', filter: '?id=not.is.null' },
        { table: 'sections', filter: '?id=not.is.null' },
        { table: 'classes', filter: '?id=not.is.null' },
        { table: 'profiles', filter: '?id=not.is.null' }
    ];
    for (const item of cleanupMap) {
        const res = await db(item.table, 'DELETE', null, item.filter);
        if (res.error) {
            console.warn(`⚠️ Cleanup skipped for ${item.table}: ${res.error.substring(0, 100)}`);
        } else {
            console.log(`✅ Cleaned ${item.table}`);
        }
    }
    console.log("✅ Cleanup complete.");
}

async function seed() {
    await cleanDB();
    console.log("🚀 Starting Master Seeding...");

    const classNames = ["LKG", "UKG", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10"];
    const classes = [];
    for (const name of classNames) {
        const res = await db('classes', 'POST', { name });
        if (res.data) classes.push(res.data[0]);
    }
    console.log(`✅ Seeded ${classes.length} classes.`);

    const sectionNames = ["A", "B"];
    const sections = [];
    if (classes.length > 0) {
        for (const cls of classes) {
            for (const name of sectionNames) {
                const res = await db('sections', 'POST', { class_id: cls.id, name });
                if (res.data) sections.push({ ...res.data[0], class_name: cls.name });
            }
        }
    }
    console.log(`✅ Seeded ${sections.length} sections.`);

    const subNames = ["Mathematics", "Science", "English", "History", "Geography"];
    for (const clsName of classNames) {
        for (const name of subNames) {
            await db('subjects', 'POST', {
                name,
                class: clsName,
                code: `${name.substring(0, 3).toUpperCase()}-${clsName.replace(/\s+/g, '')}`
            });
        }
    }
    console.log("✅ Seeded subjects.");

    console.log("⏳ Seeding students...");
    const students = [];
    for (const section of sections) {
        for (let i = 1; i <= 2; i++) {
            const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const fullName = `${fName} ${lName}`;
            const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${Math.floor(Math.random() * 1000)}@pucho.edu`;

            const user = await createUser(email, 'pucho123', 'student');
            if (user) {
                const profile = await db('profiles', 'POST', {
                    id: user.id,
                    full_name: fullName,
                    role: 'student',
                    phone: `9${Math.floor(Math.random() * 900000000 + 100000000)}`
                });

                if (profile.data || profile.status === 409 || (profile.error && profile.error.includes("duplicate"))) {
                    const student = await db('students', 'POST', {
                        id: user.id,
                        admission_no: `ADM-${section.class_name.replace(/\s+/g, '')}-${section.name}-${i}-${Math.floor(Math.random() * 100)}`,
                        roll_no: i,
                        section_id: section.id,
                        status: 'Active',
                        gender: i % 2 === 0 ? 'Female' : 'Male',
                        dob: '2014-06-20'
                    });
                    if (student.data) students.push(student.data[0]);
                }
            }
        }
    }
    console.log(`✅ Seeded ${students.length} students.`);

    const staffNames = [
        { name: "Sunita Rao", sub: "Mathematics", email: "sunita.rao@pucho.edu" },
        { name: "Amit Kumar", sub: "Science", email: "amit.kumar@pucho.edu" },
        { name: "Ramesh Babu", sub: "History", email: "ramesh.babu@pucho.edu" },
        { name: "Vikram Das", sub: "English", email: "vikram.das@pucho.edu" }
    ];
    const staffMembers = [];
    for (const sItem of staffNames) {
        const user = await createUser(sItem.email, 'pucho123', 'staff');
        if (user) {
            const profile = await db('profiles', 'POST', {
                id: user.id,
                full_name: sItem.name,
                role: 'teacher',
                phone: `9${Math.floor(Math.random() * 900000000 + 100000000)}`
            });

            if (profile.data || profile.status === 409 || (profile.error && profile.error.includes("duplicate"))) {
                // IMPORTANT: Staff table does not have 'id' column in this schema, use 'employee_id' only.
                const staffData = {
                    employee_id: `STF-${Math.floor(Math.random() * 900 + 100)}`,
                    name: sItem.name,
                    role: 'Teacher',
                    subject: sItem.sub,
                    email: sItem.email,
                    password: '123'
                };
                const staffRes = await db('staff', 'POST', staffData);
                if (staffRes.data) {
                    staffMembers.push({ ...staffRes.data[0], profile_id: user.id }); // Keep tracked link locally
                    console.log(`✅ Seeded staff: ${sItem.name}`);
                } else if (staffRes.status === 409) {
                    staffMembers.push({ ...staffData, profile_id: user.id });
                    console.log(`✅ Staff already exists: ${sItem.name}`);
                } else {
                    console.error(`❌ Failed staff table for ${sItem.name}:`, staffRes.error);
                }
            } else {
                console.error(`❌ Failed profile for ${sItem.name}:`, profile.error);
            }
        } else {
            console.error(`❌ User creation failed for staff: ${sItem.name}`);
        }
    }
    console.log(`✅ Final staff count: ${staffMembers.length}`);

    console.log("⏳ Seeding homework assignments...");
    if (staffMembers.length > 0) {
        const hwTopics = {
            "Mathematics": ["Algebra Basics", "Trigonometry Intro", "Number Systems"],
            "Science": ["Photosynthesis Diagram", "Laws of Motion", "Chemical Reactions"],
            "English": ["Grammar Exercise", "Poetry Analysis", "Short Story Draft"]
        };

        for (const section of sections) {
            const relevantSubs = ["Mathematics", "Science", "English"];
            for (const sub of relevantSubs) {
                const topics = hwTopics[sub];
                if (!topics) continue;
                const title = topics[Math.floor(Math.random() * topics.length)];
                const staff = staffMembers.find(s => s.subject === sub) || staffMembers[0];

                await db('homework', 'POST', {
                    id: `HW-${section.id.substring(0, 4)}-${sub.substring(0, 3)}-${Date.now() % 10000}-${Math.floor(Math.random() * 100)}`,
                    title: `${title} - ${section.class_name}`,
                    subject: sub,
                    class_grade: section.class_name,
                    division: section.name,
                    description: `Please complete the ${title} assignment as discussed in class. Submit by the due date.`,
                    assignedBy: staff.name,
                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                });
            }
        }
        console.log("✅ Seeded homework for all sections.");
    } else {
        console.warn("⚠️ Skipping homework seeding because no staff members were found/created.");
    }

    console.log("✨ MASTER SEEDING COMPLETE!");
}

seed();
