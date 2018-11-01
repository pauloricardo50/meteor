import { Meteor } from 'meteor/meteor';
import { Kadira } from 'meteor/lmachens:kadira';

if (Meteor.settings.Kadira) {
  const { endpoint, pdf } = Meteor.settings.Kadira;

  Kadira.connect(
    pdf.appId,
    pdf.appSecret,
    { endpoint },
  );
}
