// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import { RESIDENCE_TYPE } from 'core/api/constants';
import NotaryFeesCalculator from '../NotaryFeesCalculator';
import { PURCHASE_TYPE } from '../../../api/constants';

describe('NotaryFeesCalculator', () => {
  let calc;
  let loan;

  beforeEach(() => {
    loan = {
      structure: {
        property: { value: 1000000 },
        wantedLoan: 800000,
      },
    };
  });

  describe('general', () => {
    before(() => {
      calc = new NotaryFeesCalculator({ canton: 'GE' });
    });

    it('returns 0 for buyers contract fees for a refinancing loan', () => {
      loan.purchaseType = PURCHASE_TYPE.REFINANCING;

      const fees = calc.getNotaryFeesForLoan(loan);

      expect(fees.buyersContractFees).to.equal(0);
    });
  });

  describe('GE', () => {
    before(() => {
      calc = new NotaryFeesCalculator({ canton: 'GE' });
    });

    it('returns the correct amount for a buyers contract', () => {
      const fees = calc.getNotaryFeesForLoan(loan);

      expect(fees.buyersContractFees).to.equal(39177.4);
    });

    it('returns the correct amount for a new mortgage note', () => {
      const fees = calc.getNotaryFeesForLoan(loan);

      expect(fees.mortgageNoteFees).to.equal(16135.7);
    });

    it('returns the correct amount as a whole', () => {
      const fees = calc.getNotaryFeesForLoan(loan);

      expect(fees.total).to.equal(55313.1);
    });

    it('returns the correct amount for a main residence with casatax', () => {
      loan.residenceType = RESIDENCE_TYPE.MAIN_RESIDENCE;

      const fees = calc.getNotaryFeesForLoan(loan);

      expect(fees.total).to.equal(32258.1);
    });

    it('caps casatax deductions for very small properties', () => {
      loan.residenceType = RESIDENCE_TYPE.MAIN_RESIDENCE;
      loan.structure.property.value = 400000;
      loan.structure.wantedLoan = 320000;

      const fees = calc.getNotaryFeesForLoan(loan);

      expect(fees.total).to.equal(10052.16);
    });

    it('works for large properties', () => {
      loan.structure.property.value = 3000000;
      loan.structure.wantedLoan = 2400000;
      const fees = calc.getNotaryFeesForLoan(loan);

      expect(fees.total).to.equal(154684.65);
    });

    it('adds tax on propertyWork', () => {
      // Test code
    });
  });

  describe('unknown cantons', () => {
    before(() => {
      calc = new NotaryFeesCalculator({ canton: 'XX' });
    });

    it("returns 5% for cantons where we don't have any Math", () => {
      const fees = calc.getNotaryFeesForLoan(loan);

      expect(fees.total).to.equal(50000);
    });
  });
});
