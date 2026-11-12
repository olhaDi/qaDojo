import { test, expect } from '../fixtures/base-fixture';
import { faker } from '@faker-js/faker';
import { UserController } from '../../controllers/UserController';
// API tests don't need a browser session, so skip the shared storageState.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('API Tests', () => {
  let token: string;

  test('create user', async ({ playwright }) => {
    const api = await playwright.request.newContext({
      baseURL: process.env.BASE_URL,
    });
    const email = faker.internet.email();
    const userName = faker.internet.username();
    const password = faker.internet.password({ length: 10 });

    const userController = new UserController(api);
    const { user: userData } = await userController.createUser({
      user: { username: userName, email, password },
    });
    token = userData.token;
    expect(userData.email).toBe(email);
    expect(userData.username).toBe(userName);
    await api.dispose();
  });

  test('login user with token', async ({
    playwright,
    context,
    page,
    login,
  }) => {
    await page.goto('/articles/editor');
    await expect(page.getByTestId('nav-profile')).toContainText(login.userName);
  });

  test('add avatar to user profile', async ({
    playwright,
    context,
    page,
    login,
  }) => {
    await page.goto(`/articles/profile/${login.userName}`);
    await page.getByTestId('nav-profile').click();
    await page.getByRole('link', { name: 'Edit profile' }).click();

    await page.getByTestId('settings-avatar-file').setInputFiles('avatar.jpg');
    await page.getByTestId('settings-submit').click();
  });
});
