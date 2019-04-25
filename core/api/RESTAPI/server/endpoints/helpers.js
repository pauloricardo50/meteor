import { Meteor } from 'meteor/meteor';
import UserService from '../../../users/server/UserService';

const anyOrganisationMatches = ({
  userOrganisations = [],
  proOrganisations = [],
}) =>
  userOrganisations.some(userOrganisation =>
    proOrganisations.some(proOrganisation => userOrganisation._id === proOrganisation._id));

export const getImpersonateUserId = ({ userId, impersonateUser }) => {
  const { organisations: userOrganisations = [] } = UserService.fetchOne({
    $filters: { _id: userId },
    organisations: { _id: 1 },
  });

  const { _id: proId, organisations: proOrganisations = [] } = UserService.fetchOne({
    $filters: { 'emails.address': { $in: [impersonateUser] } },
    organisations: { _id: 1 },
  }) || {};

  if (!proId) {
    throw new Meteor.Error(`No user found for email address "${impersonateUser}"`);
  }

  if (
    userOrganisations.length === 0
    || proOrganisations.length === 0
    || !anyOrganisationMatches({ userOrganisations, proOrganisations })
  ) {
    throw new Meteor.Error(`User with email address "${impersonateUser}" is not part of your organisation`);
  }

  return proId;
};

export const checkQuery = ({ query, schema }) => {
  const cleanQuery = schema.clean(query);
  try {
    schema.validate(cleanQuery);
  } catch (error) {
    throw new Meteor.Error(error);
  }

  return cleanQuery;
};

export const checkAccessToUser = ({ user, proId }) => {
  const { organisations = [] } = UserService.fetchOne({
    $filters: { _id: proId },
    organisations: { users: { _id: 1 } },
  });

  if (
    !organisations.some(({ _id }) => _id === user.referredByOrganisation._id)
    && !organisations.some(({ users = [] }) =>
      users.some(({ _id }) => _id === user.referredByUser._id))
  ) {
    throw new Meteor.Error(`User with email "${
      user.email
    }" not found, or you don't have access to it.`);
  }
};
