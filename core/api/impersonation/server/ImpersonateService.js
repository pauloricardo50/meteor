import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Security from '../../security';
import Users from '../../users';

export default class ImpersonateService {
  /**
   * Impersonates the user
   * @param {*} context The context of a given meteor method
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
    if (!Security.isUserAdmin(userId)) {
      this._throwNotAuthorized();
    }
  }

  /**
   * @param {string} authToken
   * @returns {object|null}
   */
  static _findUserByToken(authToken) {
    // eslint-disable-next-line
    const hashedToken = Accounts._hashLoginToken(authToken);

    return Users.findOne(
      {
        'services.resume.loginTokens.hashedToken': hashedToken,
      },
      {
        // We just need to check the validity, no need for other data
        fields: { _id: 1 },
      },
    );
  }
}
