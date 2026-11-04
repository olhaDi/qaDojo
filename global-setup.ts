import { mkdir } from 'node:fs/promises';
import { chromium, expect, type FullConfig } from '@playwright/test';

export const STORAGE_STATE = 'playwright/.auth/user.json';

export default async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;
  const userName = process.env.TEST_USER_NAME;

  if (!baseURL) {
    throw new Error('Задай BASE_URL у .env');
  }

  if (!email || !password || !userName) {
    throw new Error(
      'Задай TEST_USER_EMAIL, TEST_USER_PASSWORD і TEST_USER_NAME у .env',
    );
  }

  await mkdir('playwright/.auth', { recursive: true });
  const browser = await chromium.launch();

  try {
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();

    await page.goto('/articles');
    await page.getByTestId('nav-sign-in').click();
    await page.getByTestId('auth-email').fill(email);
    await page.getByTestId('auth-password').fill(password);
    await page.getByTestId('auth-submit').click();

    await expect(page.getByTestId('nav-profile')).toContainText(userName);

    await context.storageState({ path: STORAGE_STATE });
  } finally {
    await browser.close();
  }
}
