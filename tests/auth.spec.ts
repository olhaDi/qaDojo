import { test, expect } from '@playwright/test';
import { ArticlesPage } from '../pages/qaDojo/ArticlesPage';
import { AuthPage } from '../pages/qaDojo/AuthPage';
import { generateUser, getRandomString } from '../utils';

test.use({ storageState: { cookies: [], origins: [] } }); // these tests need a logged-out user

test.describe('Registration', { tag: '@reg' }, () => {
  let articlesPage: ArticlesPage;
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);
    authPage = new AuthPage(page);
    await articlesPage.goto();
    await articlesPage.openSignUp();
  });

  test('User can register with valid credentials', async () => {
    const user = generateUser();
    await authPage.register(user);
    await expect(authPage.header.profile).toContainText(user.userName);
  });

  test('User with duplicated credentials is not registered', async () => {
    await authPage.register({
      userName: process.env.TEST_USER_NAME!,
      email: process.env.TEST_USER_EMAIL!,
      password: process.env.TEST_USER_PASSWORD!,
    });
    await expect(authPage.text('body email або username')).toBeVisible();
  });

  test('User with invalid password is not registered', async () => {
    const user = generateUser();
    await authPage.register({ ...user, password: getRandomString(3) });
    await expect(authPage.errorMessages.getByText('password')).toBeVisible();
  });
});

test.describe('Login', { tag: '@login' }, () => {
  let articlesPage: ArticlesPage;
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);
    authPage = new AuthPage(page);
    await articlesPage.goto();
    await articlesPage.openSignIn();
  });

  test('User can login with valid credentials', async () => {
    await authPage.login(
      process.env.TEST_USER_EMAIL!,
      process.env.TEST_USER_PASSWORD!,
    );
    await expect(authPage.header.profile).toContainText(
      process.env.TEST_USER_NAME!,
    );
  });

  test('User with invalid password can not login', async () => {
    await authPage.login(process.env.TEST_USER_EMAIL!, getRandomString(3));
    await expect(authPage.text('email or password неправильні')).toBeVisible();
    await expect(authPage.header.signIn).toBeVisible();
  });

  test('Not existing user can not login', async () => {
    await authPage.login(`${getRandomString(6)}@test.ua`, getRandomString(6));
    await expect(authPage.text('email or password неправильні')).toBeVisible();
    await expect(authPage.header.signIn).toBeVisible();
  });
});
