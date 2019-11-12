import { Meteor } from 'meteor/meteor';
import SecurityService from '../../security';

export const checkInsertUserId = userId => {
  if (userId === undefined) {
    return Meteor.userId();
  }
  if (userId) {
    SecurityService.checkCurrentUserIsAdmin();
    return userId;
  }

  SecurityService.handleUnauthorized('Unauthorized insert');
};
