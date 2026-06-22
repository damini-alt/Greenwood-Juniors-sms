const { test, expect } = require('@playwright/test');

test.describe('Staff Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173');
    });

    test('should login as staff and view staff dashboard', async ({ page }) => {
        await page.click('button:has-text("Login")');
        await expect(page.locator('#loginModal')).toBeVisible();

        await page.selectOption('#loginRole', 'staff');
        await page.fill('#username', 'staff');
        await page.fill('#password', '123');
        await page.click('#loginForm button[type="submit"]');

        await expect(page.locator('#appShell')).toBeVisible();
        await expect(page.locator('#userName')).toHaveText('Teacher Rahul');

        const classesCard = page.locator('main#mainContent .bg-white', { hasText: 'My Classes' }).first();
        await expect(classesCard).toBeVisible();

        const studentsCard = page.locator('main#mainContent .bg-white', { hasText: 'Students' }).first();
        await expect(studentsCard).toBeVisible();
        await expect(studentsCard).toContainText('31');
    });
});
