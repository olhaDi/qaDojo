import { AuthLocators } from './locators/AuthLocators';

export type Credentials = {
  userName: string;
  email: string;
  password: string;
};

export class AuthPage extends AuthLocators {
  async register(user: Credentials) {
    await this.userName.fill(user.userName);
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await this.confirmPassword.fill(user.password);
    await this.terms.check();
    await this.submitButton.click();
  }

  async login(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submitButton.click();
  }
}
