import { Meteor } from 'meteor/meteor';

import formatNumbersHook from '../../../utils/phoneFormatting';
import MailchimpService from '../../email/server/MailchimpService';
import ErrorLogger from '../../errorLogger/server/ErrorLogger';
import Users from '../users';

formatNumbersHook(Users, 'phoneNumbers');

Users.after.update((userId, doc, fieldNames) => {
  const fieldsToWatch = ['emails', 'firstName', 'lastName', 'phoneNumbers'];

  if (
    Meteor.isProduction &&
    !Meteor.isStaging &&
    fieldNames.some(fieldName => fieldsToWatch.includes(fieldName))
  ) {
    try {
      const { firstName, lastName, emails, phoneNumbers } = doc;
      MailchimpService.upsertMember({
        firstName,
        lastName,
        email: emails[0].address,
        phoneNumber: phoneNumbers?.[0],
      });
    } catch (error) {
      ErrorLogger.handleError({
        error: new Error(`Users after update hook errror: ${error.message}`),
        userId,
      });
    }
  }
});
