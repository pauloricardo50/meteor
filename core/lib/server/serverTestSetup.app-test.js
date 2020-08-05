// Load these in the right order
import '../testInit.test';
import '../test/server/accounts.test';
import '../../api/server';
import '../../api/api';
import '../../api/email/server/test/setupEmailTests';
import '../../api/queries/test/collection-app-test';
import '../../api/queries/test/server/serverQueries-app-test';
import '../../api/methods/server/test/serverMethods-app-test';

import { Meteor } from 'meteor/meteor';

import createGatsbyFixtures from '../../fixtures/gatsbyFixtures';

Meteor.startup(() => {
  if (process.env.GATSBY_E2E_TEST) {
    console.log('Inserting gatsby fixtures');
    createGatsbyFixtures();
  }
});
