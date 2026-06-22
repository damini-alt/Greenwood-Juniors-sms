require('dotenv').config();
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ajaybezpuilzcfnisapm.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqYXliZXpwdWlsemNmbmlzYXBtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTg0MDgyMSwiZXhwIjoyMDk3NDE2ODIxfQ.QPind71MXs4rLPvTzRSrQgsK4a2KK4y5aJ9XNJ4kdic';

async function createBucket() {
    const url = `${supabaseUrl}/storage/v1/bucket`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: 'homework',
            name: 'homework',
            public: true,
            file_size_limit: 52428800, // 50MB
            allowed_mime_types: ['image/*', 'application/pdf']
        })
    });

    if (response.ok) {
        console.log('✅ Bucket "homework" created successfully!');
    } else {
        const err = await response.json();
        if (err.error === 'Duplicate' || response.status === 409) {
            console.log('ℹ️ Bucket "homework" already exists.');
        } else {
            console.error('❌ Failed to create bucket:', err);
        }
    }
}

createBucket();
