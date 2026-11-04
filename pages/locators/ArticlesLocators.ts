import { Locator, Page } from '@playwright/test';
import { Header } from '../components/Header';

export class ArticlesLocators {
  readonly header: Header;
  readonly articleCards: Locator;
  readonly searchBox: Locator;
  readonly applyButton: Locator;
  readonly counter: Locator;

  constructor(protected readonly page: Page) {
    this.header = new Header(page);
    this.articleCards = page.getByRole('article');
    this.searchBox = page.getByPlaceholder('Search headlines…');
    this.applyButton = page.getByRole('button', { name: 'Apply' });
    this.counter = page.getByTestId('feed-article-count');
  }

  articleHeading(title: string): Locator {
    return this.articleCards.getByRole('heading', { name: title });
  }
}
