// Application Configuration File - Centralized Webhook URLs and Supabase Credentials
const appConfig = {
    supabaseUrl: "https://ajaybezpuilzcfnisapm.supabase.co",
    supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqYXliZXpwdWlsemNmbmlzYXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NDA4MjEsImV4cCI6MjA5NzQxNjgyMX0.Lkljr_RZJMTTeElvuB7YoBIKz8fBWavqGf7zQYiGPwg",
    webhooks: {
        attendance: "https://studio.pucho.ai/api/v1/webhooks/Ug2Ek52i7YXsYIOAyId9H",
        notice: "https://studio.pucho.ai/api/v1/webhooks/a46uCRwjp7Q0Bp9XwDkjG",
        staffOnboarding: "https://studio.pucho.ai/api/v1/webhooks/2EYTPsOBUHLc3o4MEzL9M",
        managementDashboard: "https://studio.pucho.ai/api/v1/webhooks/ReuxtwNMNxtc7boiNZY5g",
        reportCard: "https://studio.pucho.ai/api/v1/webhooks/6eOOY4DZDtZ4qme9OQo9s",
        admission: "https://studio.pucho.ai/api/v1/webhooks/Y3R18EiSt2IbWKOpomcQj",
        parentPortal: "https://studio.pucho.ai/api/v1/webhooks/F5M67RflZnA9nHe02EFeG",
        results: "https://studio.pucho.ai/api/v1/webhooks/jveOtzEHwa5TdkeaLLpD4",
        homework: "https://studio.pucho.ai/api/v1/webhooks/TV3oIpil0k3BYxeBX5Tni",
        feeRecovery: "https://studio.pucho.ai/api/v1/webhooks/IID0LvlCsMbMXasFGMY6E",
        examSchedule: "https://studio.pucho.ai/api/v1/webhooks/5ehEmQ2nUP6a2gq2m0WlX"
    }
};

window.appConfig = appConfig;