import { test, expect } from '../fixtures/base-fixture';

// The login fixture applies its own storage state, so skip the shared one.
test.use({ storageState: { cookies: [], origins: [] } });

test('change avatar via image URL in profile settings', async ({
  page,
  login,
}) => {
  // 1. The user is created via API and the browser is authorized by the fixture.
  await page.goto('/articles/editor');
  await expect(page.getByTestId('nav-profile')).toContainText(login.userName);

  // 2. Open profile settings (direct navigation redirects to login, so go via the UI).
  await page.getByTestId('nav-profile').click();
  await page.getByRole('link', { name: 'Edit profile' }).click();

  const imageInput = page.getByTestId('settings-image');
  const avatarPreview = page.getByTestId('settings-avatar-preview').locator('img');

  const initialUrl = await imageInput.inputValue();

  // 3. Enter a direct image URL that differs from the initial value.
  const expectedUrl =
    'https://upload.wikimedia.org/wikipedia/commons/1/12/Yellow_Smiley_Face.png';
  expect(expectedUrl).not.toBe(initialUrl);

  await imageInput.fill(expectedUrl);
  await expect(avatarPreview).toHaveAttribute('src', expectedUrl);

  // 4. Save and make sure the server accepted exactly this URL.
  const [response] = await Promise.all([
    page.waitForResponse(
      (r) => r.url().endsWith('/api/user') && r.request().method() === 'PUT',
    ),
    page.getByTestId('settings-submit').click(),
  ]);
  expect(response.status()).toBe(200);
  expect((await response.json()).user.image).toBe(expectedUrl);

  // 5. After saving we land on the profile page: check the avatar IMAGES
  //    (not the form field) in the profile and in the header.
  await expect(page.getByTestId('profile-page')).toBeVisible();
  const profileAvatar = page.getByTestId('profile-page').locator('img').first();
  const headerAvatar = page.getByTestId('nav-profile').locator('img');

  for (const avatar of [profileAvatar, headerAvatar]) {
    await expect(avatar).toBeVisible();
    await expect(avatar).toHaveAttribute('src', expectedUrl);
    // "visible" is not enough: make sure the browser really loaded the picture.
    await expect
      .poll(() => avatar.evaluate((img: HTMLImageElement) => img.naturalWidth))
      .toBeGreaterThan(0);
  }

  // 6. Reopen settings: the new URL is persisted and shown in the preview.
  await page.getByRole('link', { name: 'Edit profile' }).click();
  await expect(imageInput).toHaveValue(expectedUrl);
  await expect(avatarPreview).toHaveAttribute('src', expectedUrl);
});
