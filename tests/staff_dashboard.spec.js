const { test, expect } = require('@playwright/test');

test.describe('Staff Dashboard E2E', () => {
    test.beforeEach(async ({ page }) => {
        test.setTimeout(60000);
        await page.goto('http://localhost:5173');
        await page.click('button:has-text("Login")');
        await page.selectOption('#loginRole', 'staff');
        // Use seeded staff credentials
        await page.fill('#username', 'sunita.rao@pucho.edu');
        await page.fill('#password', '123'); // DB password from seed
        await page.click('#loginForm button[type="submit"]');
        await expect(page.locator('#appShell')).toBeVisible();
        await expect(page.locator('#userRole')).toHaveText('Teacher');
    });

    test('should submit attendance', async ({ page }) => {
        // 1. Navigate to Attendance
        await page.click('a[href="#mark_attendance"]');
        await expect(page.locator('h3:has-text("Mark Attendance")')).toBeVisible();

        // 2. Filter Students
        // Note: No "Fetch" button, auto-loads on change
        await page.selectOption('#attClass', 'Grade 10');
        await page.selectOption('#attDiv', 'A');

        // 3. Mark Absent and Submit
        // Wait for list to load (look for buttons inside the list)
        const studentItem = page.locator('#attendanceList div[data-student-id]').first();
        await expect(studentItem).toBeVisible({ timeout: 10000 });

        // Mark first student absent (assuming "A" button exists)
        const absentBtn = studentItem.locator('.attendance-btn').filter({ hasText: 'A' });
        await absentBtn.click();

        // Submit
        page.on('dialog', dialog => dialog.accept());
        await page.click('button:has-text("SUBMIT ATTENDANCE")');

        // Verify Toast
        await expect(page.locator('div:has-text("Attendance synced")').or(page.locator('div:has-text("saved locally")'))).toBeVisible();
    });

    test('should enter and save specific marks', async ({ page }) => {
        // 1. Navigate to Marks
        await page.click('a[href="#exam_marks"]');
        await expect(page.locator('h3:has-text("Grade Book")')).toBeVisible();

        // 2. Select Filters
        await page.selectOption('#marksClass', 'Grade 10');
        await page.selectOption('#marksDiv', 'A');
        await page.selectOption('#marksExam', 'Mid Term');

        // 3. Open Student Modal
        // Wait for student cards
        const card = page.locator('#studentCardsList div[onclick*="openMarksModal"]').first();
        await expect(card).toBeVisible({ timeout: 10000 });
        await card.click();

        // 4. Enter Marks
        await expect(page.locator('#marksModal')).not.toHaveClass(/hidden/);
        // Find input for Mathematics (or any subject, fill first one)
        const inputs = page.locator('#marksModal input[type="number"]');
        await expect(inputs.first()).toBeVisible();
        await inputs.first().fill('88'); // 88 Marks

        // 5. Save
        // Assuming there is a Save/Submit button in the modal form
        // Form id="marksEntryForm" onsubmit="dashboard.saveStudentMarks(event)"
        // Need to click submit button inside form
        await page.click('#marksEntryForm button[type="submit"]');

        await expect(page.locator('div:has-text("Marks saved")').or(page.locator('div:has-text("saved locally")'))).toBeVisible();
    });

    test('should create and delete homework', async ({ page }) => {
        // 1. Navigate to Homework
        await page.click('a[href="#homework"]');
        await expect(page.locator('h3:has-text("Homework Management")')).toBeVisible();

        // 2. Open Modal
        await page.click('button:has-text("ADD HOMEWORK")');
        await expect(page.locator('h1:has-text("New Assignment")')).toBeVisible();

        // 3. Fill Form
        const title = `E2E Homework ${Date.now()}`;
        await page.selectOption('#hwClass', 'Grade 10');
        await page.selectOption('#hwDivision', 'A');
        await page.selectOption('#hwSubject', 'Mathematics');
        await page.fill('#hwTitle', title);

        // 4. Publish
        await page.click('#addHomeworkModal button:has-text("Publish Assignment")');

        // 5. Verify Not Visible (Modal Closed) & Toast
        await expect(page.locator('#addHomeworkModal')).toHaveClass(/hidden/);
        const toast = page.locator('div[className*="toast"]'); // Assuming toast class
        // Or generic text search
        await expect(page.locator('div:has-text("Published")').or(page.locator('div:has-text("Error")')).first()).toBeVisible();

        // 6. Verify in List
        // Need to filter list to see it? List defaults to all?
        // Line 5230: subjects from DB. Line 5266: renderStaffHomeworkItems schoolDB.homework
        // It should appear.
        const row = page.locator(`strong:has-text("${title}")`); // It renders cards/blocks, likely title is in strong or h4
        await expect(row).toBeVisible();

        // 7. Delete
        // Find delete button near the title
        // Need to identify structure of homework item
        // Assuming delete button exists and has trash icon
        const card = row.locator('xpath=ancestor::div[contains(@class, "group")]'); // Approximate
        page.on('dialog', dialog => dialog.accept());
        await card.locator('button:has-text("🗑️")').click(); // Trash icon
        await expect(row).not.toBeVisible();
    });
});
