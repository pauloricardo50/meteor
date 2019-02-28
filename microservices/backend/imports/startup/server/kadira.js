import { Meteor } from 'meteor/meteor';
import { Kadira } from 'meteor/lmachens:kadira';

if (Meteor.settings.Kadira) {
  const { endpoint, backend } = Meteor.settings.Kadira;

  Kadira.connect(
    backend.appId,
    backend.appSecret,
    { endpoint },
  );
}
