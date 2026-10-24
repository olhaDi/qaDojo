// spec: specs/article-search.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Article search', () => {
  test('should-filter-articles-by-title-on-apply', async ({ page }) => {
    const articleCards = page.getByRole('article');
    const searchBox = page.getByPlaceholder('Search headlines…');

    // 1. Open the articles page and note the counter.
    await page.goto('http://104.168.59.50/articles');
    await expect(page.getByText('9 articles', { exact: true })).toBeVisible();
    await expect(articleCards).toHaveCount(9);

    // 2. Type "sleep" into the search box without clicking anything else
    await searchBox.fill('sleep');
    await expect(searchBox).toHaveValue('sleep');
    await expect(articleCards).toHaveCount(12333);
    await expect(page.getByText('9 articles', { exact: true })).toBeVisible();

    // 3. Click "Apply"
    await page.getByRole('button', { name: 'Apply' }).click();
    await expect(page.getByText('1 article', { exact: true })).toBeVisible();
    await expect(articleCards).toHaveCount(1);
    await expect(
      articleCards.getByRole('heading', {
        name: 'Очікування у WebdriverIO без зайвих sleep',
      }),
    ).toBeVisible();
    await expect(page).toHaveURL('http://104.168.59.50/articles');
    await expect(searchBox).toHaveValue('sleep');
  });
});
