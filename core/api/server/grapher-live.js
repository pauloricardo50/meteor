import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  const enableGrapherLive = Meteor.microservice !== 'pdf' && Meteor.microservice !== 'www';

  if (enableGrapherLive) {
    const { initialize } = require('meteor/cultofcoders:grapher-live');

    if (process.env.NODE_ENV === 'development') {
      initialize(); // exposes a method "grapher_live", used by the React Component
    }
  }
});
