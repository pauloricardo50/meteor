import SimpleDDP from 'simpleddp';
import ws from 'isomorphic-ws';

const opts = {
  endpoint: 'wss://backend.e-potek.ch/websocket',
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
