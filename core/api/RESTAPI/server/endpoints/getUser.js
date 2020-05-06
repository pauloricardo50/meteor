import { Meteor } from 'meteor/meteor';

import omit from 'lodash/omit';
import SimpleSchema from 'simpl-schema';

import UserService from '../../../users/server/UserService';
import { HTTP_STATUS_CODES } from '../restApiConstants';
import {
  ACCESS_TO_USER,
  checkAccessToUser,
  checkQuery,
  getImpersonateUserId,
} from './helpers';

const querySchema = new SimpleSchema({
  email: { type: String, optional: false },
  'impersonate-user': { type: String, optional: true },
});

const getUserAPI = ({ user: { _id: userId }, query }) => {
  const { email, 'impersonate-user': impersonateUser } = checkQuery({
    query,
    schema: querySchema,
  });

  let proId;
  if (impersonateUser) {
    proId = getImpersonateUserId({ userId, impersonateUser });
  }

  const user = UserService.getByEmail(email, {
    assignedEmployee: {
      firstName: 1,
      lastName: 1,
      name: 1,
      email: 1,
      phoneNumbers: 1,
    },
    email: 1,
    emails: 1,
    firstName: 1,
    lastName: 1,
    name: 1,
    phoneNumbers: 1,
    roles: 1,
    referredByOrganisationLink: 1,
    referredByUserLink: 1,
  });

  if (!user) {
    throw new Meteor.Error(
      HTTP_STATUS_CODES.NOT_FOUND,
      `User with email "${email}" not found, or you don't have access to it.`,
    );
  }

  const hasAccessToFullUser =
    checkAccessToUser({ user, proId: proId || userId }) === ACCESS_TO_USER.FULL;

  return omit(
    user,
    [
      'referredByOrganisationLink',
      'referredByUserLink',
      'emails',
      !hasAccessToFullUser && 'phoneNumbers',
    ].filter(x => x),
  );
};

export default getUserAPI;
