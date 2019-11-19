import SessionService from '../../sessions/server/SessionService';

export const impersonateMiddleware = context => () => next => (...args) => {
  const connection = context.connection || {};
  const { id: connectionId } = connection;
  const isImpersonate = SessionService.isImpersonatedSession(connectionId);

  // Don't track anything when impersonating
  if (isImpersonate) {
    return;
  }

  return next(...args);
};
