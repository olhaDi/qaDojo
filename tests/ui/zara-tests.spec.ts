import { test } from '@playwright/test';
import { ZaraHomePage } from '../../pages/zara/ZaraHomePage';

test.use({ headless: false });

test('zara, cookies', async ({ page }) => {
  const zaraHomePage = new ZaraHomePage(page);

  await zaraHomePage.goto();
  await zaraHomePage.acceptAllCookies();
  await zaraHomePage.continueOnSpain();

  const contextFromFixture = await zaraHomePage.getCookies();
  await zaraHomePage.addCookie({
    name: 'oliaTestCookie',
    value: 'testValue',
    domain: '.zara.com',
    path: '/',
  });

  console.log('contextFromFixture', contextFromFixture);
  const cookiesAfterAdd = await zaraHomePage.getCookies();
  console.log('cookiesAfterAdd', cookiesAfterAdd);

  const storageState = await zaraHomePage.saveStorageState(
    'playwright/.auth/zara.json',
  );
  console.log('storageState', storageState);
});
