import { test, expect } from '@playwright/test';
import { ArticlesPage } from '../pages/ArticlesPage';
import { AuthPage } from '../pages/AuthPage';
import { EditorPage } from '../pages/EditorPage';
import { ProfilePage } from '../pages/ProfilePage';
import { generateUser, getRandomString } from '../utils';

test.use({ storageState: { cookies: [], origins: [] } }); // registers a new user, so start logged out

test.describe(
  'Generated article is shown in Your feed',
  { tag: '@reg' },
  () => {
    test.beforeEach(async ({ page }) => {
      const articlesPage = new ArticlesPage(page);
      await articlesPage.goto();
      await articlesPage.openSignUp();
    });

    test('Created articles are shown in Your feed', async ({ page }) => {
      const authPage = new AuthPage(page);
      const editorPage = new EditorPage(page);
      const profilePage = new ProfilePage(page);

      await authPage.register(generateUser());
      const articleTitles: string[] = [];

      for (let i = 0; i < 10; i++) {
        const title = getRandomString(12);
        await editorPage.createArticle(
          title,
          getRandomString(20),
          getRandomString(50),
        );
        articleTitles.push(title);
      }
      for (const title of articleTitles) {
        await profilePage.open();
        await expect(profilePage.articleHeading(title)).toBeVisible();
      }
    });
  },
);
