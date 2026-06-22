const { test, expect } = require('@playwright/test');

test.describe('Parent Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173');
    });

    test('should login as parent and view parent dashboard', async ({ page }) => {
        await page.click('button:has-text("Login")');
        await expect(page.locator('#loginModal')).toBeVisible();

        await page.selectOption('#loginRole', 'parent');
        await page.fill('#username', 'parent');
        await page.fill('#password', '123');
        await page.click('#loginForm button[type="submit"]');

        await expect(page.locator('#appShell')).toBeVisible();
        await expect(page.locator('#userName')).toHaveText('Vikram Das');

        const attendanceCard = page.locator('main#mainContent .bg-white', { hasText: 'Attendance' }).first();
        await expect(attendanceCard).toBeVisible();

        const assignmentsCard = page.locator('main#mainContent .bg-white', { hasText: 'Assignments' }).first();
        await expect(assignmentsCard).toBeVisible();
    });
});
