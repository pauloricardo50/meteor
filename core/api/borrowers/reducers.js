import addressReducer from '../reducers/addressReducer';
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
  age: {
    body: { birthDate: 1 },
    reduce: ({ birthDate }) => {
      const age = Math.floor((new Date() - new Date(birthDate)) / 1000 / 60 / 60 / 24 / 365.25);
      return age;
    },
  },
  ...addressReducer,
});
