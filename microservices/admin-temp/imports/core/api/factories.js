import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';

import LoanRequests from './loanrequests/loanrequests';
import Borrowers from './borrowers/borrowers';
import Offers from './offers/offers';
import Comparators from './comparators/comparators';
import Properties from './properties/properties';
import AdminActions from './adminActions/adminActions';

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

Factory.define('partner', Meteor.users, {
  roles: () => 'partner',
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

Factory.define('loanRequest', LoanRequests, {
  createdAt: () => new Date(),
  general: () => ({
    fortuneUsed: 250000,
    insuranceFortuneUsed: 0,
    partnersToAvoid: ['joe', 'john'],
  }),
  borrowers: [],
  status: 'active',
  property: () => ({ value: 1000000 }),
  files: () => ({}),
  logic: () => ({
    auction: {},
    lender: {},
    verification: {},
    step: 1,
  }),
  name: () => 'request name',
  emails: () => [],
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

Factory.define('adminAction', AdminActions, {
  type: 'test',
  status: 'active',
});

Factory.define('comparator', Comparators, {
  customFields: [],
  customFieldCount: 0,
  hiddenFields: [],
  borrowRatio: 0.8,
});

Factory.define('property', Properties, {
  name: 'testName',
  address: 'testAddress',
  value: 100000,
  latitude: 10,
  longitude: 20,
});
