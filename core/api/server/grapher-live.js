import { Meteor } from 'meteor/meteor';

const isDev = false; // process.env.NODE_ENV === 'development';

Meteor.startup(() => {
  const enableGrapherLive = Meteor.microservice !== 'pdf' && Meteor.microservice !== 'www';

  if (isDev && enableGrapherLive) {
    const { initialize } = require('meteor/cultofcoders:grapher-live');
    initialize(); // exposes a method "grapher_live", used by the React Component
  }
});
