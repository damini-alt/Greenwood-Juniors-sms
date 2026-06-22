require('dotenv').config();
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ajaybezpuilzcfnisapm.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqYXliZXpwdWlsemNmbmlzYXBtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTg0MDgyMSwiZXhwIjoyMDk3NDE2ODIxfQ.QPind71MXs4rLPvTzRSrQgsK4a2KK4y5aJ9XNJ4kdic';

async function checkData() {
    const headers = { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` };

    const studentRes = await fetch(`${supabaseUrl}/rest/v1/students?select=*,sections(name,classes(name))`, { headers });
    const students = await studentRes.json();
    
    const counts = {};
    students.forEach(s => {
        const cls = s.sections?.classes?.name || 'Unknown';
        const sec = s.sections?.name || 'Unknown';
        const key = `${cls} - ${sec}`;
        counts[key] = (counts[key] || 0) + 1;
    });

    console.log("--- Student Count per Class & Section in Database ---");
    console.log(counts);
}

checkData();
