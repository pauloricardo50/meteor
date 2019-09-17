import { LOGIN_IP_BLACKLIST } from '../analyticsConstants';

export const impersonateMiddleware = context => () => next => (...args) => {
  const { clientAddress, host } = context;

  // Don't track login events when impersonating
  if (!host.includes('admin')) {
    if (LOGIN_IP_BLACKLIST.includes(clientAddress)) {
      return;
    }
  }

  return next(...args);
};
