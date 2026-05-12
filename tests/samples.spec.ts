import { test, expect } from '@playwright/test';

const storySamples = [
    {
        title: 'The Whispering Woods',
        genre: 'Horror',
        description: 'An ancient forest that remembers every soul that entered it.',
        tags: ['Ghost', 'Mystery', 'Dark'],
        content: 'The trees didn\'t just sway; they leaned in. Sarah could hear the faint murmur of voices she once knew.'
    },
    {
        title: 'Neon Odyssey',
        genre: 'Science fiction',
        description: 'A cybernetic journey through the last surviving city on Earth.',
        tags: ['Cyberpunk', 'Future', 'Tech'],
        content: 'The rain in Sector 7 tasted like copper and ozone. Jax adjusted his HUD and stepped into the neon-lit alley.'
    },
    {
        title: 'The Golden Compassion',
        genre: 'Inspirational',
        description: 'A heartwarming tale of a village that learned the value of kindness.',
        tags: ['Heartfelt', 'Village', 'Kindness'],
        content: 'Old Man Miller hadn\'t spoken to anyone in years, until a small child offered him a single golden apple.'
    }
];

test.describe('Data-Driven Story Samples', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/author-dashboard');
        await page.click('text=New Story');
    });

    for (const sample of storySamples) {
        test(`Testing Sample: ${sample.title}`, async ({ page }) => {
            // Fill Title
            await page.getByPlaceholder('Enter your story title').fill(sample.title);

            // Fill Description
            await page.getByPlaceholder('Write a brief description of your story...').fill(sample.description);

            // Select Genre
            await page.locator('select').first().selectOption(sample.genre);

            // Add Tags
            const tagInput = page.locator('input[placeholder="Press Enter"]');
            for (const tag of sample.tags) {
                await page.click('button:has(span.material-symbols-outlined:text("add"))');
                await tagInput.fill(tag);
                await tagInput.press('Enter');
            }

            // Fill Content
            const editor = page.locator('div[contenteditable="true"]');
            await editor.fill(sample.content);

            // Verify inputs
            await expect(page.getByPlaceholder('Enter your story title')).toHaveValue(sample.title);
            await expect(page.getByPlaceholder('Write a brief description of your story...')).toHaveValue(sample.description);

            // Verify word count (approximate check)
            const expectedWords = sample.content.trim().split(/\s+/).length;
            await expect(page.getByText(`${expectedWords} Words`, { exact: true })).toBeVisible();

            // Manual Save Draft check
            page.on('dialog', async dialog => {
                expect(dialog.message()).toBe('Draft saved successfully!');
                await dialog.accept();
            });
            await page.click('text=Save Draft');
        });
    }
});
