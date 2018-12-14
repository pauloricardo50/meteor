import Offers from './offers';
import { Loans, Users, Contacts } from '..';
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
  contact: {
    field: 'contactLink',
    collection: Contacts,
    type: 'one',
    metadata: true,
  },
});
