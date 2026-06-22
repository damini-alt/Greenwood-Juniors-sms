const { test, expect } = require('@playwright/test');

test.describe('Parent Dashboard E2E', () => {

    test.beforeEach(async ({ page }) => {
        // Capture browser logs
        page.on('console', msg => {
            if (msg.text().startsWith('TEST_LOG')) {
                console.log(`BROWSER [${msg.type()}]: ${msg.text()}`);
            }
        });

        await page.goto('http://localhost:5174');

        await page.addInitScript(() => {
            window.addEventListener('load', () => {
                if (window.dashboard) {
                    window.dashboard.syncDB = async function (silent) {
                        console.log('TEST_LOG: Mocked syncDB called');
                        return Promise.resolve();
                    };
                }
            });
        });

        await page.click('button:has-text("Login")');
        await expect(page.locator('#loginModal')).toBeVisible();

        await page.selectOption('#loginRole', 'parent');
        await page.fill('#username', 'parent');
        await page.fill('#password', '123');
        await page.click('#authSubmit');

        await expect(page.locator('#appShell')).toBeVisible({ timeout: 10000 });

        await page.evaluate(() => {
            const parentName = 'Vikram Das';
            window.schoolDB.students = [];
            window.schoolDB.fees = [];
            window.schoolDB.results = [];
            window.schoolDB.homework = [];

            const testStudent = {
                id: 'test-student-1',
                db_id: 'test-student-1',
                name: 'Rohan Das',
                class: 'Grade 10',
                division: 'A',
                roll_no: 1,
                guardian_name: parentName,
                parent_id: 'static-parent-id'
            };

            window.schoolDB.students.push(testStudent);

            window.schoolDB.fees.push({
                id: 'fee-1',
                student_id: 'test-student-1',
                student: 'Rohan Das',
                amount: 5000,
                status: 'Pending',
                type: 'Term 2 Fee',
                dueDate: '2025-03-31',
                date: '2025-01-01'
            });

            window.schoolDB.results.push({
                id: 'res-1',
                student_id: 'test-student-1',
                student_name: 'Rohan Das',
                subject: 'Mathematics',
                marks: 95,
                total: 100,
                exam: 'Mid Term',
                grade: 'A+'
            });

            window.schoolDB.homework.push({
                id: 'hw-1',
                title: 'Algebra Worksheet',
                subject: 'Mathematics',
                class_grade: 'Grade 10',
                division: 'A',
                dueDate: '2025-02-10',
                description: 'Solve page 10-12',
                assignedBy: 'Mrs. Rao'
            });
        });
    });

    test('should display Fees section with pending dues', async ({ page }) => {
        await page.click('a[href="#parent_fees"]');
        // Search globally for text to be safe
        await expect(page.locator('text=Outstanding Dues').first()).toBeVisible();
        await expect(page.locator('text=Term 2 Fee - Rohan Das')).toBeVisible();

        await page.click('button:has-text("Pay Now")');
        await expect(page.locator('text=Redirecting to Payment Gateway...').first()).toBeAttached();
    });

    test('should display Results section with student report', async ({ page }) => {
        await page.click('a[href="#parent_results"]');

        // Wait specifically for student data
        await expect(page.locator('text=Rohan Das')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('text=Mathematics')).toBeVisible();
        await expect(page.locator('text=95/100')).toBeVisible();
    });

    test('should display Homework section and preview', async ({ page }) => {
        await page.click('a[href="#parent_homework"]');
        await expect(page.locator('text=Homework & Assignments').first()).toBeVisible();
        await expect(page.locator('h4:has-text("Algebra Worksheet")')).toBeVisible();

        await page.click('h4:has-text("Algebra Worksheet")');
        await expect(page.locator('#hwPreviewModal')).toBeVisible();
        await expect(page.locator('text=Solve page 10-12')).toBeVisible();
    });

});
