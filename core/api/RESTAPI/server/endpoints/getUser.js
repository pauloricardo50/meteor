import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

import { getImpersonateUserId, checkQuery, checkAccessToUser } from './helpers';
import UserService from '../../../users/server/UserService';
import { HTTP_STATUS_CODES } from '../restApiConstants';

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

  const user = UserService.getByEmail(email);

  if (!user) {
    throw new Meteor.Error(
      HTTP_STATUS_CODES.NOT_FOUND,
      `User with email "${email}" not found, or you don't have access to it.`,
    );
  }

  checkAccessToUser({ user, proId: proId || userId });

  const { _id: returnedUserId } = user;

  return UserService.get(returnedUserId, {
    assignedEmployee: {
      firstName: 1,
      lastName: 1,
      name: 1,
      email: 1,
      phoneNumbers: 1,
    },
    email: 1,
    firstName: 1,
    lastName: 1,
    name: 1,
    phoneNumbers: 1,
    roles: 1,
  });
};

export default getUserAPI;
