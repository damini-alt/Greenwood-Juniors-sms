# Pucho Studio Webhook Registration Reference

## All 11 Webhooks Registered

All flows now have live webhook URLs deployed and wired in `dashboard.js` + `public/config.js`.

### 1. Attendance Automation
```
URL:     https://studio.pucho.ai/api/v1/webhooks/Ug2Ek52i7YXsYIOAyId9H
Flow:    Attendance_Automation_Flow - greenwood-sms
Action:  STAFF_ATTENDANCE_AUTOMATION
Trigger: Staff marks attendance in UI -> loops through records -> emails absent/late parents
```

### 2. Report Card Generation
```
URL:     https://studio.pucho.ai/api/v1/webhooks/6eOOY4DZDtZ4qme9OQo9s
Flow:    Report_Card_Flow - greenwood-sms
Action:  REPORT_CARD_GENERATION
Trigger: Teacher saves exam marks -> loops through results -> emails report cards to parents
```

### 3. Staff Onboarding
```
URL:     https://studio.pucho.ai/api/v1/webhooks/2EYTPsOBUHLc3o4MEzL9M
Flow:    Staff_Onboarding_Flow - greenwood-sms
Action:  (auto - no router)
Trigger: Admin adds/edits staff -> upserts to DB -> welcome email -> creates HR verification todo
```

### 4. Notice Broadcast
```
URL:     https://studio.pucho.ai/api/v1/webhooks/a46uCRwjp7Q0Bp9XwDkjG
Flow:    Notice_Broadcast_Flow - greenwood-sms
Action:  NOTICE_PUBLISHED
Trigger: Admin publishes notice -> stores in DB -> loops recipients -> emails all
```

### 5. Exam Schedule
```
URL:     https://studio.pucho.ai/api/v1/webhooks/5ehEmQ2nUP6a2gq2m0WlX
Flow:    Exam_Schedule_Flow - greenwood-sms
Action:  Exam Published / Exam Updated
Trigger: Admin schedules exam -> loops schedule -> saves to DB -> emails parents timetable
```

### 6. Results Notification (Individual Marks)
```
URL:     https://studio.pucho.ai/api/v1/webhooks/jveOtzEHwa5TdkeaLLpD4
Flow:    Results_Notification_Flow - greenwood-sms
Action:  RESULTS_PUBLISHED
Trigger: Teacher saves individual marks -> persists to DB -> emails parent with marks
```

### 7. Homework Upload
```
URL:     https://studio.pucho.ai/api/v1/webhooks/TV3oIpil0k3BYxeBX5Tni
Flow:    Homework_Upload_Flow - greenwood-sms
Action:  HOMEWORK_PUBLISHED
Trigger: Teacher uploads homework -> saves to DB -> loops recipients -> emails parents
```

### 8. Fee Recovery Loop
```
URL:     https://studio.pucho.ai/api/v1/webhooks/IID0LvlCsMbMXasFGMY6E
Flow:    Fee_Recovery_Loop_Flow - greenwood-sms
Action:  FEE_RECOVERY_AUTOMATION_LOOP
Trigger: Admin clicks "Run Recovery Flow" -> loops pending fees -> emails parents
```

### 9. Admission Flow
```
URL:     https://studio.pucho.ai/api/v1/webhooks/Y3R18EiSt2IbWKOpomcQj
Flow:    Admission_Flow - greenwood-sms
Action:  (auto - no router)
Trigger: Submit Application (parent_portal) or Admissions page
Payload: { parent_name, student_name, grade, dob, phone, email, address }
```

### 10. Parent Portal RSVP Flow
```
URL:     https://studio.pucho.ai/api/v1/webhooks/F5M67RflZnA9nHe02EFeG
Flow:    Parent_Portal_Flow - greenwood-sms
Action:  (auto - no router)
Trigger: Parent Portal RSVP form
Payload: { event_id, parent_id, status, comments }
```

### 11. Management Dashboard Flow
```
URL:     https://studio.pucho.ai/api/v1/webhooks/ReuxtwNMNxtc7boiNZY5g
Flow:    Management_Dashboard_Flow - greenwood-sms
Action:  homework_broadcast / salary_calculation / fee_reminder
Trigger: Management Dashboard page
```

---

## Test Webhook (scripts/trigger_webhook.js)

A standalone Node.js script to test the attendance webhook:
```bash
node scripts/trigger_webhook.js
```
This fires a test STAFF_ATTENDANCE_AUTOMATION payload with 2 sample students.