//
/* eslint-env-mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import generator from 'core/api/factories/index';
import { up, down } from '../30';
import LoanService from '../../../loans/server/LoanService';

describe('Migration 30', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('adds lender organisation link on a loan with a selected structure and a selected offer', async () => {
      generator({
        loans: {
          _id: 'loan',
          structures: [
            {
              id: 'struct',
              offerId: 'offer',
            },
          ],
          selectedStructure: 'struct',
          lenders: [
            {
              organisation: { _id: 'org' },
              offers: [{ _id: 'offer' }],
            },
          ],
        },
      });

      await up();

      const loan = LoanService.get('loan', {
        selectedLenderOrganisation: { _id: 1 },
      });

      expect(loan.selectedLenderOrganisation).to.deep.include({
        _id: 'org',
      });
    });

    it('does not add lender organisation link on a loan with a selected structure and no selected offer', async () => {
      generator({
        loans: {
          _id: 'loan',
          structures: [{ id: 'struct' }],
          selectedStructure: 'struct',
          lenders: [
            {
              organisation: { _id: 'org' },
              offers: [{ _id: 'offer' }],
            },
          ],
        },
      });

      await up();

      const loan = LoanService.get('loan', {
        selectedLenderOrganisation: { _id: 1 },
      });

      expect(loan.selectedLenderOrganisation).to.equal(undefined);
    });

    it('does not add lender organisation link on a loan with a selected structure and no offer', async () => {
      generator({
        loans: {
          _id: 'loan',
          structures: [{ id: 'struct' }],
          selectedStructure: 'struct',
        },
      });

      await up();

      const loan = LoanService.get('loan', {
        selectedLenderOrganisation: { _id: 1 },
      });

      expect(loan.selectedLenderOrganisation).to.equal(undefined);
    });

    it('does not add lender organisation link on a loan without a selected structure', async () => {
      generator({
        loans: {
          _id: 'loan',
          structures: [{ id: 'struct' }],
        },
      });

      await up();

      const loan = LoanService.get('loan', {
        selectedLenderOrganisation: { _id: 1 },
      });

      expect(loan.selectedLenderOrganisation).to.equal(undefined);
    });
  });

  describe('down', () => {
    it('removes lender organisation link on loans', async () => {
      generator({
        loans: {
          _id: 'loan',
          structures: [{ id: 'struct' }],
          selectedStructure: 'struct',
          lenders: [
            {
              organisation: { _id: 'org' },
              offers: [{ _id: 'offer' }],
            },
          ],
        },
      });

      await up();
      await down();

      const loan = LoanService.get('loan', {
        selectedLenderOrganisation: { _id: 1 },
      });
      expect(loan.selectedLenderOrganisation).to.equal(undefined);
    });
  });
});
