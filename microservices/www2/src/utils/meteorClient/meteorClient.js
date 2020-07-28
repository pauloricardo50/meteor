const SimpleDDP = require('simpleddp');
const ws = require('isomorphic-ws');

const getBackendUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'wss://backend.e-potek.ch/websocket';
  }

  // wss protocol doesn't seem to work in local
  if (process.env.IS_E2E_TEST) {
    return 'ws://localhost:5505/websocket';
  }

  return 'ws://localhost:5500/websocket';
};

const opts = {
  endpoint: getBackendUrl(),
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

exports.meteorClient = meteorClient;
