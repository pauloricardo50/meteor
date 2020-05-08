import { expect } from 'chai';

import { resetDatabase } from '../../../../utils/testHelpers';
import { INTEREST_RATES } from '../../../interestRates/interestRatesConstants';
import LoanService from '../../../loans/server/LoanService';
import { down, up } from '../35';

describe('Migration 35', () => {
  beforeEach(() => resetDatabase());

  describe('up', () => {
    it('migrates single loanTranches to money', async () => {
      await LoanService.rawCollection.insert({
        _id: 'loan',
        structures: [
          {
            id: 'struct',
            wantedLoan: 1000000,
            loanTranches: [{ value: 1, type: INTEREST_RATES.YEARS_10 }],
          },
        ],
      });

      await up();

      const { structures = [] } = LoanService.get('loan', { structures: 1 });
      const [structure] = structures;
      expect(structure.loanTranches[0].value).to.equal(1000000);
    });

    it('migrates multiple loanTranches to money', async () => {
      await LoanService.rawCollection.insert({
        _id: 'loan',
        structures: [
          {
            id: 'struct',
            wantedLoan: 1000000,
            loanTranches: [
              { value: 0.5, type: INTEREST_RATES.YEARS_10 },
              { value: 0.5, type: INTEREST_RATES.YEARS_5 },
            ],
          },
        ],
      });

      await up();

      const { structures = [] } = LoanService.get('loan', { structures: 1 });
      const [structure] = structures;
      expect(structure.loanTranches[0].value).to.equal(500000);
      expect(structure.loanTranches[1].value).to.equal(500000);
    });

    it('migrates multiple loanTranches to money in multiple structures', async () => {
      await LoanService.rawCollection.insert({
        _id: 'loan',
        structures: [
          {
            id: 'struct',
            wantedLoan: 1000000,
            loanTranches: [
              { value: 0.5, type: INTEREST_RATES.YEARS_10 },
              { value: 0.5, type: INTEREST_RATES.YEARS_5 },
            ],
          },
          {
            id: 'struct2',
            wantedLoan: 1000000,
            loanTranches: [
              { value: 0.5, type: INTEREST_RATES.YEARS_10 },
              { value: 0.5, type: INTEREST_RATES.YEARS_5 },
            ],
          },
        ],
      });

      await up();

      const { structures = [] } = LoanService.get('loan', { structures: 1 });
      expect(structures[0].loanTranches[0].value).to.equal(500000);
      expect(structures[0].loanTranches[1].value).to.equal(500000);
      expect(structures[1].loanTranches[0].value).to.equal(500000);
      expect(structures[1].loanTranches[1].value).to.equal(500000);
    });
  });

  describe('down', () => {
    it('migrates back single loanTranches to percent', async () => {
      await LoanService.rawCollection.insert({
        _id: 'loan',
        structures: [
          {
            id: 'struct',
            wantedLoan: 1000000,
            loanTranches: [{ value: 1000000, type: INTEREST_RATES.YEARS_10 }],
          },
        ],
      });

      await down();

      const { structures = [] } = LoanService.get('loan', { structures: 1 });
      const [structure] = structures;
      expect(structure.loanTranches[0].value).to.equal(1);
    });

    it('migrates back multiple loanTranches to percent', async () => {
      await LoanService.rawCollection.insert({
        _id: 'loan',
        structures: [
          {
            id: 'struct',
            wantedLoan: 1000000,
            loanTranches: [
              { value: 500000, type: INTEREST_RATES.YEARS_10 },
              { value: 500000, type: INTEREST_RATES.YEARS_5 },
            ],
          },
        ],
      });

      await down();

      const { structures = [] } = LoanService.get('loan', { structures: 1 });
      const [structure] = structures;
      expect(structure.loanTranches[0].value).to.equal(0.5);
      expect(structure.loanTranches[1].value).to.equal(0.5);
    });

    it('migrates back multiple loanTranches to percent in multiple structures', async () => {
      await LoanService.rawCollection.insert({
        _id: 'loan',
        structures: [
          {
            id: 'struct',
            wantedLoan: 1000000,
            loanTranches: [
              { value: 500000, type: INTEREST_RATES.YEARS_10 },
              { value: 500000, type: INTEREST_RATES.YEARS_5 },
            ],
          },
          {
            id: 'struct2',
            wantedLoan: 1000000,
            loanTranches: [
              { value: 500000, type: INTEREST_RATES.YEARS_10 },
              { value: 500000, type: INTEREST_RATES.YEARS_5 },
            ],
          },
        ],
      });

      await down();

      const { structures = [] } = LoanService.get('loan', { structures: 1 });
      expect(structures[0].loanTranches[0].value).to.equal(0.5);
      expect(structures[0].loanTranches[1].value).to.equal(0.5);
      expect(structures[1].loanTranches[0].value).to.equal(0.5);
      expect(structures[1].loanTranches[1].value).to.equal(0.5);
    });
  });
});
