import 'core/api/initialization';

import '../shared/setup';
import './ssr-client';

// Keep initialization here because the client needs it
import { Meteor } from 'meteor/meteor';

import { initGoogleTagManager } from 'core/utils/googleTagManager';
import initHotjar from 'core/utils/hotjar';

Meteor.startup(() => {
  initGoogleTagManager();
  initHotjar('www');
});
