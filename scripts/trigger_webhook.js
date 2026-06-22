const fetch = require('node-fetch');

const webhookUrl = 'https://studio.pucho.ai/api/v1/webhooks/Ug2Ek52i7YXsYIOAyId9H';

const data = {
    action: 'STAFF_ATTENDANCE_AUTOMATION',
    class: 'Grade 10 - A',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' }),
    teacher: 'Sunita Rao',
    records: [
        {
            student_id: 'STU-1001',
            student_name: 'Advait Modi',
            status: 'Present',
            parent_name: 'Sunil Modi',
            parent_contact: '9876543210',
            parent_email: 'sunil.modi@example.com'
        },
        {
            student_id: 'STU-1002',
            student_name: 'Ishani Nair',
            status: 'Absent',
            parent_name: 'Lakshmi Nair',
            parent_contact: '9876543211',
            parent_email: 'lakshmi.nair@example.com'
        }
    ]
};

console.log('Triggering webhook with real data...');
fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
})
    .then(res => {
        console.log('Status:', res.status);
        return res.text();
    })
    .then(body => {
        console.log('Response:', body);
        console.log('✨ Webhook triggered successfully!');
    })
    .catch(err => console.error('Error:', err));
