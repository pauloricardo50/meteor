import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Security from '../../security';
import SessionService from '../../sessions/server/SessionService';
import UserService from '../../users/server/UserService';

class ImpersonateService {
  /**
   * Impersonates the user
   * @param {*} context The context of a given meteor method
   * @param {*} authToken The token received from client
   * @param {*} userIdToImpersonate
   */
  impersonate({ context, authToken, userIdToImpersonate }) {
    const { connection: { id: connectionId } = {} } = context;
    const user = this._findUserByToken(authToken);

    if (user) {
      this._checkRolesForImpersonation(user._id);
    } else {
      this._throwNotAuthorized();
    }

    SessionService.setIsImpersonate(connectionId, true);

    context.setUserId(userIdToImpersonate);
    return UserService.get(userIdToImpersonate, { email: 1 });
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

    return UserService.get(
      { 'services.resume.loginTokens.hashedToken': hashedToken },
      // We just need to check the validity, no need for other data
      { _id: 1 },
    );
  }

  impersonateAdmin({ context, userIdToImpersonate }) {
    context.setUserId(userIdToImpersonate);
  }
}

export default new ImpersonateService();
