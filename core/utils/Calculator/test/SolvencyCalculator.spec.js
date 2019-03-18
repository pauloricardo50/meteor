// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import Calculator from '..';
import { OWN_FUNDS_USAGE_TYPES } from 'core/api/constants';
import { OWN_FUNDS_TYPES, RESIDENCE_TYPE } from '../../../api/constants';

describe('SolvencyCalculator', () => {
  describe('suggestStructure', () => {
    let loan;
    let borrower;

    beforeEach(() => {
      borrower = { _id: 'borrowerId' };
      loan = { borrowers: [borrower] };
    });

    it('suggests a structure with all bankFortune if possible', () => {
      borrower.bankFortune = 500000;
      expect(Calculator.suggestStructure({ loan, propertyValue: 1000000 })).to.deep.equal([
        {
          type: OWN_FUNDS_TYPES.BANK_FORTUNE,
          value: 250000,
          borrowerId: 'borrowerId',
        },
      ]);
    });

    it('calculates exact notary fees if the canton is set', () => {
      borrower.bankFortune = 500000;
      expect(Calculator.suggestStructure({
        loan,
        propertyValue: 1000008,
        canton: 'GE',
      })).to.deep.equal([
        {
          type: OWN_FUNDS_TYPES.BANK_FORTUNE,
          value: 255316,
          borrowerId: 'borrowerId',
        },
      ]);
    });

    it('suggests a structure with multiple ownFunds', () => {
      borrower.bankFortune = 200000;
      borrower.insurance3B = [{ value: 100000 }];
      expect(Calculator.suggestStructure({ loan, propertyValue: 1000000 })).to.deep.equal([
        {
          type: OWN_FUNDS_TYPES.BANK_FORTUNE,
          value: 200000,
          borrowerId: 'borrowerId',
        },
        {
          type: OWN_FUNDS_TYPES.INSURANCE_3B,
          value: 50000,
          borrowerId: 'borrowerId',
          usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
        },
      ]);
    });

    it('does not use 2nd pillar if not a main residence', () => {
      borrower.bankFortune = 200000;
      borrower.insurance2 = [{ value: 100000 }];
      expect(Calculator.suggestStructure({ loan, propertyValue: 1000000 })).to.deep.equal([
        {
          type: OWN_FUNDS_TYPES.BANK_FORTUNE,
          value: 200000,
          borrowerId: 'borrowerId',
        },
      ]);
    });

    it('uses 2nd pillar if not a main residence', () => {
      borrower.bankFortune = 200000;
      borrower.insurance2 = [{ value: 100000 }];
      expect(Calculator.suggestStructure({
        loan,
        propertyValue: 1000000,
        residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
      })).to.deep.equal([
        {
          type: OWN_FUNDS_TYPES.BANK_FORTUNE,
          value: 200000,
          borrowerId: 'borrowerId',
        },
        {
          type: OWN_FUNDS_TYPES.INSURANCE_2,
          value: 50000,
          borrowerId: 'borrowerId',
          usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
        },
      ]);
    });
  });

  describe('getMaxPropertyValue', () => {
    it('recommends a standard value with unlimited income', () => {
      expect(Calculator.getMaxPropertyValue({
        borrowers: [{ bankFortune: 500000, salary: 1000000 }],
      })).to.equal(2000000);
    });

    it('recommends a standard value with unlimited income', () => {
      expect(Calculator.getMaxPropertyValue({
        borrowers: [{ bankFortune: 455000, salary: 1000000 }],
      })).to.equal(1820000);
    });

    it('returns 0 with no income', () => {
      expect(Calculator.getMaxPropertyValue({
        borrowers: [{ bankFortune: 500000, salary: 0 }],
      })).to.equal(0);
    });

    it('returns 0 with no fortune', () => {
      expect(Calculator.getMaxPropertyValue({
        borrowers: [{ bankFortune: 0, salary: 1000000 }],
      })).to.equal(0);
    });

    it('recommends a standard value with unlimited own Funds', () => {
      expect(Calculator.getMaxPropertyValue({
        borrowers: [{ bankFortune: 500000, salary: 180000 }],
      })).to.equal(1000000);
    });
  });

  describe('suggestStructureForLoan', () => {
    it('suggests a structure including for property work', () => {
      expect(Calculator.suggestStructureForLoan({
        loan: {
          borrowers: [
            { bankFortune: 500000, salary: 180000, _id: 'borrower1' },
          ],
          structures: [
            { id: 'struct1', propertyValue: 900000, propertyWork: 100000 },
          ],
        },
        structureId: 'struct1',
      })).to.deep.equal([
        { type: 'bankFortune', value: 245000, borrowerId: 'borrower1' },
      ]);
    });
  });

  describe.only('getMaxPropertyValueWithoutBorrowRatio', () => {
    it('finds the ideal borrowRatio', () => {
      const {
        borrowRatio,
        propertyValue,
      } = Calculator.getMaxPropertyValueWithoutBorrowRatio2({
        borrowers: [{ bankFortune: 500000, salary: 1000000 }],
      });
      expect(borrowRatio).to.equal(0.8);
      expect(propertyValue).to.equal(2000000);
    });

    it('finds the ideal borrowRatio', () => {
      const {
        borrowRatio,
        propertyValue,
      } = Calculator.getMaxPropertyValueWithoutBorrowRatio2({
        borrowers: [{ bankFortune: 250000, salary: 100000 }],
      });
      expect(borrowRatio).to.equal(0.6938);
      expect(propertyValue).to.equal(700000);
    });

    it('finds the ideal borrowRatio', () => {
      const {
        borrowRatio,
        propertyValue,
      } = Calculator.getMaxPropertyValueWithoutBorrowRatio2({
        borrowers: [{ bankFortune: 250000, salary: 50000 }],
      });
      expect(borrowRatio).to.equal(0.515);
      expect(propertyValue).to.equal(466000);
    });

    it('finds the ideal borrowRatio', () => {
      const {
        borrowRatio,
        propertyValue,
      } = Calculator.getMaxPropertyValueWithoutBorrowRatio2({
        borrowers: [{ bankFortune: 200000, salary: 83000 }],
      });
      expect(borrowRatio).to.equal(0.7);
      expect(propertyValue).to.equal(571000);
    });
  });
});
