const fetch = require('node-fetch');

const BASE = 'https://studio.pucho.ai/api/v1/webhooks';

const TESTS = [
  {
    name: 'Notice Broadcast',
    url: `${BASE}/5CznwQbSkKQThvK62x5g9`,
    body: {
      action: 'NOTICE_PUBLISHED',
      notice: {
        title: 'Test: Parent-Teacher Meeting',
        content: 'PTM scheduled for 25th June at 10 AM.',
        description: 'PTM scheduled for 25th June at 10 AM.',
        audience: 'All', target: 'All',
        class: 'All', division: 'All',
        priority: 'High', date: '2026-06-19'
      },
      recipients: [
        { name: 'Ramesh Sharma', email: 'parent.anaya@email.com', type: 'Parent' },
        { name: 'Sunita Rao', email: 'sunita.rao@greenwood.edu', type: 'Staff' }
      ]
    }
  },
  {
    name: 'Attendance Automation',
    url: `${BASE}/GrNg8QkIFlOGYy6x94Fv6`,
    body: {
      action: 'STAFF_ATTENDANCE_AUTOMATION',
      class: '10th - A',
      date: '2026-06-19',
      time: '10:00 AM',
      teacher: 'Sunita Rao',
      records: [
        { student_id: '00000000-0000-0000-0000-000000000007', student_name: 'Anaya Sharma', status: 'Absent', parent_name: 'Ramesh Sharma', parent_email: 'parent.anaya@email.com' },
        { student_id: '00000000-0000-0000-0000-000000000008', student_name: 'Rohan Verma', status: 'Late', parent_name: 'Sita Verma', parent_email: 'parent.rohan@email.com' }
      ]
    }
  },
  {
    name: 'Homework Upload',
    url: `${BASE}/aUTfSnTHeQBmJXXs5xCxD`,
    body: {
      action: 'HOMEWORK_PUBLISHED',
      homework: {
        title: 'Algebra Chapter 5',
        subject: 'Mathematics',
        class: '10th', division: 'A',
        teacher: 'Sunita Rao',
        due_date: '2026-06-25',
        description: 'Complete exercises 5.1 to 5.4'
      },
      recipients: [
        { student_name: 'Anaya Sharma', parent_email: 'parent.anaya@email.com' },
        { student_name: 'Rohan Verma', parent_email: 'parent.rohan@email.com' }
      ]
    }
  },
  {
    name: 'Exam Schedule',
    url: `${BASE}/3GWzZUORoobpsu0ALUV4s`,
    body: {
      action: 'Exam Published',
      target_class: '10th',
      exam_schedule: [
        { subject: 'Mathematics', class: '10th', date: '2026-07-10', start_time: '09:00', end_time: '12:00', time: '09:00 - 12:00', venue: 'Hall A', exam_type: 'Term Exam', status: 'Scheduled' },
        { subject: 'Science', class: '10th', date: '2026-07-12', start_time: '09:00', end_time: '12:00', time: '09:00 - 12:00', venue: 'Lab 1', exam_type: 'Term Exam', status: 'Scheduled' }
      ],
      recipients: [
        { parent_name: 'Ramesh Sharma', parent_email: 'parent.anaya@email.com' }
      ]
    }
  },
  {
    name: 'Results Notification',
    url: `${BASE}/TIcVMflMPrt0uToVhxQ3J`,
    body: {
      action: 'RESULTS_PUBLISHED',
      exam_type: 'Term Exam',
      student: { id: '00000000-0000-0000-0000-000000000007', name: 'Anaya Sharma', class: '10th', division: 'A' },
      parent: { name: 'Ramesh Sharma', email: 'parent.anaya@email.com' },
      marks: [{ subject: 'Mathematics', obtained: 85, total: 100, grade: 'A' }],
      published_by: 'Sunita Rao'
    }
  },
  {
    name: 'Report Card',
    url: `${BASE}/lAFPplKxovNfqPFSBaCxE`,
    body: {
      action: 'REPORT_CARD_GENERATION',
      exam_name: 'Term Exam',
      class: '10th', division: 'A',
      subject: 'Mathematics',
      results: [
        { student_name: 'Anaya Sharma', parent_name: 'Ramesh Sharma', parent_email: 'parent.anaya@email.com', marks: 85, grade: 'A' }
      ]
    }
  },
  {
    name: 'Fee Recovery Loop',
    url: `${BASE}/4JqnOMaZ4qeTHElL9FyT1`,
    body: {
      action: 'FEE_RECOVERY_AUTOMATION_LOOP',
      total_pending: 1,
      grade_filter: 'All Grades',
      entries: [
        { id: 'FEE-002', student_id: '00000000-0000-0000-0000-000000000008', student_name: 'Rohan Verma', class: '10th', amount: 15000, due_date: '2026-06-10', status: 'Pending', type: 'Tuition Fee', parent_name: 'Sita Verma', parent_email: 'parent.rohan@email.com' }
      ]
    }
  },
  {
    name: 'Staff Onboarding',
    url: `${BASE}/JocqWwEcVSKvlSKelcgzP`,
    body: {
      employee_id: 'STF-102',
      name: 'Vikram Das',
      role: 'Teacher',
      subject: 'English',
      email: 'vikram.das@greenwood.edu',
      phone: '9990000009',
      basic_salary: 30000,
      department: 'Humanities',
      joining_date: '2026-06-19'
    }
  }
];

async function runTests() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   PUCHO SMS - WEBHOOK TEST SUITE         ║');
  console.log('╚══════════════════════════════════════════╝\n');

  for (const test of TESTS) {
    process.stdout.write(`[TEST] ${test.name} ... `);
    try {
      const res = await fetch(test.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test.body)
      });
      const text = await res.text();
      if (res.ok) {
        console.log(`OK (${res.status})`);
      } else {
        console.log(`FAIL (${res.status}): ${text.substring(0, 80)}`);
      }
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
    }
  }

  console.log('\nDone.');
}

runTests();
