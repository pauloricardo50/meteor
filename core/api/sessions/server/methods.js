import SecurityService from '../../security';
import SessionService from './SessionService';
import { sessionInsert, sessionRemove, sessionUpdate } from '../methodDefinitions';

sessionInsert.setHandler((context, { session }) => {
// Add security checks
// Example
// SecurityService.checkCurrentUserIsAdmin();
return SessionService.insert(session);
});

sessionRemove.setHandler((context, { sessionId }) => {
// Add security checks
// Example
// SecurityService.checkCurrentUserIsAdmin();
return SessionService.remove(sessionId);
});

sessionUpdate.setHandler((context, { sessionId, object }) => {
// Add security checks
// Example
// SecurityService.checkCurrentUserIsAdmin();
return SessionService._update({ id: sessionId, object });
});