import { test, expect } from '@playwright/test';
import { ArticlesPage } from '../pages/ArticlesPage';
import { PortalPage } from '../pages/PortalPage';

// Global storageState logs everyone in, so start this test as a guest
test.use({ storageState: { cookies: [], origins: [] } });

test('Guest is not logged in after opening the site', async ({ page }) => {
  const portalPage = new PortalPage(page);
  const articlesPage = new ArticlesPage(page);

  await portalPage.goto();
  await portalPage.openArticles();
  await expect(articlesPage.header.signIn).toBeVisible();
  await expect(articlesPage.header.signUp).toBeVisible();
  await expect(articlesPage.header.profile).toBeHidden();
});
