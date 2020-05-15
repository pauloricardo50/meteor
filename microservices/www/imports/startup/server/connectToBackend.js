import { Meteor } from 'meteor/meteor';
import { DDP } from 'meteor/ddp-client';

const rootUrl = Meteor.settings.public.subdomains.backend;

// This makes sure all methods called are sent to our backend. We need this for logged errors during server-side rendering
// found here: https://github.com/meteor/meteor-feature-requests/issues/73
const connection = (Meteor.remoteConnection = DDP.connect(rootUrl));
connection.onReconnect = function() {
  console.log('ConnectionManager - remoteConnection.onReconnect', arguments);
};

[
  'subscribe',
  'methods',
  'call',
  'apply',
  'status',
  'reconnect',
  'disconnect',
].forEach(name => {
  Meteor[name] = connection[name].bind(connection);
});
