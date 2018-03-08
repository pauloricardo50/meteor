import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { createMutator } from 'core/api';
import Security from 'core/api/security';
import { IMPERSONATE_USER } from '../defs';
import Users from 'core/api/users';
import { ROLES } from 'core/api/users/userConstants';

export default class ImpersonateService {
  /**
   * Impersonates the user
   * @param {*} context The context of a given meteor method or interface that has setUserId
   * @param {*} authToken The token received from client
   * @param {*} userIdToImpersonate
   */
  static impersonate(context, authToken, userIdToImpersonate) {
    const user = this._findUserByToken(authToken);

    if (user) {
      this._checkRolesForImpersonation(user._id);
    } else {
      this._throwNotAuthorized();
    }

    context.setUserId(userIdToImpersonate);
  }

  static _throwNotAuthorized() {
    throw new Meteor.Error(401, 'Unauthorized');
  }

  static _checkRolesForImpersonation(userId) {
    if (!Security.hasRole(userId, [ROLES.ADMIN, ROLES.DEV])) {
      this._throwNotAuthorized();
    }
  }

  /**
   * @param {string} authToken
   * @returns {object|null}
   */
  static _findUserByToken(authToken) {
    const hashedToken = Accounts._hashLoginToken(authToken);

    return Users.findOne(
      {
        'services.resume.loginTokens.hashedToken': hashedToken,
      },
      {
        fields: { _id: 1 }, // We just need to check the validity, no need for other data
      },
    );
  }
}
