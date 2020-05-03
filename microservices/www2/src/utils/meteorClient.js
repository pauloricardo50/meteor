import React from 'react';
import SimpleDDP from 'simpleddp';

export const MeteorClientContext = React.createContext();

// Client library to easily talk to our main backend
//
// Use it as follows:
// meteorClient.call('named_query_PROMOTIONS_LIST').then(result => {})
// meteorClient.call('getGpsStats').then(result => {})

// By default it connects to the dev/production backend based on your environment
// But it's ok to simply connect to the production URL if you don't need/want
// to run a backend server. In that case, switch the URL here:
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
