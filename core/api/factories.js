import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { Loans, Borrowers, Offers, Properties } from '.';

const TEST_EMAIL = 'test@test.com';

Factory.define('user', Meteor.users, {
  roles: () => 'user',
  emails: () => [{ address: TEST_EMAIL, verified: false }],
  profile: {},
});

Factory.define('dev', Meteor.users, {
  roles: () => 'dev',
  emails: () => [{ address: TEST_EMAIL, verified: false }],
  profile: {},
});

Factory.define('admin', Meteor.users, {
  roles: () => 'admin',
  emails: () => [{ address: TEST_EMAIL, verified: false }],
  profile: {},
});

Factory.define('lender', Meteor.users, {
  roles: () => 'lender',
  emails: () => [{ address: TEST_EMAIL, verified: false }],
  profile: () => ({ organization: 'bankName', cantons: ['GE'] }),
});

Factory.define('borrower', Borrowers, {
  createdAt: () => new Date(),
  expenses: () => [{ description: 'test', value: 1 }],
  documents: () => ({}),
  logic: () => ({}),
  age: 18,
});

Factory.define('loan', Loans, {
  createdAt: () => new Date(),
  general: () => ({
    fortuneUsed: 250000,
    insuranceFortuneUsed: 0,
    partnersToAvoid: ['joe', 'john'],
  }),
  borrowers: [],
  status: 'ACTIVE',
  documents: () => ({}),
  logic: () => ({
    auction: {},
    lender: {},
    verification: {},
    step: 1,
  }),
  name: () => 'loan name',
  emails: () => [],
});

Factory.define('property', Properties, {
  value: 1000000,
  documents: () => ({}),
  expertise: () => ({}),
});

Factory.define('offer', Offers, {
  createdAt: () => new Date(),
  organization: 'bankName',
  canton: 'GE',
  conditions: 'Do something',
  counterparts: 'Do something more',
  standardOffer: () => ({
    maxAmount: 800000,
    amortization: 0.01,
    interestLibor: 0.01,
    interest1: 0.01,
    interest2: 0.01,
    interest5: 0.01,
    interest10: 0.01,
  }),
  counterpartOffer: () => ({
    maxAmount: 800000,
    amortization: 0.008,
    interestLibor: 0.008,
    interest1: 0.008,
    interest2: 0.008,
    interest5: 0.008,
    interest10: 0.008,
  }),
});
