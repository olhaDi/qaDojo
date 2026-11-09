import { ProfileLocators } from './locators/ProfileLocators';

export class ProfilePage extends ProfileLocators {
  async open() {
    await this.header.profile.click();
  }
}
