import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { createMutator } from 'core/api';
import Security from 'core/api/security';
import { IMPERSONATE_USER } from '../defs';
import Users from 'core/api/users';
import { ROLES } from 'core/api/users/userConstants';

createMutator(IMPERSONATE_USER, function({ authToken, userId }) {
  const user = Users.findOne(
    {
      'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(
        authToken,
      ),
    },
    {
      fields: { _id: 1 }, // We just need to check the validity, no need for other data
    },
  );

  if (!user || !Security.hasRole(user._id, [ROLES.ADMIN, ROLES.DEV])) {
    throw new Meteor.Error(401, 'Unauthorized');
  }

  console.log('Logging in as', userId);
  this.setUserId(userId);
});
