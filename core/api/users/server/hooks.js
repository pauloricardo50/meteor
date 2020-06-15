import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import formatNumbersHook from '../../../utils/phoneFormatting';
import NewsletterService from '../../email/server/NewsletterService';
import ErrorLogger from '../../errorLogger/server/ErrorLogger';
import IntercomService from '../../intercom/server/IntercomService';
import { ROLES } from '../roles/roleConstants';
import Users from '../users';

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

Users.before.remove((userId, { emails }) => {
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
});

Users.after.insert((userId, user) => {
  const { intercomId } = user;
  const userIsAdmin = Roles.userIsInRole(user, [ROLES.ADMIN, ROLES.DEV]);

  if (userIsAdmin || intercomId) {
    return;
  }

  IntercomService.setIntercomId({ userId: user._id });
});
