import { Meteor } from 'meteor/meteor';

if (Meteor.settings.Kadira) {
  let options = {};

  if (Package['lmachens:kadira']) {
    import { Kadira } from 'meteor/lmachens:kadira';
    options.endpoint = Meteor.settings.Kadira.endpoint;
  } else {
    import { Kadira } from 'meteor/montiapm:agent';
  }

  const { microservice } = Meteor;

  if (Meteor.settings.Kadira[microservice]) {
    const { appId, appSecret } = Meteor.settings.Kadira[microservice];
    Kadira.connect(appId, appSecret, options);
  }
}
