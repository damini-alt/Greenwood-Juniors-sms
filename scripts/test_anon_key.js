require('dotenv').config();
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ajaybezpuilzcfnisapm.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqYXliZXpwdWlsemNmbmlzYXBtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTg0MDgyMSwiZXhwIjoyMDk3NDE2ODIxfQ.QPind71MXs4rLPvTzRSrQgsK4a2KK4y5aJ9XNJ4kdic';
const anonKey = process.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqYXliZXpwdWlsemNmbmlzYXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NDA4MjEsImV4cCI6MjA5NzQxNjgyMX0.Lkljr_RZJMTTeElvuB7YoBIKz8fBWavqGf7zQYiGPwg';

async function testKeys() {
    console.log("Testing keys on table 'classes'...");
    
    // Service Role Key
    const resSR = await fetch(`${supabaseUrl}/rest/v1/classes?select=*`, {
        headers: { 'apikey': serviceRoleKey, 'Authorization': `Bearer ${serviceRoleKey}` }
    });
    console.log("Service Role Key Result status:", resSR.status);
    const dataSR = await resSR.json();
    console.log("Service Role Key returned:", dataSR.length, "classes");

    // Anon Key
    const resAnon = await fetch(`${supabaseUrl}/rest/v1/classes?select=*`, {
        headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
    });
    console.log("Anon Key Result status:", resAnon.status);
    const dataAnon = await resAnon.json();
    console.log("Anon Key returned:", dataAnon.length, "classes");
    console.log("Anon Key data:", dataAnon);
}

testKeys();
