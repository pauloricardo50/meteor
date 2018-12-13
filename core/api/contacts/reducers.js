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
  email: {
    body: {
      emails: 1,
    },
    reduce: ({ emails }) => emails && emails.length && emails[0].address,
  },
  phoneNumber: {
    body: {
      phoneNumbers: 1,
    },
    reduce: ({ phoneNumbers }) =>
      phoneNumbers && phoneNumbers.length && phoneNumbers[0],
  },
  ...addressReducer,
  ...tasksReducer,
});
