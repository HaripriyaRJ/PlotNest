import { test, expect } from '@playwright/test';

test.describe('Authentication and Home Page', () => {
    test('Home page should load correctly', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/PlotNest/);
        await expect(page.getByText('PlotNest', { exact: true })).toBeVisible();
    });

    test('Navigation to Authors Signup via Login Page', async ({ page }) => {
        await page.goto('/author-login');
        await page.click('text=Join the circle');
        await expect(page).toHaveURL(/.*author-signup/);
    });
});
