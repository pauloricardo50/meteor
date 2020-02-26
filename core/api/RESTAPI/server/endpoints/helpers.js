import { Meteor } from 'meteor/meteor';

import SimpleSchema from 'simpl-schema';

import UserService from '../../../users/server/UserService';
import { HTTP_STATUS_CODES } from '../restApiConstants';

const anyOrganisationMatches = ({
  userOrganisations = [],
  proOrganisations = [],
}) =>
  userOrganisations.some(userOrganisation =>
    proOrganisations.some(
      proOrganisation => userOrganisation._id === proOrganisation._id,
    ),
  );

export const getImpersonateUserId = ({ userId, impersonateUser }) => {
  const { organisations: userOrganisations = [] } = UserService.get(userId, {
    organisations: { _id: 1 },
  });

  const user = UserService.getByEmail(impersonateUser);
  let proId;
  let proOrganisations;

  if (user) {
    proId = user._id;
    proOrganisations =
      UserService.get(user._id, { organisations: { _id: 1 } }).organisations ||
      [];
  }

  if (!proId) {
    throw new Meteor.Error(
      `No user found for email address "${impersonateUser}"`,
    );
  }

  if (
    userOrganisations.length === 0 ||
    proOrganisations.length === 0 ||
    !anyOrganisationMatches({ userOrganisations, proOrganisations })
  ) {
    throw new Meteor.Error(
      `User with email address "${impersonateUser}" is not part of your organisation`,
    );
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

export const checkAccessToUser = ({ user, proId, errorMessage }) => {
  const { organisations = [] } = UserService.get(proId, {
    organisations: { users: { _id: 1 } },
  });

  const userIsReferredByProOrg = organisations.some(
    ({ _id }) => _id === user.referredByOrganisationLink,
  );
  const userIsReferredByProOrgMember = organisations.some(({ users = [] }) =>
    users.some(({ _id }) => _id === user.referredByUserLink),
  );
  const userIsPartOfProOrg = organisations.some(({ users = [] }) =>
    users.some(({ _id }) => _id === user._id),
  );

  if (
    !userIsReferredByProOrg &&
    !userIsReferredByProOrgMember &&
    !userIsPartOfProOrg
  ) {
    throw new Meteor.Error(
      HTTP_STATUS_CODES.NOT_FOUND,
      errorMessage ||
        `User with email "${user.emails[0].address}" not found, or you don't have access to it.`,
    );
  }
};

export const impersonateSchema = new SimpleSchema({
  'impersonate-user': { type: String, optional: true },
});
