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

  const user = UserService.fetchOne({
    $filters: { 'emails.address': { $in: [email] } },
    firstName: 1,
    lastName: 1,
    email: 1,
    phoneNumber: 1,
    referredByUser: { _id: 1 },
    referredByOrganisation: { _id: 1 },
  });

  if (!user) {
    throw new Meteor.Error(`User with email "${email}" not found, or you don't have access to it.`);
  }

  checkAccessToUser({ user, proId: proId || userId });

  return pick(user, ['firstName', 'lastName', 'email', 'phoneNumber']);
};

export default getUserAPI;
