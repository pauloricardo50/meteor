// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import Calculator from '..';
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
          value: 255315.5,
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
        },
      ]);
    });
  });

  describe.only('getMaxPropertyValue', () => {
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
});
