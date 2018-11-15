import Offers from './offers';
import { Loans, Users } from '..';
import Organisations from '../organisations';

Offers.addLinks({
  loan: {
    field: 'loanId',
    collection: Loans,
    type: 'one',
  },
  user: {
    field: 'userId',
    collection: Users,
    type: 'one',
  },
  organisation: {
    field: 'organisationLink',
    collection: Organisations,
    type: 'one',
    metadata: true,
  },
});
