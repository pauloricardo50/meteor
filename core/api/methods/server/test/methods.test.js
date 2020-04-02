import { resetDatabase } from 'meteor/xolvio:cleaner';

/* eslint-env mocha */
import { expect } from 'chai';

import {
  LOAN_CATEGORIES,
  LOAN_STATUS,
  STEPS,
} from 'core/api/loans/loanConstants';
import { cleanAllData } from 'core/api/migrations/server/dataCleaning';
import { checkEmails } from 'core/utils/testHelpers';

import { EMAIL_IDS } from '../../../email/emailConstants';
import Loans from '../../../loans/loans';
import LoanService from '../../../loans/server/LoanService';
import { submitContactForm } from '../../methodDefinitions';

describe('methods', function() {
  this.timeout(10000);

  beforeEach(() => {
    resetDatabase();
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

      const { structures = [] } = LoanService.get('loan', { structures: 1 });

      expect(structures[0].wantedLoan).to.equal(1111000);
    });

    it('should keep empty strings', async () => {
      await Loans.rawCollection().insert({
        _id: 'loan',
        name: '',
      });

      await cleanAllData();

      const { name } = LoanService.get('loan', { name: 1 });

      expect(name).to.equal('');
    });

    it('should add default values', async () => {
      await Loans.rawCollection().insert({
        _id: 'loan',
      });

      await cleanAllData();

      const { anonymous, category, status, step } = LoanService.get('loan', {
        anonymous: 1,
        category: 1,
        status: 1,
        step: 1,
      });

      expect(anonymous).to.equal(false);
      expect(category).to.equal(LOAN_CATEGORIES.STANDARD);
      expect(status).to.equal(LOAN_STATUS.LEAD);
      expect(step).to.equal(STEPS.SOLVENCY);
    });
  });
});
