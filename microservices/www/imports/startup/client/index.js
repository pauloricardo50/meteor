// Keep initialization here because the client needs it
import { Meteor } from 'meteor/meteor';
import 'core/api/initialization';

import '../shared/setup';

import './ssr-client';
import initHotjar from 'core/utils/hotjar';

Meteor.startup(() => {
  initHotjar('www');
});
