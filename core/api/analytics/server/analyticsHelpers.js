import SessionService from '../../sessions/server/SessionService';

export const impersonateMiddleware = context => () => next => (...args) => {
  const {
    connection: { id: connectionId },
  } = context;
  const isImpersonate = SessionService.isImpersonateSession(connectionId);

  // Don't track login events when impersonating
  if (isImpersonate) {
    return;
  }

  return next(...args);
};
