import { Meteor } from 'meteor/meteor';
import { Kadira } from 'meteor/lmachens:kadira';

if (Meteor.settings.Kadira) {
  const { endpoint, pro } = Meteor.settings.Kadira;

  Kadira.connect(
    pro.appId,
    pro.appSecret,
    { endpoint },
  );
}
