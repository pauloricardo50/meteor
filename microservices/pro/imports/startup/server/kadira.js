import { Meteor } from 'meteor/meteor';
import { Kadira } from 'meteor/lmachens:kadira';

if (Meteor.settings.Kadira) {
  const { endpoint, app } = Meteor.settings.Kadira;

  Kadira.connect(
    app.appId,
    app.appSecret,
    { endpoint },
  );
}
