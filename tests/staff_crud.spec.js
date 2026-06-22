const { test, expect } = require('@playwright/test');

test.describe('Admin Staff CRUD', () => {
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
        await expect(page.locator('#appShell')).toBeVisible();
    });

    test('should create, edit, and delete a staff member', async ({ page }) => {
        // 1. Navigate to Staff
        await page.click('a[href="#staff"]');
        await expect(page.locator('h3:has-text("Staff Directory")')).toBeVisible();

        // 2. Create Staff
        await page.click('button:has-text("Add Staff")');
        // Note: Check if button text is 'Add Staff' or similar in dashboard.js template. 
        // Based on analysis, likely "+ ADD" or similar generic button, let's target by partial text or checking the modal trigger.
        // Actually, looking at previous dashboard.js generic filter code:
        // <button onclick="dashboard.showAddStaffModal()" ... >+ ADD STAFF</button> ?
        // I need to be careful with selectors.
        // Let's assume there is an Add button. If not found, I'll debug.
        // Re-checking dashboard.js generic render...
        // Wait, dashboard.js doesn't seem to have a generic "renderStaff" with an Add button in the code I viewed earlier?
        // Ah, `dashboard.staff` function was not in the `view_file` range 1-1400 or 2000-2800? 
        // Actually, I saw `dashboard.students` in 2000-2800. `dashboard.staff` might be there too.

        // I'll assume standard "+ ADD" or similar, but to be safe, let's look for the button that calls showAddStaffModal or similar.
        // Or simply text "ADD" or "Add New".

        // Let's try to find the button by text "+ ADD" which is common in this app.
        // Debug: Check if modal is already visible
        const modal = page.locator('#staffModal');
        if (await modal.isVisible()) {
            console.log("Modal was already visible, closing it to ensure clean state");
            await page.evaluate(() => document.getElementById('staffModal').classList.add('hidden'));
        }

        // 2. Create Staff
        const addButton = page.locator('button:has-text("+ ADD STAFF")');
        if (await addButton.isVisible()) {
            await addButton.click({ force: true });
        } else {
            // Fallback
            await page.click('button:has-text("+ ADD")', { force: true });
        }

        await expect(page.locator('#staffModal')).toBeVisible();

        const uniqueName = 'Staff-E2E-' + Math.floor(Math.random() * 10000);
        const uniqueEmail = `staff.e2e.${Date.now()}@pucho.edu`;

        await page.fill('#staffName', uniqueName);
        await page.fill('#staffEmail', uniqueEmail);
        await page.fill('#staffPhone', '9876543210');
        await page.selectOption('#staffDept', 'Science');
        await page.selectOption('#staffRole', 'Teacher');
        await page.selectOption('#staffClass', '10th');
        await page.selectOption('#staffDivision', 'A');
        await page.fill('#staffSubject', 'Physics');
        await page.fill('#staffQual', 'M.Sc Physics');
        await page.fill('#staffPass', 'TestPass123!');
        // staffExp is hidden in UI, skipping fill

        // Date might need specific format handling
        await page.fill('#staffJoiningDate', '2023-06-01');

        await page.click('#staffForm button[type="submit"]');

        // Wait for row
        const staffRow = page.locator('tr', { hasText: uniqueName });
        await expect(staffRow).toBeVisible({ timeout: 15000 });
        await expect(staffRow).toContainText('Physics');

        // 3. Edit Staff
        await staffRow.locator('button:has-text("✏️")').click();
        await expect(page.locator('#staffModal h1')).toHaveText('Edit Staff Member');

        await page.fill('#staffSubject', 'Advanced Physics');
        await page.click('#staffForm button[type="submit"]');

        // Verify update
        await expect(staffRow).toContainText('Advanced Physics', { timeout: 15000 });

        // 4. Delete Staff
        page.on('dialog', dialog => dialog.accept());
        await staffRow.locator('button:has-text("🗑️")').click();

        // Verify removal
        await expect(staffRow).not.toBeVisible({ timeout: 15000 });
    });
});
