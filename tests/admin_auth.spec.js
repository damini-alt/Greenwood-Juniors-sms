const { test, expect } = require('@playwright/test');

test.describe('Admin Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173');
    });

    test('should login as admin and view dashboard stats', async ({ page }) => {
        await page.click('button:has-text("Login")');
        await expect(page.locator('#loginModal')).toBeVisible();

        await page.selectOption('#loginRole', 'admin');
        await page.fill('#username', 'admin');
        await page.fill('#password', '123');
        await page.click('#loginForm button[type="submit"]');

        await expect(page.locator('#appShell')).toBeVisible();
        await expect(page.locator('#userName')).toHaveText('Supreme Admin');

        // Use more specific selector to avoid strict mode violation (nested divs)
        const studentsCard = page.locator('main#mainContent .bg-white', { hasText: 'Total Students' }).first();
        await expect(studentsCard).toBeVisible();
        await expect(studentsCard).toContainText('31');

        const staffCard = page.locator('main#mainContent .bg-white', { hasText: 'Teaching Staff' }).first();
        await expect(staffCard).toBeVisible();
        await expect(staffCard).toContainText('9');
    });
});
