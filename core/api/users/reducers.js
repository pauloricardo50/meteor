import { getUserDisplayName } from 'core/utils/userFunctions';
import Users from './users';

Users.addReducers({
  email: {
    body: {
      emails: 1,
    },
    reduce: ({ emails }) => emails && emails.length && emails[0].address,
  },
  name: {
    body: {
      firstName: 1,
      lastName: 1,
      emails: 1,
    },
    reduce: getUserDisplayName,
  },
});
