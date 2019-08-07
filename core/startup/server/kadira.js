import { Meteor } from 'meteor/meteor';
import { Kadira } from 'meteor/lmachens:kadira';

if (Meteor.settings.Kadira) {
  const { endpoint } = Meteor.settings.Kadira;
  const { microservice } = Meteor;

  if (Meteor.settings.Kadira[microservice]) {
    const { appId, appSecret } = Meteor.settings.Kadira[microservice];
    Kadira.connect(appId, appSecret, { endpoint });
  }
}
