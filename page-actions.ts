import { Page, expect } from 'playwright/test';
import { generateUser } from './utils';

export async function authorize(page: Page) {
  const user = generateUser();
  await page.getByTestId('auth-username').fill(user.userName);
  await page.getByTestId('auth-email').fill(user.email);
  await page.getByTestId('auth-password').fill(user.password);
  await page.getByTestId('register-confirm-password').fill(user.password);
  await page.getByTestId('register-terms').check();
  await page.getByTestId('auth-submit').click();
  return user;
}

export async function generateArticle(
  page: Page,
  title: string,
  description: string,
  body: string,
) {
  await page.getByTestId('nav-new-article').click();

  await expect(page.getByTestId('editor-title')).toBeVisible();

  await page.getByTestId('editor-title').fill(title);
  await page.getByTestId('editor-description').fill(description);
  await page.getByTestId('editor-body').fill(body);

  await expect(page.getByTestId('editor-submit')).toBeEnabled();
  await page.getByTestId('editor-submit').click();

  await expect(page).toHaveURL(/\/articles\/article\/[^/]+$/);
}

export async function navigateToProfile(page: Page) {
  await page.getByTestId('nav-profile').click();
}
