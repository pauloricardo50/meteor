import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import {
  Loans,
  Borrowers,
  Offers,
  Comparators,
  Properties,
  AdminActions,
} from '.';

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
  files: () => ({}),
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
  files: () => ({}),
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
  files: () => ({}),
});

Factory.define('offer', Offers, {
  createdAt: () => new Date(),
  organization: 'bankName',
  canton: 'GE',
  auctionEndTime: () => new Date(),
  standardOffer: () => ({
    maxAmount: 800000,
    amortization: 0.01,
    interestLibor: 0.01,
    interest1: 0.01,
    interest2: 0.01,
    interest5: 0.01,
    interest10: 0.01,
  }),
});

Factory.define('comparator', Comparators, {
  customFields: [],
  customFieldCount: 0,
  hiddenFields: [],
  borrowRatio: 0.8,
});

Factory.define('comparatorProperty', Properties, {
  name: 'testName',
  address: 'testAddress',
  value: 100000,
  latitude: 10,
  longitude: 20,
});
