/* eslint-env mocha */
import { expect } from 'chai';

import { RESIDENCE_TYPE } from 'core/api/constants';
import NotaryFeesCalculator from '../NotaryFeesCalculator';
import { PURCHASE_TYPE, PROMOTION_TYPES } from '../../../api/constants';
import { GE } from '../cantonConstants';

describe('NotaryFeesCalculator', () => {
  let calc;
  let loan;

  beforeEach(() => {
    loan = {
      structure: {
        property: { value: 1000000 },
        wantedLoan: 800000,
      },
      borrowers: [{ _id: 'borrower1' }],
    };
  });

  describe('general', () => {
    before(() => {
      calc = new NotaryFeesCalculator({ canton: 'GE' });
    });

    it('returns 0 for buyers contract fees for a refinancing loan', () => {
      loan.purchaseType = PURCHASE_TYPE.REFINANCING;

      const fees = calc.getNotaryFeesForLoan({ loan });

      expect(fees.buyersContractFees.total).to.equal(0);
    });
  });

  describe('GE', () => {
    before(() => {
      calc = new NotaryFeesCalculator({ canton: 'GE' });
    });

    it('returns the correct amount for a buyers contract', () => {
      const fees = calc.getNotaryFeesForLoan({ loan });

      expect(fees.buyersContractFees.total).to.equal(39100.4);
    });

    it('returns the correct amount for a new mortgage note', () => {
      const fees = calc.getNotaryFeesForLoan({ loan });

      expect(fees.mortgageNoteFees.total).to.equal(16058.7);
    });

    it('returns the correct amount as a whole', () => {
      const fees = calc.getNotaryFeesForLoan({ loan });

      expect(fees.total).to.equal(55159.1);
    });

    it('returns the correct amount for a main residence with casatax', () => {
      loan.residenceType = RESIDENCE_TYPE.MAIN_RESIDENCE;

      const fees = calc.getNotaryFeesForLoan({ loan });

      expect(fees.total).to.equal(31944.1);
    });

    it('ignores propertyWork', () => {
      loan.residenceType = RESIDENCE_TYPE.MAIN_RESIDENCE;
      loan.structure.propertyWork = 100000;

      const fees = calc.getNotaryFeesForLoan({ loan });

      expect(fees.total).to.equal(31944.1);
    });

    it('caps casatax deductions for very small properties', () => {
      loan.residenceType = RESIDENCE_TYPE.MAIN_RESIDENCE;
      loan.structure.property.value = 400000;
      loan.structure.wantedLoan = 320000;

      const fees = calc.getNotaryFeesForLoan({ loan });

      expect(fees.total).to.equal(9898.16);
    });

    it('works for large properties', () => {
      loan.structure.property.value = 3000000;
      loan.structure.wantedLoan = 2400000;
      const fees = calc.getNotaryFeesForLoan({ loan });

      expect(fees.total).to.equal(154530.65);
    });

    it('adds tax on propertyWork', () => {
      // Test code
    });

    it('calculates 0 mortgageNoteFees if no mortgageNote is required', () => {
      loan.structure.mortgageNoteIds = ['asdf'];
      loan.borrowers[0].mortgageNotes = [{ _id: 'asdf', value: 800000 }];

      const fees = calc.getNotaryFeesForLoan({ loan });
      expect(fees.mortgageNoteFees.total).to.equal(0);
    });

    it('calculates fees for a different structure', () => {
      loan = {
        structures: [{ id: 'struct2', wantedLoan: 800000, propertyId: 'prop' }],
        properties: [{ _id: 'prop', value: 1000000 }],
      };

      const fees = calc.getNotaryFeesForLoan({ loan, structureId: 'struct2' });
      expect(fees.total).to.equal(55159.1);
    });

    it('calculates fees for properties with landValue and constructionValue, if it is a construction', () => {
      loan.purchaseType = PURCHASE_TYPE.CONSTRUCTION;
      loan.structure.property.value = 0;
      loan.structure.property.totalValue = 1000000;
      loan.structure.property.landValue = 400000;
      loan.structure.property.constructionValue = 400000;
      loan.structure.property.additionalMargin = 200000;

      const fees = calc.getNotaryFeesForLoan({ loan });
      expect(fees.buyersContractFees.total).to.equal(28269.5);
    });

    it('calculates casatax properly for a construction', () => {
      loan.residenceType = RESIDENCE_TYPE.MAIN_RESIDENCE;
      loan.purchaseType = PURCHASE_TYPE.CONSTRUCTION;
      loan.structure.property.value = 0;
      loan.structure.property.landValue = 400000;
      loan.structure.property.constructionValue = 650000;
      loan.structure.property.additionalMargin = 100000;

      const fees = calc.getNotaryFeesForLoan({ loan });
      expect(fees.buyersContractFees.propertyRegistrationTax).to.equal(
        fees.deductions.buyersContractDeductions,
      );
      expect(
        fees.mortgageNoteFees.mortgageNoteRegistrationTax *
          GE.MORTGAGE_NOTE_CASATAX_DEDUCTION,
      ).to.equal(fees.deductions.mortgageNoteDeductions);
      expect(fees.buyersContractFees.total).to.equal(27034.85);
    });
  });

  describe('VD', () => {
    before(() => {
      calc = new NotaryFeesCalculator({ canton: 'VD' });
    });

    it('returns the correct amounts for a regular loan', () => {
      const fees = calc.getNotaryFeesForLoan({ loan });

      expect(fees).to.deep.include({
        total: 44954.25,
      });
      expect(fees.buyersContractFees).to.deep.include({
        total: 38596.38,
      });
      expect(fees.mortgageNoteFees).to.deep.include({
        total: 6357.88,
      });
    });

    it('returns the right amount for a promotion property', () => {
      loan = {
        structure: {
          property: { landValue: 395750, constructionValue: 824250 },
          wantedLoan: 968000,
          promotionOptionId: 'asd',
        },
        promotions: [{ type: PROMOTION_TYPES.SHARE }],
      };
      const fees = calc.getNotaryFeesForLoan({ loan });

      expect(fees).to.deep.include({
        total: 23743.96,
      });
      expect(fees.buyersContractFees).to.deep.include({
        total: 16526.68,
      });
      expect(fees.mortgageNoteFees).to.deep.include({
        total: 7217.28,
      });
    });
  });

  describe('unknown cantons', () => {
    before(() => {
      calc = new NotaryFeesCalculator({ canton: 'XX' });
    });

    it("returns 5% for cantons where we don't have any Math", () => {
      const fees = calc.getNotaryFeesForLoan({ loan });

      expect(fees.total).to.equal(50000);
    });
  });

  describe('getNotaryFeesWithoutLoan', () => {
    it('should work', () => {
      calc = new NotaryFeesCalculator({ canton: 'GE' });

      const notaryFees = calc.getNotaryFeesWithoutLoan({
        propertyValue: 1000000,
        mortgageNoteIncrease: 800000,
        residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
      });

      expect(notaryFees.total).to.equal(31944.1);
    });

    it('should work for unknown cantons', () => {
      calc = new NotaryFeesCalculator({ canton: 'XX' });

      const notaryFees = calc.getNotaryFeesWithoutLoan({
        propertyValue: 1000000,
        mortgageNoteIncrease: 800000,
        residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
      });

      expect(notaryFees.total).to.equal(50000);
    });
  });
});
