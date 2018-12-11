import { addressReducer, tasksReducer } from '../reducers';
import Contacts from './contacts';

Contacts.addReducers({
  name: {
    body: {
      firstName: 1,
      lastName: 1,
    },
    reduce: ({ firstName, lastName }) =>
      [firstName, lastName].filter(x => x).join(' '),
  },
  ...addressReducer,
  ...tasksReducer,
});
