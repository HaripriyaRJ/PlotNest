import { test, expect } from '@playwright/test';

test.describe('Author Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to Author Dashboard (mocked login if needed)
        await page.goto('/author-dashboard');
    });

    test('Navigation and Views', async ({ page }) => {
        await expect(page.getByText('Welcome back!', { exact: true })).toBeVisible();
        await page.click('text=My Stories');
        await expect(page.getByRole('heading', { name: 'My Stories', exact: true })).toBeVisible();
        await page.click('text=Analytics');
        await expect(page.getByRole('heading', { name: 'Analytics', exact: true })).toBeVisible();
    });

    test('New Story Page elements', async ({ page }) => {
        await page.click('text=New Story');
        await expect(page.getByText('New Story', { exact: true })).toBeVisible();
        await expect(page.getByPlaceholder('Enter your story title')).toBeVisible();
    });

    test('Draft Persistence - Title and Description', async ({ page }) => {
        await page.click('text=New Story');

        // Fill in bits
        const title = 'The Persistence of Memory';
        const description = 'A short story about a scientist who invents a device to record dreams.';

        await page.getByPlaceholder('Enter your story title').fill(title);
        await page.getByPlaceholder('Write a brief description of your story...').fill(description);

        // Reload page
        await page.reload();

        // Must click New Story again because page reload resets activeView to 'dashboard'
        await page.click('text=New Story');

        // Verify persistence
        await expect(page.getByPlaceholder('Enter your story title')).toHaveValue(title);
        await expect(page.getByPlaceholder('Write a brief description of your story...')).toHaveValue(description);
    });

    test('Draft Persistence - Editor Content', async ({ page }) => {
        await page.click('text=New Story');

        const editorSelector = 'div[contenteditable="true"]';
        const content = 'The world was silent, except for the hum of the machine.';

        await page.locator(editorSelector).fill(content);

        // Reload page
        await page.reload();

        // Must click New Story again because page reload resets activeView to 'dashboard'
        await page.click('text=New Story');

        // Verify persistence
        await expect(page.locator(editorSelector)).toHaveText(content);
    });
});
