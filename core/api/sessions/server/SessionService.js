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
    const { roles = [] } = UserService.getUserById({ userId });
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
    const oldSessions = this.find({
      updatedAt: { $lte: fifteenMinutesAgo },
    }).fetch();
    oldSessions.forEach(({ connectionId }) => this.removeSession(connectionId));
    return oldSessions.length;
  }

  getImpersonateSession(userId) {
    const sessions = this.find({ userId, isImpersonate: true }).fetch();
    const isUserImpersonated = !!sessions.length;

    if (!isUserImpersonated) {
      return undefined;
    }

    const [mostRecentSession] = sessions.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return mostRecentSession;
  }
}

export default new SessionService();
