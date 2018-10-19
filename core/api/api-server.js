import { Meteor } from 'meteor/meteor';
import util from 'util';

import 'core/fixtures/fixtureMethods';

import './users/server/accounts-server-config';

import './methods/server';
import './methods';

import './factories';

import './files/server/methods';
import './files/server/meteor-slingshot-server';

import './email/server';

import './events/server/registerServerListeners';

import './links';
import './reducers';

// Exposures
import './borrowers/queries/exposures';
import './loans/queries/exposures';
import './offers/queries/exposures';
import './promotionLots/queries/exposures';
import './promotionOptions/queries/exposures';
import './promotions/queries/exposures';
import './properties/queries/exposures';
import './resolvers/exposures';
import './tasks/queries/exposures';
import './users/queries/exposures';

// Server-side Reducers
import './borrowers/server/serverReducers';
import './loans/server/serverReducers';
import './promotionLots/server/serverReducers';
import './promotions/server/serverReducers';
import './properties/server/serverReducers';

import { initialize } from 'meteor/cultofcoders:grapher-live';
import { Loans, Borrowers, Offers, Properties } from '.';

Loans._ensureIndex({ userId: 1 });
Borrowers._ensureIndex({ userId: 1 });
Offers._ensureIndex({ loanId: 1 });
Properties._ensureIndex({ userId: 1 });

if (process.env.NODE_ENV === 'development') {
  initialize(); // exposes a method "grapher_live", used by the React Component
}
