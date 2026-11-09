// spec: specs/article-search.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { ArticlesPage } from '../../pages/qaDojo/ArticlesPage';

test.describe('Article search', () => {
  test('should-filter-articles-by-title-on-apply', async ({ page }) => {
    const articlesPage = new ArticlesPage(page);

    // 1. Open the articles page and note the counter.
    await articlesPage.goto();
    // The total grows as other specs create articles, so read it instead of hardcoding.
    // The counter briefly shows "0 articles" while the feed loads, so wait for a non-zero value.
    await expect(articlesPage.counter).toHaveText(/^[1-9]\d* articles?$/);
    const initialCounter = (await articlesPage.counter.textContent())!;
    await expect(articlesPage.articleCards.first()).toBeVisible();
    const initialCards = await articlesPage.articleCards.count();

    // 2. Type "sleep" into the search box without clicking anything else
    await articlesPage.typeSearch('sleep');
    await expect(articlesPage.searchBox).toHaveValue('sleep');
    await expect(articlesPage.articleCards).toHaveCount(initialCards);
    await expect(articlesPage.counter).toHaveText(initialCounter);

    // 3. Click "Apply"
    await articlesPage.applySearch();
    await expect(articlesPage.counter).toHaveText('1 article');
    await expect(articlesPage.articleCards).toHaveCount(1);
    await expect(
      articlesPage.articleHeading('Очікування у WebdriverIO без зайвих sleep'),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/articles$/);
    await expect(articlesPage.searchBox).toHaveValue('sleep');
  });
});
