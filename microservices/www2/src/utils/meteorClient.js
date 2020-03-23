import React from 'react';
import SimpleDDP from 'simpleDDP';

export const MeteorClientContext = React.createContext();

const opts = {
  endpoint:
    process.env.NODE_ENV === 'production'
      ? 'ws://backend.e-potek.ch/websocket'
      : 'ws://localhost:5500/websocket',
  SocketConstructor: WebSocket,
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
