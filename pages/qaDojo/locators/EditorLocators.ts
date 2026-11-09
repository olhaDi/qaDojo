import { Locator, Page } from '@playwright/test';
import { Header } from '../components/Header';

export class EditorLocators {
  readonly header: Header;
  readonly title: Locator;
  readonly description: Locator;
  readonly body: Locator;
  readonly submitButton: Locator;

  constructor(protected readonly page: Page) {
    this.header = new Header(page);
    this.title = page.getByTestId('editor-title');
    this.description = page.getByTestId('editor-description');
    this.body = page.getByTestId('editor-body');
    this.submitButton = page.getByTestId('editor-submit');
  }
}
