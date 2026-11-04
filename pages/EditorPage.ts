import { expect } from '@playwright/test';
import { EditorLocators } from './locators/EditorLocators';

export class EditorPage extends EditorLocators {
  async createArticle(title: string, description: string, body: string) {
    await this.header.newArticle.click();
    await expect(this.title).toBeVisible();

    await this.title.fill(title);
    await this.description.fill(description);
    await this.body.fill(body);

    await expect(this.submitButton).toBeEnabled();
    await this.submitButton.click();
    await expect(this.page).toHaveURL(/\/articles\/article\/[^/]+$/);
  }
}
