import Offers from './offers';
import { Users, Lenders } from '..';

Offers.addLinks({
  user: {
    field: 'userId',
    collection: Users,
    type: 'one',
  },
  lender: {
    field: 'lenderLink',
    collection: Lenders,
    type: 'one',
    metadata: true,
    denormalize: {
      field: 'lenderCache',
      body: {
        loanLink: 1,
      },
    },
  },
});
