import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';

import LoanRequests from './loanrequests/loanrequests';
import Borrowers from './borrowers/borrowers';
import Offers from './offers/offers';
import Comparators from './comparators/comparators';
import Properties from './properties/properties';
import AdminActions from './adminActions/adminActions';

let chance;
if (Meteor.isTest) {
  chance = require('chance').Chance();
} else {
  chance = { email: () => 'test@test.com' };
}

Factory.define('user', Meteor.users, {
  roles: () => 'user',
  emails: () => [{ address: chance.email(), verified: false }],
  profile: {},
});

Factory.define('dev', Meteor.users, {
  roles: () => 'dev',
  emails: () => [{ address: chance.email(), verified: false }],
  profile: {},
});

Factory.define('admin', Meteor.users, {
  roles: () => 'admin',
  emails: () => [{ address: chance.email(), verified: false }],
  profile: {},
});

Factory.define('partner', Meteor.users, {
  roles: () => 'partner',
  emails: () => [{ address: chance.email(), verified: false }],
  profile: () => ({ organization: 'bankName', cantons: ['GE'] }),
});

Factory.define('borrower', Borrowers, {
  userId: Factory.get('user'),
  createdAt: () => new Date(),
  expenses: () => [{ description: 'test', value: 1 }],
  files: () => ({}),
  logic: () => ({}),
});

Factory.define('loanRequest', LoanRequests, {
  userId: Factory.get('user'),
  createdAt: () => new Date(),
  general: () => ({
    fortuneUsed: 250000,
    insuranceFortuneUsed: 0,
    partnersToAvoid: ['joe', 'john'],
  }),
  borrowers: [Factory.get('borrower')],
  status: 'active',
  property: () => ({ value: 1000000 }),
  files: () => ({}),
  logic: () => ({ auction: {}, lender: {}, verification: {}, step: 1 }),
  name: () => 'request name',
  emails: () => [],
});

Factory.define('loanRequest2', LoanRequests);

Factory.define(
  'loanRequestDev',
  LoanRequests,
  Factory.extend('loanRequest', {
    userId: Factory.get('dev'),
  }),
);

Factory.define('offer', Offers, {
  userId: Factory.get('partner'),
  requestId: Factory.get('loanRequest'),
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
  requestId: Factory.get('loanRequest'),
  type: 'test',
  status: 'active',
});

Factory.define('comparator', Comparators, {
  userId: Factory.get('user'),
  customFields: [],
  customFieldCount: 0,
  hiddenFields: [],
  borrowRatio: 0.8,
});

Factory.define('property', Properties, {
  userId: Factory.get('user'),
  name: 'testName',
  address: 'testAddress',
  value: 100000,
  latitude: 10,
  longitude: 20,
});
