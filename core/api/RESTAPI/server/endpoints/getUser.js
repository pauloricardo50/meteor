import { Meteor } from 'meteor/meteor';
import pick from 'lodash/pick';
import SimpleSchema from 'simpl-schema';

import { getImpersonateUserId } from './helpers';
import UserService from '../../../users/server/UserService';

const querySchema = new SimpleSchema({
  email: { type: String, optional: false },
  'impersonate-user': { type: String, optional: true },
});

const getUserAPI = ({ user: { _id: userId }, query }) => {
  const cleanQuery = querySchema.clean(query);
  try {
    querySchema.validate(cleanQuery);
  } catch (error) {
    throw new Meteor.Error(error);
  }

  const impersonateUser = cleanQuery['impersonate-user'];
  const { email } = cleanQuery;

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

  const { organisations = [] } = UserService.fetchOne({
    $filters: { _id: proId || userId },
    organisations: { users: { _id: 1 } },
  });
  if (
    !organisations.some(({ _id }) => _id === user.referredByOrganisation)
    && !organisations.some(({ users = [] }) =>
      users.some(({ _id }) => _id === user.referredByUser))
  ) {
    throw new Meteor.Error(`User with email "${email}" not found, or you don't have access to it.`);
  }

  return pick(user, ['firstName', 'lastName', 'email', 'phoneNumber']);
};

export default getUserAPI;
