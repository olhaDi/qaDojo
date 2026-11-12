import { test, expect } from '@playwright/test';
import { ArticlesPage } from '../../pages/qaDojo/ArticlesPage';

// No login steps here: the session comes from global-setup.ts through
// use.storageState in playwright.config.ts.
test('User is authorized from the saved storage state', async ({ page }) => {
  const articlesPage = new ArticlesPage(page);

  await articlesPage.goto();

  await expect(articlesPage.header.profile).toContainText(
    process.env.TEST_USER_NAME!,
  );
  await expect(articlesPage.header.newArticle).toBeVisible();
  await expect(articlesPage.header.signIn).toBeHidden();
});
