require('dotenv').config();
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ajaybezpuilzcfnisapm.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqYXliZXpwdWlsemNmbmlzYXBtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTg0MDgyMSwiZXhwIjoyMDk3NDE2ODIxfQ.QPind71MXs4rLPvTzRSrQgsK4a2KK4y5aJ9XNJ4kdic';

async function diagnose() {
    console.log("--- Supabase Diagnostics ---");
    console.log("URL:", supabaseUrl);

    const tables = ['students', 'profiles', 'classes', 'sections', 'subjects', 'staff'];

    for (const table of tables) {
        try {
            const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=count`, {
                headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Prefer': 'count=exact' }
            });
            if (!res.ok) {
                console.log(`❌ Table [${table}]: ${res.status} ${res.statusText}`);
                continue;
            }
            const count = res.headers.get('content-range')?.split('/')?.[1] || '0';
            console.log(`✅ Table [${table}]: ${count} records`);
        } catch (e) {
            console.log(`❌ Table [${table}]: Error - ${e.message}`);
        }
    }

    console.log("\n--- Testing UI-Specific Joins (dashboard.js) ---");
    const uiQueries = [
        { name: 'students', query: 'students?select=*,profiles:profiles!students_id_fkey(full_name,phone,avatar_url),sections:section_id(name,classes(name))' },
        { name: 'results', query: 'results?select=*,students:student_id(full_name),subjects:subject_id(name)' },
        { name: 'sections', query: 'sections?select=*,classes(name)' }
    ];

    for (const q of uiQueries) {
        try {
            const res = await fetch(`${supabaseUrl}/rest/v1/${q.query}`, {
                headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
            });
            if (!res.ok) {
                console.log(`❌ UI Join [${q.name}]: ${res.status} ${await res.text()}`);
            } else {
                console.log(`✅ UI Join [${q.name}]: Success`);
            }
        } catch (e) {
            console.log(`❌ UI Join [${q.name}]: Exception - ${e.message}`);
        }
    }
}

diagnose();
