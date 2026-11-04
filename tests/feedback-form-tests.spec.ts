import { test, expect } from '@playwright/test';
import { FeedbackPage } from '../pages/FeedbackPage';
import { getUserDataForFeedback } from '../userDataForFeedback';

const scenarios = [
  {
    name: 'Fill all data',
    allFields: true,
    onlyRequiredFields: false,
    onlyNotRequiredFields: false,
  },
  {
    name: 'Fill required data',
    allFields: false,
    onlyRequiredFields: true,
    onlyNotRequiredFields: false,
  },
  {
    name: 'Fill non-required data',
    allFields: false,
    onlyRequiredFields: false,
    onlyNotRequiredFields: true,
  },
];

for (const scenario of scenarios) {
  test(`${scenario.name} test`, async ({ page }) => {
    const feedbackPage = new FeedbackPage(page);
    const userData = getUserDataForFeedback(
      scenario.allFields,
      scenario.onlyRequiredFields,
      scenario.onlyNotRequiredFields,
    );

    await feedbackPage.goto();
    if (!scenario.onlyNotRequiredFields) {
      await feedbackPage.fillRequiredFields(userData);
    }
    if (!scenario.onlyRequiredFields) {
      await feedbackPage.fillOptionalFields(userData);
    }
    await feedbackPage.submit();

    if (scenario.onlyNotRequiredFields) {
      await expect(feedbackPage.text("name обов'язкове поле")).toBeVisible();
      await expect(feedbackPage.text('email некоректний email')).toBeVisible();
      await expect(feedbackPage.text("message обов'язкове поле")).toBeVisible();
    } else {
      await expect(feedbackPage.successHeading).toBeVisible();
      await expect(feedbackPage.sendAnotherButton).toBeVisible();
    }
  });
}
