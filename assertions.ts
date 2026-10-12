import { expect, Page } from 'playwright/test';

export async function checkYouFeedContainsArticle(page: Page, title: string) {
  await page.getByTestId('nav-profile').click();

  await expect(
    page.getByRole('heading', { name: title, exact: true }),
  ).toBeVisible();
}

export async function checkErrorMessages_RequiredDataNotEntered(page: Page) {
  await expect(page.getByText("name обов'язкове поле")).toBeVisible();
  await expect(page.getByText('email некоректний email')).toBeVisible();
  await expect(page.getByText("message обов'язкове поле")).toBeVisible();
}

export async function checkSuccessMessage_RequiredDataEntered(page: Page) {
  await expect(
    page.getByRole('heading', { name: 'Дякуємо! 🎉' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Надіслати ще одне' }),
  ).toBeVisible();
}
