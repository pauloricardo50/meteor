import { Factory } from 'meteor/dburles:factory';

import Loans from '../../../../loans';
import Borrowers from '../../../../borrowers';
import Properties from '../../../../properties';
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
});
