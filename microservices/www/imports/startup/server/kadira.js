import { Meteor } from 'meteor/meteor';
import { Kadira } from 'meteor/meteorhacks:kadira';

if (Meteor.settings.Kadira) {
  const { endpoint, www } = Meteor.settings.Kadira;

  Kadira.connect(
    www.appId,
    www.appSecret,
    { endpoint },
  );
}
