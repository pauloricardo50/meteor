import { Meteor } from 'meteor/meteor';
import { Kadira } from 'meteor/meteorhacks:kadira';

if (!Meteor.isDevelopment && Meteor.settings.Kadira) {
  const { endpoint, admin } = Meteor.settings.Kadira;

  Kadira.connect(
    admin.appId,
    admin.appSecret,
    { endpoint },
  );
}
