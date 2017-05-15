import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';

import LoanRequests from './loanrequests/loanrequests';
import Borrowers from './borrowers/borrowers';
import Offers from './offers/offers';

const chance = require('chance').Chance();

// Factory users for testing purposes
Factory.define('user', Meteor.users, {
  roles: () => 'user',
  emails: () => [{ address: chance.email(), verified: false }],
});

Factory.define('dev', Meteor.users, {
  roles: () => 'dev',
  emails: () => [{ address: chance.email(), verified: false }],
});

Factory.define('admin', Meteor.users, {
  roles: () => 'admin',
  emails: () => [{ address: chance.email(), verified: false }],
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
});

Factory.define('loanRequest', LoanRequests, {
  userId: Factory.get('user'),
  createdAt: () => new Date(),
  general: () => ({ fortuneUsed: 250000, partnersToAvoid: ['joe', 'john'] }),
  borrowers: [Factory.get('borrower')],
  property: () => ({ value: 1000000 }),
  logic: () => ({}),
  admin: () => ({}),
  name: () => 'request name',
});

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
