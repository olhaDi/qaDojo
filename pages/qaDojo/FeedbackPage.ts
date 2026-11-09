import { expect } from '@playwright/test';
import { getUserDataForFeedback } from '../../userDataForFeedback';
import { FeedbackLocators } from './locators/FeedbackLocators';

export type FeedbackData = ReturnType<typeof getUserDataForFeedback>;

export class FeedbackPage extends FeedbackLocators {
  async goto() {
    await this.page.goto('/articles/contact');
  }

  async fillRequiredFields(data: FeedbackData) {
    await expect(this.name).toBeVisible();
    await this.name.fill(data.name);
    await expect(this.email).toBeVisible();
    await this.email.fill(data.email);
    await expect(this.message).toBeVisible();
    await this.message.fill(data.message);
  }

  async fillOptionalFields(data: FeedbackData) {
    await expect(this.subject).toBeVisible();
    if (data.subject !== 'Загальне питання') {
      await this.subject.selectOption('feature');
    }
    if (data.priority !== 'medium' && data.priority !== '') {
      await this.priority(data.priority).check();
    }
    if (data.attachment !== '') {
      await this.attachments.setInputFiles(data.attachment);
    }
    if (data.copyMe) {
      await this.copyMe.check();
    }
  }

  async submit() {
    await this.submitButton.click();
  }
}
