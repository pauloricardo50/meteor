import { expect } from 'chai';

import { resetDatabase } from '../../../../utils/testHelpers';
import generator from '../../../factories/server';
import InsuranceRequestService from '../../../insuranceRequests/server/InsuranceRequestService';
import LoanService from '../../../loans/server/LoanService';
import { down, up } from '../37';

/* eslint-env-mocha */

describe('Migration 37', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('adds links on existing revenues', async () => {
      generator({
        loans: {
          _id: 'loanId',
          revenues: [{}],
          insuranceRequests: { revenues: [{}, {}] },
        },
      });

      const loan1 = LoanService.get('loanId', { revenues: { _id: 1 } });
      expect(loan1.revenues.length).to.equal(1);

      const promises = await up();
      expect(promises.length).to.equal(2);

      const loan2 = LoanService.get('loanId', { revenues: { _id: 1 } });
      expect(loan2.revenues.length).to.equal(3);
    });

    it('ignores insuranceRequests that are not linked', async () => {
      generator({
        loans: [
          { _id: 'loanId', revenues: [{}] },
          { insuranceRequests: { revenues: [{}, {}, {}] } },
        ],
        insuranceRequests: { revenues: [{}, {}] },
      });

      const promises = await up();
      expect(promises.length).to.equal(3);
    });

    it('links revenues from multiple insuranceRequests on one loan', async () => {
      generator({
        loans: [
          { _id: 'loanId1', revenues: [{}] },
          { _id: 'loanId2', insuranceRequests: { revenues: [{}, {}, {}] } },
          {
            _id: 'loanId3',
            insuranceRequests: [{ revenues: [{}, {}, {}] }, { revenues: {} }],
          },
        ],
        insuranceRequests: { revenues: [{}, {}] },
      });

      const promises = await up();
      expect(promises.length).to.equal(7);

      const loan1 = LoanService.get('loanId1', { revenues: { _id: 1 } });
      expect(loan1.revenues.length).to.equal(1);

      const loan2 = LoanService.get('loanId2', { revenues: { _id: 1 } });
      expect(loan2.revenues.length).to.equal(3);

      const loan3 = LoanService.get('loanId3', { revenues: { _id: 1 } });
      expect(loan3.revenues.length).to.equal(4);
    });

    it('does not link a revenue twice if it is already linked', async () => {
      generator({
        loans: {
          _id: 'loanId',
          revenues: [{}, { _id: 'revenueId' }],
          insuranceRequests: { revenues: { _id: 'revenueId' } },
        },
      });

      const loan1 = LoanService.get('loanId', { revenueLinks: 1 });
      expect(loan1.revenueLinks.length).to.equal(2);

      const promises = await up();
      expect(promises.length).to.equal(1);

      const loan2 = LoanService.get('loanId', { revenueLinks: 1 });
      expect(loan2.revenueLinks.length).to.equal(2);
    });
  });

  describe('down', () => {
    it('removes linked revenues that are on both loan and insuranceRequest', async () => {
      generator({
        loans: {
          _id: 'loanId',
          revenues: [
            { _id: 'revenueId1' },
            { _id: 'revenueId2' },
            { _id: 'revenueId3' },
          ],
          insuranceRequests: { _id: 'irId', revenues: { _id: 'revenueId2' } },
        },
      });

      const promises = await down();
      expect(promises.length).to.equal(1);

      const loan = LoanService.get('loanId', { revenueLinks: 1 });
      expect(loan.revenueLinks.length).to.equal(2);
      expect(loan.revenueLinks.includes('revenueId1')).to.equal(true);
      expect(loan.revenueLinks.includes('revenueId3')).to.equal(true);

      const insuranceRequest = InsuranceRequestService.get('irId', {
        revenueLinks: 1,
      });
      expect(insuranceRequest.revenueLinks.length).to.equal(1);
    });

    it('removes links from multiple insuranceRequests', async () => {
      generator({
        loans: [
          { _id: 'loanId1', revenues: [{}] },
          {
            _id: 'loanId2',
            revenues: { _id: 'a' },
            insuranceRequests: { revenues: [{}, { _id: 'a' }, {}] },
          },
          {
            _id: 'loanId3',
            revenues: [{}, { _id: 'b' }, { _id: 'c' }],
            insuranceRequests: [
              { revenues: [{}, {}, { _id: 'b' }] },
              { revenues: { _id: 'c' } },
            ],
          },
        ],
        insuranceRequests: { revenues: [{}, {}] },
      });

      const promises = await down();
      expect(promises.length).to.equal(3);

      const loan1 = LoanService.get('loanId1', { revenueLinks: 1 });
      expect(loan1.revenueLinks.length).to.equal(1);

      const loan2 = LoanService.get('loanId2', { revenueLinks: 1 });
      expect(loan2.revenueLinks.length).to.equal(0);

      const loan3 = LoanService.get('loanId3', { revenueLinks: 1 });
      expect(loan3.revenueLinks.length).to.equal(1);
    });
  });
});
