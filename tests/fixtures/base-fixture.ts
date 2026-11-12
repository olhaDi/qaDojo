import { test as base, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { UserController } from '../../controllers/UserController';

export type TestUser = {
  userName: string;
  email: string;
  password: string;
  token: string;
};

type MyFixtures = {
  /** A user registered via API. One per test, shared by every fixture below. */
  user: TestUser;
  /** The token of that same user. */
  token: string;
  /** Puts that same user's token into the browser; returns the user. */
  login: TestUser;
};

const test = base.extend<MyFixtures>({
  user: async ({ playwright, baseURL }, use) => {
    if (!baseURL) {
      throw new Error('BASE_URL is not defined');
    }

    const userName = faker.internet.username();
    const email = faker.internet.email();
    const password = faker.internet.password({ length: 10 });

    const api = await playwright.request.newContext({ baseURL });
    try {
      const { user } = await new UserController(api).createUser({
        user: { username: userName, email, password },
      });
      await use({ userName, email, password, token: user.token });
    } finally {
      await api.dispose();
    }
  },

  token: async ({ user }, use) => {
    await use(user.token);
  },

  login: async ({ context, baseURL, user, token }, use) => {
    await context.setStorageState(createLocalStorageState(baseURL!, token));
    await use(user);
  },
});
export { test, expect };

function createLocalStorageState(baseUrl: string, token: string) {
  return {
    cookies: [],
    origins: [
      {
        origin: new URL(baseUrl).origin,
        localStorage: [{ name: 'qa-dojo.token', value: token }],
      },
    ],
  };
}
