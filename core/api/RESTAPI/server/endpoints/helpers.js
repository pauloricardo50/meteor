import { Meteor } from 'meteor/meteor';
import UserService from '../../../users/server/UserService';

export const getImpersonateUserId = ({ userId, impersonateUser }) => {
  const { organisations: userOrganisationIds = [] } = UserService.fetchOne({
    $filters: { _id: userId },
    organisations: { _id: 1 },
  });

  const { _id: proId, organisations: proOrganisationIds = [] } = UserService.fetchOne({
    $filters: { 'emails.address': { $in: [impersonateUser] } },
    organisations: { _id: 1 },
  }) || {};

  if (!proId) {
    throw new Meteor.Error(`No user found for email address "${impersonateUser}"`);
  }

  if (
    userOrganisationIds.length === 0
    || proOrganisationIds.length === 0
    || userOrganisationIds[0]._id !== proOrganisationIds[0]._id
  ) {
    throw new Meteor.Error(`User with email address "${impersonateUser}" is not part of your organisation`);
  }

  return proId;
};
