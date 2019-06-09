import { Meteor, global } from 'meteor/meteor';

if (Meteor.settings.Kadira) {
  const { endpoint, pro } = Meteor.settings.Kadira;

  if (!global.Package['lmachens:kadira']) {
    console.log('missing kadira package!');
    return;
  }

  const { Kadira } = require('meteor/lmachens:kadira');

  Kadira.connect(pro.appId, pro.appSecret, { endpoint });
}
