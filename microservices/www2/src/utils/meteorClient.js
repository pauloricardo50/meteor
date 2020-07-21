import ws from 'isomorphic-ws';
import SimpleDDP from 'simpleddp';

import { getTrackingId } from './tracking';

const isDevelopment = process.env.NODE_ENV === 'development';

const opts = {
  endpoint: isDevelopment
    ? 'ws://localhost:5500/websocket' // wss protocol doesn't seem to work in local
    : 'wss://backend.e-potek.ch/websocket',
  SocketConstructor: ws,
};

const meteorClient = new SimpleDDP(opts);

if (process.env.NODE_ENV === 'development') {
  meteorClient.on('connected', () => {
    console.log('connected! :)');
  });

  meteorClient.on('disconnected', () => {
    console.log('disconnected! :(');
  });

  meteorClient.on('error', e => {
    console.log('Meteor client error', e);
  });
}

export const callMethod = (method, params) =>
  meteorClient.call(method, params, {
    trackingId: getTrackingId(),
    location: window
      ? {
          href: window.location.href,
          host: window.location.host,
          pathname: window.location.pathname,
        }
      : undefined,
  });

export default meteorClient;
