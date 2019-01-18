import { Factory } from 'meteor/dburles:factory';

import Loans from '../../../../core/api/loans';
import Borrowers from '../../../../core/api/borrowers';
import Properties from '../../../../core/api/properties';
import { FAKE_LOAN_NAME } from './fakes';

Factory.define('testBorrower', Borrowers);

Factory.define('testLoan', Loans, {
  createdAt: () => new Date(),
  borrowerIds: [],
  documents: () => ({}),
  logic: () => ({
    lender: {},
    verification: {},
  }),
  emails: () => [],
  propertyIds: [],
  name: FAKE_LOAN_NAME,
});

Factory.define('testProperty', Properties, {
  value: 1000000,
  valuation: {
    min: 857000,
    max: 1085000,
    value: 998000,
    microlocation: { grade: 4.2 },
  },
});
