import {
  shareImpersonatedSession,
  followImpersonatedSession,
  setUserConnected,
} from '../methodDefinitions';
import SessionService from './SessionService';

shareImpersonatedSession.setHandler(({ connection: { id: connectionId } }, { share }) =>
  SessionService.shareImpersonatedSession(connectionId, share));

followImpersonatedSession.setHandler((context, params) =>
  SessionService.followImpersonatedSession(params));

setUserConnected.setHandler((context, params) =>
  SessionService.setUserConnected(params));
