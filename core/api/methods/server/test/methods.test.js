import { expect } from 'chai';

import { resetDatabase } from '../../../../utils/testHelpers';
import { EMAIL_IDS } from '../../../email/emailConstants';
import {
  LOAN_CATEGORIES,
  LOAN_STATUS,
  STEPS,
} from '../../../loans/loanConstants';
import Loans from '../../../loans/loans';
import LoanService from '../../../loans/server/LoanService';
import { cleanAllData } from '../../../migrations/server/dataCleaning';

/* eslint-env mocha */

describe('methods', function () {
  this.timeout(10000);

  beforeEach(() => {
    resetDatabase();
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
