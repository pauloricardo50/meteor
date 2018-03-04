import 'core/fixtures/methods';
// generateTestData

import './adminActions/server/publications';
import './adminActions/server/methods';

import './borrowers/server/publications';
import './borrowers/server/methods';

import './comparators/server/publications';
import './comparators/server/methods';

import './loans/server/publications';
import './loans/server/methods';

import './offers/server/publications';
import './offers/server/methods';

import './properties/server/publications';
import './properties/server/methods';

import './users/server/publications';
import './users/server/accounts-server-config';

import './methods/server';

import './factories';

import './jobs/server';

import './files/server/methods';
import './files/meteor-slingshot-server';

import '../utils/logismata/methods';

import './email/server';

import './mutations/server';

import './events/registerListeners';

import './links';

// Exposures
import './loans/queries/exposures';
import './users/queries/exposures';
// import "./adminActions/queries/exposures";
import './tasks/queries/exposures';
import './borrowers/queries/exposures';

import { Loans, Borrowers, Offers, Properties } from '.';

Loans._ensureIndex({ userId: 1 });
Borrowers._ensureIndex({ userId: 1 });
Offers._ensureIndex({ loanId: 1 });
Properties._ensureIndex({ userId: 1 });
