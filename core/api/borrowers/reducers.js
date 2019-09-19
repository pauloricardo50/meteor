import { getAgeFromBirthDate } from '../../utils/borrowerUtils';
import addressReducer from '../reducers/addressReducer';
import Borrowers from './borrowers';

Borrowers.addReducers({
  name: {
    body: {
      firstName: 1,
      lastName: 1,
    },
    reduce: ({ firstName, lastName }) => {
      const name = [firstName, lastName].filter(x => x).join(' ');
      return name.reverseFirstLastName();
    },
  },
  age: {
    body: { birthDate: 1 },
    reduce: ({ birthDate }) => getAgeFromBirthDate(birthDate),
  },
  ...addressReducer,
});
