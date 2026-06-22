const { test, expect } = require('@playwright/test');

test.describe('Admin Student CRUD', () => {
    test.beforeEach(async ({ page }) => {
        // Increase timeout for DB sync
        test.setTimeout(60000);
        await page.goto('http://localhost:5173');
        await page.click('button:has-text("Login")');
        await page.selectOption('#loginRole', 'admin');
        await page.fill('#username', 'admin');
        await page.fill('#password', '123');
        await page.click('#loginForm button[type="submit"]');
        await expect(page.locator('#appShell')).toBeVisible();
    });

    test('should create, edit, and delete a student', async ({ page }) => {
        // 1. Navigate to Students
        await page.click('a[href="#students"]');
        await expect(page.locator('h3:has-text("Student Database")')).toBeVisible();

        // 2. Create Student
        await page.click('button:has-text("+ ADD")');
        await expect(page.locator('#studentModal')).toBeVisible();

        const uniqueLastName = 'E2E-' + Math.floor(Math.random() * 100000);
        await page.fill('#stdFirstName', 'Playwright');
        await page.fill('#stdLastName', uniqueLastName);
        await page.fill('#stdDob', '2015-01-01');
        await page.selectOption('#stdGender', 'Male');
        await page.selectOption('#stdClass', 'Grade 10');
        await page.selectOption('#stdDiv', 'A');
        await page.fill('#stdRoll', '777');
        await page.fill('#stdGuardian', 'Bot Parent');
        await page.fill('#stdPhone', '9998887776');

        await page.click('#studentForm button[type="submit"]');

        // Wait for the new student to appear in the table
        // Using a longer timeout because of cloud sync
        const studentRow = page.locator('tr', { hasText: uniqueLastName });
        await expect(studentRow).toBeVisible({ timeout: 15000 });
        await expect(studentRow).toContainText('Playwright');

        // 3. Edit Student
        await studentRow.locator('button:has-text("✏️")').click();
        await expect(page.locator('#studentModal h1')).toHaveText('Edit Student Profile');

        await page.fill('#stdFirstName', 'PlaywrightEdited');
        await page.click('#studentForm button[type="submit"]');

        // Verify updated name
        await expect(studentRow).toContainText('PlaywrightEdited', { timeout: 15000 });

        // 4. Delete Student
        page.on('dialog', dialog => dialog.accept());
        await studentRow.locator('button:has-text("🗑️")').click();

        // Verify removal
        await expect(studentRow).not.toBeVisible({ timeout: 15000 });
    });
});
