import { test, expect } from '@playwright/test';
import { ZaraHomePage } from '../../pages/zara/ZaraHomePage';

// Zara blocks headless Chromium ("Access Denied"), so run with a visible browser
test.use({ headless: false });
// Start from a clean context: no saved login and no accepted cookie consent
test.use({ storageState: { cookies: [], origins: [] } });

test('zara, accepted cookies can be modified', async ({ page }) => {
  const zaraHomePage = new ZaraHomePage(page);

  await zaraHomePage.goto();
  await zaraHomePage.acceptAllCookies();
  await expect(zaraHomePage.acceptAllCookiesButton).toBeHidden();
  await zaraHomePage.continueOnSpain();

  const cookies = await zaraHomePage.getCookies();
  expect(cookies.length).toBeGreaterThan(0);

  const original = cookies[0];
  const newValue = `homework-updated-${Date.now()}`;
  expect(original.value).not.toBe(newValue);

  await zaraHomePage.addCookie({ ...original, value: newValue });

  const cookiesAfterUpdate = await zaraHomePage.getCookies();
  const updated = cookiesAfterUpdate.find(
    (cookie) =>
      cookie.name === original.name &&
      cookie.domain === original.domain &&
      cookie.path === original.path,
  );

  expect(updated).toBeDefined();
  expect(updated!.value).toBe(newValue);
});
