import { Meteor } from 'meteor/meteor';

import '/imports/js/server/emails';
import '/imports/js/server/methods';
import '/imports/api/api';
import '../accounts-config';
import './accounts-server-config';
import './meteor-slingshot-server';

Meteor.startup(() => {
  // Do something on startup if necessary
});
