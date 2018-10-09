import { addressReducer } from '../reducers';
import Borrowers from './borrowers';

Borrowers.addReducers({
  name: {
    body: {
      firstName: 1,
      lastName: 1,
    },
    reduce: ({ firstName, lastName }) =>
      [firstName, lastName].filter(x => x).join(' '),
  },
  ...addressReducer,
});
