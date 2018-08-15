import Loans from '.';

Loans.addReducers({
  structure2: {
    body: {},
    reduce({}) {
      return 'fullName';
    },
  },
});
