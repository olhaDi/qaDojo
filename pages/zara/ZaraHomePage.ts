import { BrowserContext } from '@playwright/test';
import { ZaraHomeLocators } from './locators/ZaraHomeLocators';

type CookieToAdd = Parameters<BrowserContext['addCookies']>[0][number];

export class ZaraHomePage extends ZaraHomeLocators {
  async goto() {
    await this.page.goto('https://www.zara.com/es/en/');
  }

  async acceptAllCookies() {
    await this.acceptAllCookiesButton.click();
  }

  async continueOnSpain() {
    await this.continueOnSpainButton.click();
  }

  async getCookies() {
    return this.page.context().cookies();
  }

  async addCookie(cookie: CookieToAdd) {
    await this.page.context().addCookies([cookie]);
  }

  async saveStorageState(path: string) {
    return this.page.context().storageState({ path });
  }
}
