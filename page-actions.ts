import { Page, expect } from 'playwright/test';
import { generateUser } from './utils';
import { getUserDataForFeedback } from './userDataForFeedback';

export async function authorize(page: Page) {
  const user = generateUser();
  await page.getByTestId('auth-username').fill(user.userName);
  await page.getByTestId('auth-email').fill(user.email);
  await page.getByTestId('auth-password').fill(user.password);
  await page.getByTestId('register-confirm-password').fill(user.password);
  await page.getByTestId('register-terms').check();
  await page.getByTestId('auth-submit').click();
  return user;
}

export async function generateArticle(
  page: Page,
  title: string,
  description: string,
  body: string,
) {
  await page.getByTestId('nav-new-article').click();

  await expect(page.getByTestId('editor-title')).toBeVisible();

  await page.getByTestId('editor-title').fill(title);
  await page.getByTestId('editor-description').fill(description);
  await page.getByTestId('editor-body').fill(body);

  await expect(page.getByTestId('editor-submit')).toBeEnabled();
  await page.getByTestId('editor-submit').click();

  await expect(page).toHaveURL(/\/articles\/article\/[^/]+$/);
}

export async function navigateToFeedbackForm(page: Page) {
  await page.goto('http://104.168.59.50/articles/contact');
}

export async function fillFeedbackForm(
  page: Page,
  allFields: boolean = false,
  onlyRequiredFields: boolean = true,
  onlyNotRequiredFields: boolean = false,
) {
  const userData = getUserDataForFeedback(
    allFields,
    onlyRequiredFields,
    onlyNotRequiredFields,
  );
  if (!onlyNotRequiredFields) {
    await fillRequiredFields(page, userData);
  }
  if (!onlyRequiredFields) {
    await fillNonRequiredFields(page, userData);
  }
  await submitFeedbackForm(page);
  return userData;
}

async function fillRequiredFields(
  page: Page,
  userData: { name: string; email: string; message: string },
) {
  await fillName(page, userData.name);
  await fillEmail(page, userData.email);
  await fillMessage(page, userData.message);
}

async function fillNonRequiredFields(
  page: Page,
  userData: {
    subject: string;
    priority: string;
    attachment: string;
    copyMe: boolean;
  },
) {
  await fillSubject(page, userData.subject);
  await selectPriority(page, userData.priority);
  await uploadAttachment(page, userData.attachment);
  await checkCopyMe(page, userData.copyMe);
}

async function fillName(page: Page, name: string) {
  await page.getByTestId('contact-name').isVisible();
  await page.getByTestId('contact-name').fill(name);
}

async function fillEmail(page: Page, email: string) {
  await expect(page.getByTestId('contact-email')).toBeVisible();
  await page.getByTestId('contact-email').fill(email);
}

async function fillMessage(page: Page, message: string) {
  await expect(page.getByTestId('contact-message')).toBeVisible();
  await page.getByTestId('contact-message').fill(message);
}

async function fillSubject(page: Page, subject: string) {
  await expect(page.getByTestId('contact-subject')).toBeVisible();
  if (subject !== 'Загальне питання') {
    await page.getByTestId('contact-subject').selectOption('feature');
  }
}

async function selectPriority(page: Page, priority: string) {
  if (priority !== 'medium' && priority !== '') {
    await page.getByTestId(`contact-priority-${priority}`).check();
  }
}

async function uploadAttachment(page: Page, filePath: string) {
  if (filePath !== '') {
    await page.getByTestId('contact-attachments').setInputFiles(filePath);
  }
}

async function checkCopyMe(page: Page, copyMe: boolean) {
  if (copyMe) {
    await page.getByTestId('contact-copy-me').check();
  }
}

export async function submitFeedbackForm(page: Page) {
  await page.getByTestId('contact-submit').click();
}
