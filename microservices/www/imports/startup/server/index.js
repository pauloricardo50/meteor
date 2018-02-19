import { Meteor } from 'meteor/meteor';

import 'core/api/api';
import 'core/api/api-server';
import setupMandrill from 'core/api/email/server/email-config';
import jc from 'core/api/jobs/server/jobs';

Meteor.startup(() => {
  // Do something on startup if necessary
  setupMandrill();
  jc.startJobServer();
});
