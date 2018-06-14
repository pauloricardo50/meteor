import 'core/fixtures/methods';

import './borrowers/server/publications';

import './loans/server/publications';

import './offers/server/publications';

import './properties/server/publications';

import './users/server/publications';
import './users/server/accounts-server-config';

import './methods/server';
import './methods';

import './factories';

import './jobs/server';

import './files/server/methods';
import './files/meteor-slingshot-server';

import '../utils/logismata/methods';

import './email/server';

import './events/server/registerServerListeners';

import './links';

// Exposures
import './loans/queries/exposures';
import './users/queries/exposures';
import './tasks/queries/exposures';
import './borrowers/queries/exposures';
import './properties/queries/exposures';
import './resolvers/exposures';

import { Loans, Borrowers, Offers, Properties } from '.';

Loans._ensureIndex({ userId: 1 });
Borrowers._ensureIndex({ userId: 1 });
Offers._ensureIndex({ loanId: 1 });
Properties._ensureIndex({ userId: 1 });
