/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { checkEmails } from 'core/utils/testHelpers/index';
import { cleanAllData } from 'core/api/migrations/server/dataCleaning';
import {
  LOAN_CATEGORIES,
  LOAN_STATUS,
  STEPS,
} from 'core/api/loans/loanConstants';
import methods from '../../registerMethodDefinitions';
import { getRateLimitedMethods } from '../../../../utils/rate-limit';
import { submitContactForm } from '../../methodDefinitions';
import { EMAIL_IDS } from '../../../email/emailConstants';
import { Loans } from '../../..';

describe('methods', function() {
  this.timeout(10000);

  beforeEach(() => {
    resetDatabase();
  });

  Object.keys(methods).forEach(methodName => {
    const method = methods[methodName];
    describe(`method ${methodName}`, () => {
      it('is defined', () =>
        method.run({}).catch(error => {
          expect(error.error).to.not.equal(404);
        }));

      // In the future, remove the if conditional to test that all methods
      // are rate-limited
      // if (methodName === 'impersonateUser') {
      //   it('is rate-limited', () => {
      //     expect(getRateLimitedMethods()).to.include(methodName);
      //   });
      // }
    });
  });

  describe('submitContactForm', () => {
    it('should send 2 emails', () => {
      const address = 'digital@e-potek.ch';
      return submitContactForm
        .run({
          name: 'Florian Bienefelt',
          email: address,
          phoneNumber: '+41 22 566 01 10',
        })
        .then(() => checkEmails(2))
        .then(emails => {
          expect(emails.length).to.equal(2);
          const ids = emails.map(({ emailId }) => emailId);
          expect(ids).to.include(EMAIL_IDS.CONTACT_US);
          expect(ids).to.include(EMAIL_IDS.CONTACT_US_ADMIN);
        });
    });
  });

  describe('cleanDatabase', () => {
    it('should round wantedLoan', async () => {
      await Loans.rawCollection().insert({
        _id: 'loan',
        structures: [{ wantedLoan: 1111111 }],
      });

      await cleanAllData();

      const { structures = [] } = Loans.findOne({ _id: 'loan' });

      expect(structures[0].wantedLoan).to.equal(1111000);
    });

    it('should keep empty strings', async () => {
      await Loans.rawCollection().insert({
        _id: 'loan',
        name: '',
      });

      await cleanAllData();

      const { name } = Loans.findOne({ _id: 'loan' });

      expect(name).to.equal('');
    });

    it('should add default values', async () => {
      await Loans.rawCollection().insert({
        _id: 'loan',
      });

      await cleanAllData();

      const { anonymous, category, status, step } = Loans.findOne({
        _id: 'loan',
      });

      expect(anonymous).to.equal(false);
      expect(category).to.equal(LOAN_CATEGORIES.STANDARD);
      expect(status).to.equal(LOAN_STATUS.LEAD);
      expect(step).to.equal(STEPS.SOLVENCY);
    });
  });
});
