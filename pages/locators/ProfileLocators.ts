import { Locator, Page } from '@playwright/test';
import { Header } from '../components/Header';

export class ProfileLocators {
  readonly header: Header;

  constructor(protected readonly page: Page) {
    this.header = new Header(page);
  }

  articleHeading(title: string): Locator {
    return this.page.getByRole('heading', { name: title, exact: true });
  }
}
