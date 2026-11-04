import { ArticlesLocators } from './locators/ArticlesLocators';

export class ArticlesPage extends ArticlesLocators {
  async goto() {
    await this.page.goto('/articles');
  }

  async openSignUp() {
    await this.header.signUp.click();
  }

  async openSignIn() {
    await this.header.signIn.click();
  }

  async typeSearch(term: string) {
    await this.searchBox.fill(term);
  }

  async applySearch() {
    await this.applyButton.click();
  }
}
