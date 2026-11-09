import { PortalLocators } from './locators/PortalLocators';

export class PortalPage extends PortalLocators {
  async goto() {
    await this.page.goto('/');
  }

  async openArticles() {
    await this.homeLink.click();
    await this.articlesModule.click();
  }
}
