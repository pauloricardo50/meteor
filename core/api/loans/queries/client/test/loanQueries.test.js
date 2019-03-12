/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { userLogin } from 'core/utils/testHelpers/testHelpers';
import { ROLES } from 'core/api/constants';

import { generateScenario } from 'core/api/methods/index';
import proLoans from '../../proLoans';


const fetchLoans = ({ userId, withTimeout = false }) => {
  const fetchPromise = new Promise((resolve, reject) => {
    proLoans.clone({ userId }).fetch((err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });

  const timeout = new Promise((resolve, reject) => {
    const wait = setTimeout(() => {
      clearTimeout(wait);
      reject(new Meteor.Error('Timed out'));
    }, 10);
  });

  if (withTimeout) {
    return Promise.race([fetchPromise, timeout]);
  }

  return fetchPromise;
};

const createUserWithLoan = referredByUserLink =>
  generateScenario.run({
    scenario: {
      users: {
        _factory: 'user',
        referredByUserLink,
        loans: { _factory: 'loan' },
      },
    },
  });

const createProUser = userId =>
  generateScenario.run({
    scenario: {
      users: { _factory: 'pro', _id: userId },
    },
  });

describe('loanQueries', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('proLoans', () => {
    it('shows all referred loans', () =>
      userLogin({ role: ROLES.ADMIN })
        .then(() => createProUser('proId'))
        .then(() => createUserWithLoan('proId'))
        .then(() => fetchLoans({ userId: 'proId' }))
        .then((loans) => {
          expect(loans.length).to.equal(1);
          return createUserWithLoan('proId');
        })
        .then(() => fetchLoans({ userId: 'proId' }))
        .then((loans) => {
          expect(loans.length).to.equal(2);
        }));

    it('uses the cache', () =>
      userLogin({ role: ROLES.ADMIN })
        .then(() => createProUser('proId'))
        .then(() => createUserWithLoan('proId'))
        .then(() => fetchLoans({ userId: 'proId' }))
        .then((loans) => {
          expect(loans.length).to.equal(1);
        })
        .then(() => fetchLoans({ userId: 'proId', withTimeout: true }))
        .then((loans) => {
          expect(loans.length).to.equal(1);
        }));
  });
});
