import moment from 'moment';

import Sessions from '../sessions';
import CollectionService from '../../helpers/CollectionService';
import UserService from '../../users/server/UserService';

class SessionService extends CollectionService {
  constructor() {
    super(Sessions);
  }

  getByConnectionId(connectionId) {
    return this.findOne({ connectionId });
  }

  setUser(connectionId, userId) {
    const user = UserService.get(userId, { roles: 1 });
    const { roles = [] } = user || {};
    return this.baseUpdate(
      { connectionId },
      { $set: { userId, role: roles.length ? roles[0] : undefined } },
    );
  }

  setIsImpersonate(connectionId, isImpersonate) {
    return this.baseUpdate({ connectionId }, { $set: { isImpersonate } });
  }

  setLastPageVisited(connectionId, lastPageVisited) {
    return this.baseUpdate({ connectionId }, { $set: { lastPageVisited } });
  }

  setLastMethodCalled(connectionId, lastMethodCalled) {
    return this.baseUpdate({ connectionId }, { $set: { lastMethodCalled } });
  }

  setLastActivity({ connectionId, lastMethodCalled, lastPageVisited }) {
    if (lastMethodCalled) {
      this.setLastMethodCalled(connectionId, lastMethodCalled);
    }
    if (lastPageVisited) {
      this.setLastPageVisited(connectionId, lastPageVisited);
    }

    return connectionId;
  }

  removeSession(connectionId) {
    return this.remove({ connectionId });
  }

  removeOldSessions() {
    const fifteenMinutesAgo = moment()
      .subtract(15, 'minutes')
      .toDate();

    const removed = this.remove({ updatedAt: { $lte: fifteenMinutesAgo } });
    return removed;
  }

  isImpersonatedSession(connectionId) {
    const session = this.getByConnectionId(connectionId);
    return session && session.isImpersonate;
  }

  shareImpersonatedSession(connectionId, share) {
    if (!this.isImpersonatedSession(connectionId)) {
      throw new Meteor.Error('Current session is not an impersonated session');
    }

    return this.baseUpdate(
      { connectionId },
      {
        $set: { shared: share },
        $unset: { followed: true },
      },
    );
  }

  followImpersonatedSession({ connectionId, follow }) {
    return this.baseUpdate({ connectionId }, { $set: { followed: follow } });
  }

  setUserConnected({ connectionId }) {
    return this.baseUpdate(
      { connectionId },
      { $set: { userIsConnected: true } },
    );
  }

  disconnectUser(connectionId) {
    const session = this.getByConnectionId(connectionId);

    return (
      !!session &&
      this.baseUpdate(
        { userId: session.userId, isImpersonate: true },
        { $set: { userIsConnected: false } },
        { multi: true },
      )
    );
  }
}

export default new SessionService();
