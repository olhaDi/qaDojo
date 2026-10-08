import { test } from '@playwright/test';
import { authorize, generateArticle, navigateToProfile } from '../page-actions';
import { getRandomString } from '../utils';
import { checkYouFeedContainsArticle } from '../assertions';

test.describe(
  'Generated article is shown in Your feed',
  { tag: '@reg' },
  () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/articles');
      await page.getByTestId('nav-sign-up').click();
    });

    test('Created articles are shown in Your feed', async ({ page }) => {
      await authorize(page);
      const articleTitles: string[] = [];

      for (let i = 0; i < 10; i++) {
        const title = getRandomString(12);
        const description = getRandomString(20);
        const body = getRandomString(50);
        await generateArticle(page, title, description, body);
        articleTitles.push(title);
      }

      //   await navigateToProfile(page);
      for (const title of articleTitles) {
        await checkYouFeedContainsArticle(page, title);
      }
      //   const title = getRandomString(12);
      //   await generateArticle(page, title);
      //   await navigateToProfile(page, user.userName);
      //   await checkYouFeedContainsArticle(page, title);
    });
  },
);
