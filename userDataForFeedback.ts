import { getRandomString } from './utils';
const availableThemes = ['general', 'bug', 'feature', 'account'];
const availablePriorities = ['high', 'medium', 'low'];

export function getUserDataForFeedback(
  allFields: boolean,
  onlyRequiredFields: boolean,
  onlyNotRequiredFields: boolean,
) {
  if (allFields) {
    return allFieldsData;
  }
  if (onlyRequiredFields) {
    return requiredFieldsData;
  }
  return nonRequiredFieldsData;
}

export const allFieldsData = {
  name: getRandomString(6),
  email: `${getRandomString(4)}@test.ua`,
  theme: availableThemes[1],
  subject: getRandomString(6),
  priority: availablePriorities[0],
  message: 'message',
  attachment: 'C:\\Users\\Olha\\courses\\qaDojo-e2e\\testFile.txt',
  copyMe: true,
};

const cloneData = <T>(data: T): T => JSON.parse(JSON.stringify(data));

const requiredData = cloneData(allFieldsData);
requiredData.subject = '';
requiredData.priority = '';
requiredData.attachment = '';
requiredData.copyMe = false;

const nonRequiredData = cloneData(allFieldsData);
nonRequiredData.name = '';
nonRequiredData.email = '';
nonRequiredData.message = '';

export const requiredFieldsData = requiredData;
export const nonRequiredFieldsData = nonRequiredData;
