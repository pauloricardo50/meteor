import Properties from './properties';
import { Users, Loans } from '../';

Properties.addLinks({
  user: {
    field: 'userId',
    collection: Users,
    type: 'one',
  },
  loans: {
    collection: Loans,
    inversedBy: 'property',
  },
});
