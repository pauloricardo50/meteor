import Properties from './properties';
import { Users, Loans, Promotions } from '..';

Properties.addLinks({
  user: {
    field: 'userId',
    collection: Users,
    type: 'one',
  },
  loans: {
    collection: Loans,
    inversedBy: 'properties',
  },
  promotions: {
    collection: Promotions,
    inversedBy: 'properties',
  },
});
