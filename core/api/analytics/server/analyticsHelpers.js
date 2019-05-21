import { LOGIN_IP_BLACKLIST } from '../analyticsConstants';

export const impersonateMiddleware = context => () => next => (...args) => {
  const {
    connection: {
      clientAddress,
      httpHeaders: { host },
    },
  } = context;

  // Don't track login events when impersonating
  if (!host.includes('admin')) {
    if (LOGIN_IP_BLACKLIST.includes(clientAddress)) {
      return;
    }
  }

  return next(...args);
};
