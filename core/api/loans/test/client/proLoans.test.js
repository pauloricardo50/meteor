/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { userLogin } from 'core/utils/testHelpers/testHelpers';
import { ROLES } from 'core/api/constants';

import { generateScenario } from 'core/api/methods/index';
import proLoans from '../proLoans.test';

const fetchLoans = userId =>
  new Promise((resolve, reject) => {
    proLoans.clone({ userId }).fetch((err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });

const createUserWithLoan = referredByUserLink =>
  generateScenario.run({
    scenario: { users: { referredByUserLink, loans: {} } },
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
    it('uses the cache when necessary', () => {
      let t0;
      let t1;

      return userLogin({ role: ROLES.ADMIN })
        .then(() => createProUser('proId'))
        .then(() => createUserWithLoan('proId'))
        .then(() => {
          t0 = performance.now();
          return fetchLoans('proId');
        })
        .then((loans) => {
          t1 = performance.now();
          expect(loans.length).to.equal(1);
          expect(t1 - t0).to.be.within(500, 2000);
          return fetchLoans('proId');
        })
        .then((loans) => {
          const t2 = performance.now();
          expect(loans.length).to.equal(1);
          expect(t2 - t1).to.be.within(0, 100);
        });
    });

    it('resets the cache when necessary', () => {
      let t0;
      let t1;
      let t2;

      return userLogin({ role: ROLES.ADMIN })
        .then(() => createProUser('proId'))
        .then(() => createUserWithLoan('proId'))
        .then(() => {
          t0 = performance.now();
          return fetchLoans('proId');
        })
        .then((loans) => {
          t1 = performance.now();
          expect(loans.length).to.equal(1);
          expect(t1 - t0).to.be.within(500, 2000);
          return createUserWithLoan('proId');
        })
        .then(() => {
          t2 = performance.now();
          return fetchLoans('proId');
        })
        .then((loans) => {
          const t3 = performance.now();
          expect(loans.length).to.equal(2);
          expect(t3 - t2).to.be.within(500, 2000);
        });
    });
  });
});
