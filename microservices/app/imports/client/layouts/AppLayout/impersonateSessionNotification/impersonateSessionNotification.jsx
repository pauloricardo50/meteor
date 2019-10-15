import { Meteor } from 'meteor/meteor';

import { setUserConnected } from 'core/api/sessions/methodDefinitions';
import impersonatedSessionNotification from './impersonatedSessionNotification';
import impersonatingSessionNotification from './impersonatingSessionNotification';

const impersonateSessionNotification = ({ impersonatedSession, history }) => {
  if (impersonatedSession) {
    console.log('impersonatedSession:', impersonatedSession);
    const { connectionId, userIsConnected, shared } = impersonatedSession;
    const currentSessionId = Meteor.connection._lastSessionId;

    if (connectionId === currentSessionId) {
      return impersonatingSessionNotification({ impersonatedSession, history });
    }

    if (connectionId !== currentSessionId && !userIsConnected) {
      return userIsConnected
        ? undefined
        : setUserConnected.run({ connectionId });
    }

    if (!shared) {
      return;
    }

    return impersonatedSessionNotification({ impersonatedSession, history });
  }
};

export default impersonateSessionNotification;
