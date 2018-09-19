import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';

import Loans from '../../../../core/api/loans';
import Borrowers from '../../../../core/api/borrowers';
import Properties from '../../../../core/api/properties';
import { FAKE_LOAN_NAME } from './fakes';

Factory.define('testBorrower', Borrowers);

Factory.define('testLoan', Loans, {
  createdAt: () => new Date(),
  borrowerIds: [],
  status: 'ACTIVE',
  documents: () => ({}),
  logic: () => ({
    auction: { status: '' },
    lender: {},
    verification: {},
    step: 1,
  }),
  emails: () => [],
  propertyIds: [],
  name: FAKE_LOAN_NAME,
});

Factory.define('testProperty', Properties, {
  value: 1000000,
});
