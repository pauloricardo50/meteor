import Lenders from '../lenders';
import Users from '../users/users';
import Offers from './offers';

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
  },
});
