import { expect } from 'chai';

import { resetDatabase } from '../../../../utils/testHelpers';
import generator from '../../../factories/server';
import {
  LOAN_CATEGORIES,
  LOAN_STATUS,
  STEPS,
} from '../../../loans/loanConstants';
import Loans from '../../../loans/loans';
import LoanService from '../../../loans/server/LoanService';
import { cleanAllData } from '../../../migrations/server/dataCleaning';
import { doesUserExist, updateUser } from '../../../users/methodDefinitions';
import { getMethodLogs } from './methodLogs.test';

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

  describe('methodLogs', () => {
    it('should store all methods called', async () => {
      generator({
        users: { emails: [{ address: 'dev@e-potek.ch', verified: true }] },
      });

      await doesUserExist.run({ email: 'dev@e-potek.ch' });
      await doesUserExist.run({ email: 'test@e-potek.ch' });

      const methodLogs = getMethodLogs({
        _id: 1,
        name: 1,
        params: 1,
        result: 1,
      });
      const [call1, call2] = methodLogs;

      expect(methodLogs.length).to.equal(2);
      expect(call1.name).to.equal('doesUserExist');
      expect(call1.result).to.equal(true);
      expect(call2.result).to.equal(false);
      expect(call1.params).to.deep.equal({ email: 'dev@e-potek.ch' });
      expect(call2.params).to.deep.equal({ email: 'test@e-potek.ch' });
    });

    it('should store errors', async () => {
      try {
        await updateUser.run({ userId: 'yoo', object: { firstName: 'Dude' } });
      } catch (error) {}

      const [call1] = getMethodLogs({
        _id: 1,
        name: 1,
        params: 1,
        result: 1,
        error: 1,
      });
      expect(call1.error.error).to.equal('NOT_AUTHORIZED');
    });
  });
});
