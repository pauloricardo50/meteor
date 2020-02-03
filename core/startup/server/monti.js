import { Meteor } from 'meteor/meteor';
import { Monti } from 'meteor/montiapm:agent';

if (Meteor.settings.Monti) {
  const { microservice } = Meteor;

  if (Meteor.settings.Monti[microservice]) {
    const { appId, appSecret } = Meteor.settings.Monti[microservice];

    Monti.connect(appId, appSecret);
  }
}
