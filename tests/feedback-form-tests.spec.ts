import { test, expect } from '@playwright/test';
import { navigateToFeedbackForm } from '../page-actions';
import { fillFeedbackForm } from '../page-actions';
import {
  checkErrorMessages_RequiredDataNotEntered,
  checkSuccessMessage_RequiredDataEntered,
} from '../assertions';

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

for (let scenario of scenarios) {
  test(`${scenario.name} test`, async ({ page }) => {
    await navigateToFeedbackForm(page);
    await fillFeedbackForm(
      page,
      scenario.allFields,
      scenario.onlyRequiredFields,
      scenario.onlyNotRequiredFields,
    );
    if (scenario.onlyNotRequiredFields) {
      await checkErrorMessages_RequiredDataNotEntered(page);
    } else {
      await checkSuccessMessage_RequiredDataEntered(page);
    }
  });
}
