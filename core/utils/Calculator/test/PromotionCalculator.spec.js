//
/* eslint-env mocha */
import { expect } from 'chai';

import Calculator from '..';

describe('PromotionCalculator', () => {
  describe('canAffordPromotionOption', () => {
    it('test name', () => {
      // Test code
    });
  });

  describe('getSolvency', () => {
    context('with infinite salary', () => {
      it('returns property value with bank fortune only', () => {
        expect(
          Calculator.getSolvency({
            loan: {
              borrowers: [
                { bankFortune: [{ value: 250000 }], salary: 10000000 },
              ],
            },
            notaryFees: 50000,
          }),
        ).to.deep.include({ withBankFortune: 1000000 });
      });

      it('returns property value with insurance2', () => {
        expect(
          Calculator.getSolvency({
            loan: {
              borrowers: [
                {
                  bankFortune: [{ value: 150000 }],
                  insurance2: [{ value: 100000 }],
                  salary: 10000000,
                },
              ],
            },
            notaryFees: 50000,
          }),
        ).to.deep.include({ withInsurance2: 1000000 });
      });

      it('returns a smaller propertyValue if little insurance2 is available', () => {
        expect(
          Calculator.getSolvency({
            loan: {
              borrowers: [
                {
                  bankFortune: [{ value: 150000 }],
                  insurance2: [{ value: 60000 }],
                  salary: 10000000,
                },
              ],
            },
            notaryFees: 50000,
          }),
        ).to.deep.include({ withInsurance2: 800000 });
      });

      it('returns a propertyValue with insurance3', () => {
        expect(
          Calculator.getSolvency({
            loan: {
              borrowers: [
                {
                  bankFortune: [{ value: 200000 }],
                  insurance3A: [{ value: 50000 }],
                  salary: 10000000,
                },
              ],
            },
            notaryFees: 50000,
          }),
        ).to.deep.include({ withInsurance3: 1000000 });
      });

      it('returns a propertyValue with insurance3 and insurance2', () => {
        expect(
          Calculator.getSolvency({
            loan: {
              borrowers: [
                {
                  bankFortune: [{ value: 100000 }],
                  insurance3A: [{ value: 50000 }],
                  insurance2: [{ value: 100000 }],
                  salary: 10000000,
                },
              ],
            },
            notaryFees: 50000,
          }),
        ).to.deep.include({ withInsurance2And3: 1000000 });
      });
    });

    context.skip('limited by income', () => {
      it('returns a salary limited value', () => {
        expect(
          Calculator.getSolvency({
            loan: {
              borrowers: [
                { bankFortune: [{ value: 10000000 }], salary: 180000 },
              ],
            },
            notaryFees: 50000,
          }),
        ).to.deep.include({ withBankFortune: 1000000 });
      });
    });
  });
});
