import { Meteor } from 'meteor/meteor';
import pick from 'lodash/pick';
import SimpleSchema from 'simpl-schema';

import { getImpersonateUserId, checkQuery, checkAccessToUser } from './helpers';
import UserService from '../../../users/server/UserService';

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
    throw new Meteor.Error(`User with email "${email}" not found, or you don't have access to it.`);
  }

  checkAccessToUser({ user, proId: proId || userId });

  return pick(user, ['firstName', 'lastName', 'emails', 'phoneNumbers']);
};

export default getUserAPI;
