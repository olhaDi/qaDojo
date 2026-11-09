import { Locator, Page } from '@playwright/test';
import { Header } from '../components/Header';

export class AuthLocators {
  readonly header: Header;
  readonly userName: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly confirmPassword: Locator;
  readonly terms: Locator;
  readonly submitButton: Locator;
  readonly errorMessages: Locator;

  constructor(protected readonly page: Page) {
    this.header = new Header(page);
    this.userName = page.getByTestId('auth-username');
    this.email = page.getByTestId('auth-email');
    this.password = page.getByTestId('auth-password');
    this.confirmPassword = page.getByTestId('register-confirm-password');
    this.terms = page.getByTestId('register-terms');
    this.submitButton = page.getByTestId('auth-submit');
    this.errorMessages = page.getByTestId('error-messages');
  }

  text(message: string): Locator {
    return this.page.getByText(message);
  }
}
