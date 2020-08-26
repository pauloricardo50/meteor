/* eslint-env mocha */
import { expect } from 'chai';

import { resetDatabase } from '../../../../utils/testHelpers';
import LoanService from '../../../loans/server/LoanService';
import { down, up } from '../42';

describe('Migration 42', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('sets hasCompletedOnboarding to true for loan with full applicationType', async () => {
      await LoanService.collection
        .rawCollection()
        .insert({ _id: 'l1', name: '20-0001', applicationType: 'FULL' });
      await LoanService.collection
        .rawCollection()
        .insert({ _id: 'l2', name: '20-0002', applicationType: 'FULL' });
      await LoanService.collection
        .rawCollection()
        .insert({ _id: 'l3', name: '20-0003', applicationType: 'SIMPLE' });

      await up();

      const loans = LoanService.fetch({
        $filters: { hasCompletedOnboarding: true },
        _id: 1,
      });

      expect(loans.length).to.equal(2);
      expect(loans.map(({ _id }) => _id)).to.include('l1');
      expect(loans.map(({ _id }) => _id)).to.include('l2');
    });

    it('sets hasStartedOnboarding to true for all loans', async () => {
      await LoanService.collection
        .rawCollection()
        .insert({ _id: 'l1', name: '20-0001' });
      await LoanService.collection
        .rawCollection()
        .insert({ _id: 'l2', name: '20-0002' });
      await LoanService.collection
        .rawCollection()
        .insert({ _id: 'l3', name: '20-0003' });

      await up();

      const loans = LoanService.fetch({
        $filters: { hasStartedOnboarding: true },
        _id: 1,
      });

      expect(loans.length).to.equal(3);
    });
  });

  describe('down', () => {
    it('unsets hasCompletedOnboarding and hasStartedOnboarding on all loans', async () => {
      await LoanService.collection.rawCollection().insert({
        _id: 'l1',
        hasCompletedOnboarding: true,
        hasStartedOnboarding: true,
        name: '20-0001',
      });
      await LoanService.collection
        .rawCollection()
        .insert({ _id: 'l2', hasCompletedOnboarding: true, name: '20-0002' });
      await LoanService.collection
        .rawCollection()
        .insert({ _id: 'l3', hasStartedOnboarding: true, name: '20-0003' });

      await down();

      const loans = LoanService.fetch({
        $filters: {
          $or: [
            { hasCompletedOnboarding: true },
            { hasStartedOnboarding: true },
          ],
        },
        _id: 1,
      });

      expect(loans.length).to.equal(0);
    });
  });
});
