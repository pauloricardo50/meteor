import { Meteor } from 'meteor/meteor';

import formatNumbersHook from '../../../utils/phoneFormatting';
import { DripService as DripServiceClass } from '../../drip/server/DripService';
import NewsletterService from '../../email/server/NewsletterService';
import ErrorLogger from '../../errorLogger/server/ErrorLogger';
import Users from '../users';

// Avoids all tests that remove a user to call Drip API
const DripService = new DripServiceClass({ enableAPI: !Meteor.isTest });

formatNumbersHook(Users, 'phoneNumbers');

const shouldUseNewsletterHooks = Meteor.isProduction && !Meteor.isStaging;

Users.after.update((userId, doc, fieldNames) => {
  const fieldsToWatch = ['emails', 'firstName', 'lastName', 'phoneNumbers'];

  if (
    shouldUseNewsletterHooks &&
    fieldNames.some(fieldName => fieldsToWatch.includes(fieldName))
  ) {
    try {
      const { emails } = doc;
      const email = emails[0].address;
      // Skip all of our test accounts
      if (!email.includes('@e-potek.ch')) {
        NewsletterService.updateUser({ userId });
      }
    } catch (error) {
      ErrorLogger.handleError({
        error: new Error(`Users after update hook errror: ${error.message}`),
        userId,
      });
    }
  }
});

Users.before.remove(async (userId, { emails }) => {
  if (shouldUseNewsletterHooks) {
    try {
      const email = emails[0].address;
      NewsletterService.removeUser({ email });
    } catch (error) {
      ErrorLogger.handleError({
        error: new Error(`Users before remove hook errror: ${error.message}`),
        userId,
      });
    }
  }
  try {
    const email = emails[0].address;
    await DripService.removeSubscriber({ email });
  } catch (error) {
    // The subscriber did not exist on Drip
  }
});
