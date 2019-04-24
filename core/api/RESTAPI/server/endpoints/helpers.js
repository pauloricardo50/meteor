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

export const getUserMainOrganisationId = (userId) => {
  const { organisations = [] } = UserService.fetchOne({
    $filters: { _id: userId },
    organisations: { _id: 1 },
  });
  let mainOrganisation;
  if (organisations.length === 1) {
    mainOrganisation = organisations[0];
  } else {
    mainOrganisation = organisations.find(({ $metadata: { isMain } }) => isMain);
  }

  return mainOrganisation._id;
};
