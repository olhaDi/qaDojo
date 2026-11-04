import { Locator, Page } from '@playwright/test';

export class FeedbackLocators {
  readonly name: Locator;
  readonly email: Locator;
  readonly message: Locator;
  readonly subject: Locator;
  readonly attachments: Locator;
  readonly copyMe: Locator;
  readonly submitButton: Locator;
  readonly successHeading: Locator;
  readonly sendAnotherButton: Locator;

  constructor(protected readonly page: Page) {
    this.name = page.getByTestId('contact-name');
    this.email = page.getByTestId('contact-email');
    this.message = page.getByTestId('contact-message');
    this.subject = page.getByTestId('contact-subject');
    this.attachments = page.getByTestId('contact-attachments');
    this.copyMe = page.getByTestId('contact-copy-me');
    this.submitButton = page.getByTestId('contact-submit');
    this.successHeading = page.getByRole('heading', { name: 'Дякуємо! 🎉' });
    this.sendAnotherButton = page.getByRole('button', {
      name: 'Надіслати ще одне',
    });
  }

  priority(value: string): Locator {
    return this.page.getByTestId(`contact-priority-${value}`);
  }

  text(message: string): Locator {
    return this.page.getByText(message);
  }
}
