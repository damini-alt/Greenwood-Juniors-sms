require('dotenv').config();
const { chromium } = require('@playwright/test');

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ajaybezpuilzcfnisapm.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqYXliZXpwdWlsemNmbmlzYXBtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTg0MDgyMSwiZXhwIjoyMDk3NDE2ODIxfQ.QPind71MXs4rLPvTzRSrQgsK4a2KK4y5aJ9XNJ4kdic';

(async () => {
    let browser;
    try {
        console.log("Starting Auto-Confirmation for existing users...");
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        
        const result = await page.evaluate(async (supabaseUrl, serviceRoleKey) => {
            
            // 1. Fetch all users
            const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
                headers: {
                    'apikey': serviceRoleKey,
                    'Authorization': `Bearer ${serviceRoleKey}`
                }
            });
            
            if (!response.ok) {
                return { success: false, error: await response.text() };
            }
            
            const { users } = await response.json();
            const unconfirmed = users.filter(u => !u.email_confirmed_at);
            
            console.log(`Found ${unconfirmed.length} unconfirmed users.`);
            
            const confirmedCount = 0;
            const results = [];
            
            for (const user of unconfirmed) {
                const updateRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${user.id}`, {
                    method: 'PUT',
                    headers: {
                        'apikey': serviceRoleKey,
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email_confirm: true,
                        attributes: {
                            email_confirmed_at: new Date().toISOString()
                        }
                    })
                });
                
                if (updateRes.ok) {
                    results.push(`Confirmed: ${user.email}`);
                } else {
                    results.push(`Failed: ${user.email} (${await updateRes.text()})`);
                }
            }
            
            return { success: true, count: unconfirmed.length, details: results };
        }, supabaseUrl, serviceRoleKey);
        
        console.log("Confirmation Process Finished:");
        console.log(JSON.stringify(result, null, 2));
        
    } catch (err) {
        console.error("Critical Error during confirmation:", err);
    } finally {
        if (browser) await browser.close();
    }
})();
