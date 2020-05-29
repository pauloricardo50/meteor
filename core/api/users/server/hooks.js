import { Meteor } from 'meteor/meteor';

import formatNumbersHook from '../../../utils/phoneFormatting';
import NewsletterService from '../../email/server/NewsletterService';
import ErrorLogger from '../../errorLogger/server/ErrorLogger';
import Users from '../users';
import UserService from './UserService';

formatNumbersHook(Users, 'phoneNumbers');

const shouldUseNewsletterHooks = Meteor.isProduction && !Meteor.isStaging;

Users.after.update((userId, doc, fieldNames) => {
  const fieldsToWatch = ['emails', 'firstName', 'lastName', 'phoneNumbers'];

  if (
    shouldUseNewsletterHooks &&
    fieldNames.some(fieldName => fieldsToWatch.includes(fieldName))
  ) {
    try {
      const { firstName, lastName, emails, phoneNumbers } = doc;
      const email = emails[0].address;
      // Skip all of our test accounts
      if (!email.includes('@e-potek.ch')) {
        NewsletterService.updateUser({
          firstName,
          lastName,
          email,
          phoneNumber: phoneNumbers?.[0],
        });
      }
    } catch (error) {
      ErrorLogger.handleError({
        error: new Error(`Users after update hook errror: ${error.message}`),
        userId,
      });
    }
  }
});

Users.after.remove(userId => {
  if (shouldUseNewsletterHooks) {
    const { email } = UserService.get(userId, { email: 1 });
    try {
      NewsletterService.removeUser({ email });
    } catch (error) {
      ErrorLogger.handleError({
        error: new Error(`Users after remove hook errror: ${error.message}`),
        userId,
      });
    }
  }
});
