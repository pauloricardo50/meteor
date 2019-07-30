import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Users from '../../users';
import Security from '../../security';

class ImpersonateService {
  /**
   * Impersonates the user
   * @param {*} context The context of a given meteor method
   * @param {*} authToken The token received from client
   * @param {*} userIdToImpersonate
   */
  impersonate({ context, authToken, userIdToImpersonate }) {
    const user = this._findUserByToken(authToken);

    if (user) {
      this._checkRolesForImpersonation(user._id);
    } else {
      this._throwNotAuthorized();
    }

    context.setUserId(userIdToImpersonate);
    return Users.findOne(userIdToImpersonate);
  }

  _throwNotAuthorized() {
    throw new Meteor.Error(401, 'Unauthorized');
  }

  _checkRolesForImpersonation(userId) {
    if (!Security.isUserAdmin(userId)) {
      this._throwNotAuthorized();
    }
  }

  /**
   * @param {string} authToken
   * @returns {object|null}
   */
  _findUserByToken(authToken) {
    // eslint-disable-next-line
    const hashedToken = Accounts._hashLoginToken(authToken);

    return Users.findOne(
      { 'services.resume.loginTokens.hashedToken': hashedToken },
      // We just need to check the validity, no need for other data
      { fields: { _id: 1 } },
    );
  }

  impersonateAdmin({ context, userIdToImpersonate }) {
    context.setUserId(userIdToImpersonate);
  }
}

export default new ImpersonateService();
