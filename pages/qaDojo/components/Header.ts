import { Locator, Page } from '@playwright/test';

export class Header {
  readonly signIn: Locator;
  readonly signUp: Locator;
  readonly profile: Locator;
  readonly newArticle: Locator;

  constructor(page: Page) {
    this.signIn = page.getByTestId('nav-sign-in');
    this.signUp = page.getByTestId('nav-sign-up');
    this.profile = page.getByTestId('nav-profile');
    this.newArticle = page.getByTestId('nav-new-article');
  }
}
