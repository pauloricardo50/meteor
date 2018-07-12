import { Meteor } from 'meteor/meteor';
import { SecurityService } from '../..';

export const checkInsertUserId = (userId) => {
  if (userId === undefined) {
    return Meteor.userId();
  } else if (userId) {
    SecurityService.checkCurrentUserIsAdmin();
    return userId;
  }

  SecurityService.handleUnauthorized('Unauthorized insert');
};
