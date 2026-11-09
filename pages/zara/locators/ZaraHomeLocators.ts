import { Locator, Page } from '@playwright/test';

export class ZaraHomeLocators {
  readonly acceptAllCookiesButton: Locator;
  readonly continueOnSpainButton: Locator;

  constructor(protected readonly page: Page) {
    this.acceptAllCookiesButton = page.getByRole('button', {
      name: 'Accept All Cookies',
    });
    this.continueOnSpainButton = page.getByRole('button', {
      name: 'Yes, continue on Spain',
    });
  }
}
