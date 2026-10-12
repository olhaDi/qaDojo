import { expect, Page } from 'playwright/test';

export async function checkYouFeedContainsArticle(page: Page, title: string) {
  await page.getByTestId('nav-profile').click();

  await expect(
    page.getByRole('heading', { name: title, exact: true }),
  ).toBeVisible();
}
