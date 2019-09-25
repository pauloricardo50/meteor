import { shareImpersonatedSession } from '../methodDefinitions';
import SessionService from './SessionService';

shareImpersonatedSession.setHandler((context) => {
  const {
    connection: { id: connectionId },
  } = context;

  return SessionService.shareImpersonatedSession(connectionId);
});
