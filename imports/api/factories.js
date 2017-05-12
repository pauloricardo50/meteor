import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';

import LoanRequests from './loanrequests/loanrequests';
import Borrowers from './borrowers/borrowers';

// Factory users for testing purposes
Factory.define('user', Meteor.users, {
  roles: () => 'user',
  email: () => [{ address: 'user@test.com', verified: false }],
});

Factory.define('dev', Meteor.users, {
  roles: () => 'dev',
  email: () => [{ address: 'dev@test.com', verified: false }],
});

Factory.define('admin', Meteor.users, {
  roles: () => 'admin',
  email: () => [{ address: 'admin@test.com', verified: false }],
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
});

Factory.define(
  'loanRequestDev',
  LoanRequests,
  Factory.extend('loanRequest', {
    userId: Factory.get('dev'),
  }),
);
