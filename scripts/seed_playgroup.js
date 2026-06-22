require('dotenv').config();
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ajaybezpuilzcfnisapm.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqYXliZXpwdWlsemNmbmlzYXBtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTg0MDgyMSwiZXhwIjoyMDk3NDE2ODIxfQ.QPind71MXs4rLPvTzRSrQgsK4a2KK4y5aJ9XNJ4kdic';

const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

async function seedPlaygroup() {
    console.log("Starting Playgroup students seeding...");

    // 1. Get Playgroup class
    const classRes = await fetch(`${supabaseUrl}/rest/v1/classes?name=eq.Playgroup`, { headers });
    const classes = await classRes.json();
    if (!classes || classes.length === 0) {
        console.error("Playgroup class not found. Run fix_sections.js first.");
        return;
    }
    const pgClass = classes[0];

    // 2. Get Playgroup sections
    const secRes = await fetch(`${supabaseUrl}/rest/v1/sections?class_id=eq.${pgClass.id}`, { headers });
    const pgSections = await secRes.json();
    console.log(`Found ${pgSections.length} sections for Playgroup.`);

    // 3. Get some parent profiles to link to
    const parentRes = await fetch(`${supabaseUrl}/rest/v1/profiles?role=eq.parent&limit=10`, { headers });
    const parents = await parentRes.json();
    if (parents.length === 0) {
        console.warn("No parent profiles found to link. Will use empty parent IDs.");
    }

    const firstNames = ["Kavya", "Vivaan", "Kiara", "Reyansh", "Ananya", "Aarav", "Myra", "Kabir", "Diya", "Rohan"];
    const lastNames = ["Sharma", "Verma", "Patel", "Singh", "Gupta", "Mehra", "Joshi", "Rao", "Nair", "Bose"];

    for (const sec of pgSections) {
        // Check if there are already students in this section
        const stuCheck = await fetch(`${supabaseUrl}/rest/v1/students?section_id=eq.${sec.id}&select=count`, {
            headers: { ...headers, 'Prefer': 'count=exact' }
        });
        const count = stuCheck.headers.get('content-range')?.split('/')?.[1] || '0';
        if (parseInt(count) > 0) {
            console.log(`Section ${sec.name} already has ${count} students. Skipping seeding.`);
            continue;
        }

        console.log(`Seeding 10 students for Playgroup - ${sec.name}...`);
        for (let i = 1; i <= 10; i++) {
            const fName = firstNames[(i - 1) % firstNames.length];
            const lName = lastNames[(i + sec.name.length) % lastNames.length];
            const fullName = `${fName} ${lName}`;
            const studentId = crypto.randomUUID();
            const studentEmail = `student.${fName.toLowerCase()}.${lName.toLowerCase()}_playgroup_${sec.name.toLowerCase()}_${i}@school.com`;
            
            const parent = parents[(i - 1) % parents.length] || {};
            const parentId = parent.id || null;
            const parentName = parent.full_name || 'Guardian';
            const parentEmail = parent.email || 'parent@school.com';
            const parentPhone = parent.phone || '9990000000';

            // Create profile
            const profileRes = await fetch(`${supabaseUrl}/rest/v1/profiles`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    id: studentId,
                    full_name: fullName,
                    role: 'student',
                    email: studentEmail,
                    phone: '999' + String(1000000 + i + (sec.name === 'Butterflies' ? 10 : 20))
                })
            });

            if (!profileRes.ok) {
                console.error(`Failed to create profile for ${fullName}:`, await profileRes.text());
                continue;
            }

            // Create student
            const studentRes = await fetch(`${supabaseUrl}/rest/v1/students`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    id: studentId,
                    admission_no: `STD-PLAYGROUP-${sec.name.substring(0, 3).toUpperCase()}-${String(i).padStart(3, '0')}`,
                    roll_no: i,
                    section_id: sec.id,
                    status: 'Active',
                    gender: i % 2 === 0 ? 'Female' : 'Male',
                    dob: '2023-03-15',
                    parent_id: parentId,
                    parent_email: parentEmail,
                    parent_phone: parentPhone,
                    guardian_name: parentName
                })
            });

            if (!studentRes.ok) {
                console.error(`Failed to create student ${fullName}:`, await studentRes.text());
            } else {
                console.log(`Created student: ${fullName}`);
            }
        }
    }

    console.log("Playgroup seeding complete!");
}

seedPlaygroup();
