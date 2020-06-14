import { expect } from 'chai';
import { resetDatabase } from '../../../../utils/testHelpers';

/* eslint-env mocha */

import generator from '../../../factories/server';
import { LOAN_STATUS } from '../../../loans/loanConstants';
import LoanService from '../../../loans/server/LoanService';
import { REVENUE_STATUS, REVENUE_TYPES } from '../../revenueConstants';
import RevenueService from '../RevenueService';

describe('RevenueService', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('insert', () => {
    it('adds a link to a loan', () => {
      generator({ loans: { _id: 'loanId' } });

      const id = RevenueService.insert({
        revenue: {
          amount: 100,
          type: REVENUE_TYPES.MORTGAGE,
          expectedAt: new Date(),
        },
        loanId: 'loanId',
      });
      const revenue = RevenueService.get(id, { loan: { _id: 1 } });
      expect(revenue.loan._id).to.equal('loanId');
    });

    it('adds a link to the insuranceRequest and loan if insuranceId is passed', () => {
      generator({
        loans: {
          _id: 'loanId',
          insuranceRequests: {
            _id: 'iRId',
            insurances: { _id: 'insuranceId' },
          },
        },
      });

      const id = RevenueService.insert({
        revenue: {
          amount: 100,
          type: REVENUE_TYPES.MORTGAGE,
          expectedAt: new Date(),
        },
        insuranceId: 'insuranceId',
      });
      const revenue = RevenueService.get(id, {
        loan: { _id: 1 },
        insuranceRequest: { _id: 1 },
        insurance: { _id: 1 },
      });

      expect(revenue.loan._id).to.equal('loanId');
      expect(revenue.insuranceRequest._id).to.equal('iRId');
      expect(revenue.insurance._id).to.equal('insuranceId');
    });

    it('adds a link to the loan if insuranceRequestId is passed', () => {
      generator({
        loans: { _id: 'loanId', insuranceRequests: { _id: 'iRId' } },
      });

      const id = RevenueService.insert({
        revenue: {
          amount: 100,
          type: REVENUE_TYPES.MORTGAGE,
          expectedAt: new Date(),
        },
        insuranceRequestId: 'iRId',
      });
      const revenue = RevenueService.get(id, {
        loan: { _id: 1 },
        insuranceRequest: { _id: 1 },
      });

      expect(revenue.loan._id).to.equal('loanId');
      expect(revenue.insuranceRequest._id).to.equal('iRId');
    });

    it('does not fail if you pass both insuranceId and insuranceRequestId', () => {
      generator({
        loans: {
          _id: 'loanId',
          insuranceRequests: {
            _id: 'iRId',
            insurances: { _id: 'insuranceId' },
          },
        },
      });

      const id = RevenueService.insert({
        revenue: {
          amount: 100,
          type: REVENUE_TYPES.MORTGAGE,
          expectedAt: new Date(),
        },
        insuranceId: 'insuranceId',
        insuranceRequestId: 'iRId',
      });
      const revenue = RevenueService.get(id, {
        loan: { _id: 1 },
        insuranceRequest: { _id: 1 },
        insurance: { _id: 1 },
      });

      expect(revenue.loan._id).to.equal('loanId');
      expect(revenue.insuranceRequest._id).to.equal('iRId');
      expect(revenue.insurance._id).to.equal('insuranceId');
    });
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

  describe('get', () => {
    it('returns a result with _collection', () => {
      // This should be fixed with this PR: https://github.com/cult-of-coders/grapher/pull/421
      generator({
        revenues: {
          _id: 'revId',
          loan: {
            _factory: 'loan',
          },
          organisations: { $metadata: { commissionRate: 0.1 } },
        },
      });

      const result = RevenueService.get('revId', {
        loan: { _id: 1 },
      });

      expect(result.loan._collection).to.equal('loans');
    });
  });

  describe('consolidateRevenue', () => {
    it('sets loan status to FINALIZED if required', () => {
      generator({
        loans: {
          _id: 'loan',
          revenues: { _id: 'revenue', status: REVENUE_STATUS.EXPECTED },
        },
      });

      RevenueService.consolidateRevenue({
        revenueId: 'revenue',
        amount: 10,
        paidAt: new Date(),
      });
      const { status } = LoanService.get('loan', { status: 1 });
      expect(status).to.equal(LOAN_STATUS.FINALIZED);
    });
  });
});
