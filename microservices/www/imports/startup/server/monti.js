import { Meteor } from 'meteor/meteor';
import { Monti } from 'meteor/montiapm:agent';

if (Meteor.settings.Monti) {
  const { www } = Meteor.settings.Monti;

  Monti.connect(www.appId, www.appSecret);
}
