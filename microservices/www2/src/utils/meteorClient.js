import ws from 'isomorphic-ws';
import SimpleDDP from 'simpleddp';

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

export default meteorClient;
