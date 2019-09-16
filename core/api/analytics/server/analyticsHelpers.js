import { LOGIN_IP_BLACKLIST } from '../analyticsConstants';

export const impersonateMiddleware = context => () => next => (...args) => {
  const {
    connection: {
      clientAddress,
      httpHeaders: { host, 'x-real-ip': realIp },
    },
  } = context;

  console.log('host:', host);
  console.log('clientAddress:', clientAddress);
  console.log('realIp:', realIp);

  // Don't track login events when impersonating
  if (!host.includes('admin')) {
    if (
      LOGIN_IP_BLACKLIST.includes(clientAddress)
      || LOGIN_IP_BLACKLIST.includes(realIp)
    ) {
      return;
    }
  }

  return next(...args);
};
