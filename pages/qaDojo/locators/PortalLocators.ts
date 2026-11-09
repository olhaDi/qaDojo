import { Locator, Page } from '@playwright/test';

export class PortalLocators {
  readonly homeLink: Locator;
  readonly articlesModule: Locator;

  constructor(protected readonly page: Page) {
    this.homeLink = page.getByRole('link', { name: 'QA Dojo, головна' });
    this.articlesModule = page.getByTestId('portal-module-articles');
  }
}
