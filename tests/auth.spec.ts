import { test, expect } from '@playwright/test';

test.describe('Registration', { tag: '@reg' }, () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/articles');
        await page.getByTestId('nav-sign-up').click();
    });

    test('User can register with valid credentials', async ({ page }) => {
        const user = generateUser();
        await page.getByTestId('auth-username').fill(user.userName);
        await page.getByTestId('auth-email').fill(user.email);
        await page.getByTestId('auth-password').fill(user.password);
        await page.getByTestId('register-confirm-password').fill(user.password);
        await page.getByTestId('register-terms').check();
        await page.getByTestId('auth-submit').click();
        await expect(page.getByTestId('nav-profile')).toContainText(user.userName);
    });

    test('User with duplicated credentials is not registered', async ({ page }) => {
        await page.getByTestId('auth-username').fill(process.env.TEST_USER_NAME!);
        await page.getByTestId('auth-email').fill(process.env.TEST_USER_EMAIL!);
        await page.getByTestId('auth-password').fill(process.env.TEST_USER_PASSWORD!);
        await page.getByTestId('register-confirm-password').fill(process.env.TEST_USER_PASSWORD!);
        await page.getByTestId('register-terms').check();
        await page.getByTestId('auth-submit').click();
        await expect(page.getByText('body email або username')).toBeVisible();
    });

    test('User with invalid password is not registered', async ({ page }) => {
        const user = generateUser();
        const invalidPassword = getRandomString(3);
        await page.getByTestId('auth-username').fill(user.userName);
        await page.getByTestId('auth-email').fill(user.email);
        await page.getByTestId('auth-password').fill(invalidPassword);
        await page.getByTestId('register-confirm-password').fill(invalidPassword);
        await page.getByTestId('register-terms').check();
        await page.getByTestId('auth-submit').click();
        await expect(page.getByTestId('error-messages').getByText('password')).toBeVisible();
    });
});

test.describe('Login', { tag: '@login' }, () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/articles');
        await page.getByTestId('nav-sign-in').click();
    });

    test('User can login with valid credentials', async ({ page }) => {
        await page.getByTestId('auth-email').fill(process.env.TEST_USER_EMAIL!);
        await page.getByTestId('auth-password').fill(process.env.TEST_USER_PASSWORD!);
        await page.getByTestId('auth-submit').click();
        await expect(page.getByTestId('nav-profile')).toContainText(process.env.TEST_USER_NAME!);
    });

    test('User with invalid password can not login', async ({ page }) => {
        const invalidPassword = getRandomString(3);
        await page.getByTestId('auth-email').fill(process.env.TEST_USER_EMAIL!);
        await page.getByTestId('auth-password').fill(invalidPassword);
        await page.getByTestId('auth-submit').click();
        await expect(page.getByText('email or password неправильні')).toBeVisible();
        await expect(page.getByTestId('nav-sign-in')).toBeVisible();
    });

    test('Not existing user can not login', async ({ page }) => {
        await page.getByTestId('auth-email').fill(`${getRandomString(6)}@test.ua`);
        await page.getByTestId('auth-password').fill(getRandomString(6));
        await page.getByTestId('auth-submit').click();
        await expect(page.getByText('email or password неправильні')).toBeVisible();
        await expect(page.getByTestId('nav-sign-in')).toBeVisible();
    });
});

function getRandomString(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () =>
        chars[Math.floor(Math.random() * chars.length)]
    ).join('');
}

function generateUser() {
    const userName = getRandomString(6);
    return {
        userName,
        email: `${userName}${getRandomString(4)}@test.ua`,
        password: getRandomString(6),
    };
}