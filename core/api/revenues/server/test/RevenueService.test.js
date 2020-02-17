/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import LoanService from '../../../loans/server/LoanService';
import generator from '../../../factories/server';
import { REVENUE_STATUS, REVENUE_TYPES } from '../../revenueConstants';
import RevenueService from '../RevenueService';

describe('RevenueService', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('getGeneratedRevenues', () => {
    it('returns 0 if no revenues exist', () => {
      generator({
        organisations: { _id: 'org', name: 'org1' },
        revenues: [],
      });

      const result = RevenueService.getGeneratedRevenues({
        organisationId: 'org',
      });

      expect(result).to.equal(0);
    });

    it('only gets revenues of the requested org', () => {
      generator({
        organisations: { _id: 'org', name: 'org1' },
        revenues: [
          {
            organisations: { _id: 'org2', $metadata: { commissionRate: 0.2 } },
            amount: 100,
            status: REVENUE_STATUS.CLOSED,
          },
        ],
      });

      const result = RevenueService.getGeneratedRevenues({
        organisationId: 'org',
      });

      expect(result).to.equal(0);
    });

    it('returns all of one revenue', () => {
      generator({
        organisations: { _id: 'org' },
        revenues: [
          {
            organisations: { _id: 'org', $metadata: { commissionRate: 0.2 } },
            amount: 100,
            status: REVENUE_STATUS.CLOSED,
          },
        ],
      });

      const result = RevenueService.getGeneratedRevenues({
        organisationId: 'org',
      });

      expect(result).to.equal(100);
    });

    it('only counts closed revenues', () => {
      generator({
        organisations: { _id: 'org' },
        revenues: [
          {
            organisations: { _id: 'org', $metadata: { commissionRate: 0.2 } },
            amount: 100,
            status: REVENUE_STATUS.CLOSED,
          },
          {
            organisations: { _id: 'org', $metadata: { commissionRate: 0.2 } },
            amount: 100,
            status: REVENUE_STATUS.EXPECTED,
          },
        ],
      });

      const result = RevenueService.getGeneratedRevenues({
        organisationId: 'org',
      });

      expect(result).to.equal(100);
    });

    it('splits revenues if there are multiple organisations', () => {
      generator({
        organisations: { _id: 'org', name: 'org1' },
        revenues: [
          {
            organisations: [
              { _id: 'org', $metadata: { commissionRate: 0.2 } },
              { _id: 'org2', $metadata: { commissionRate: 0.2 } },
            ],
            amount: 100,
            status: REVENUE_STATUS.CLOSED,
          },
          {
            organisations: [{ _id: 'org', $metadata: { commissionRate: 0.2 } }],
            amount: 100,
            status: REVENUE_STATUS.CLOSED,
          },
        ],
      });

      const result = RevenueService.getGeneratedRevenues({
        organisationId: 'org',
      });

      expect(result).to.equal(150);
    });
  });

  describe('links and caches', () => {
    it('adds a loanCache on revenues', () => {
      generator({
        revenues: {
          _id: 'rev',
          amount: 1000,
          loan: {
            _id: 'loanId',
            name: '18-0001',
            user: { _id: 'user' },
          },
        },
      });

      const revenue = RevenueService.get('rev', { loanCache: 1 });

      expect(revenue.loanCache).to.deep.equal([
        {
          _id: 'loanId',
          name: '18-0001',
        },
      ]);
    });
  });

  describe('remove', () => {
    it('removes a revenue from a loan without throwing a mongo error', () => {
      // Fixed by adding an autovalue on revenueLinks in LoanSchema
      generator({
        loans: [{ revenueLinks: [] }, { _id: 'loan' }],
      });

      const revenueId = RevenueService.insert({
        revenue: {
          amount: 100,
          type: REVENUE_TYPES.MORTGAGE,
          expectedAt: new Date(),
        },
        loanId: 'loan',
      });

      RevenueService.remove({ revenueId });

      const loan = LoanService.get('loan', { revenueLinks: 1 });

      expect(loan.revenueLinks).to.deep.equal([]);

      expect(RevenueService.find({}).fetch()).to.deep.equal([]);
    });
  });
});
