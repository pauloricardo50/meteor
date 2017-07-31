/* eslint-env mocha */
import { expect } from 'chai';

import {
  getFortune,
  getInsuranceFortune,
  getBorrowerCompletion,
} from '../borrowerFunctions';

describe('Borrower Functions', () => {
  describe('Get Fortune', () => {
    it('Should return 0 if given an empty object', () => {
      expect(getFortune({})).to.equal(0);
    });

    it('sums bankFortunes if given multiple borrowers', () => {
      expect(getFortune([{ bankFortune: 1 }, { bankFortune: 2 }])).to.equal(3);
    });
  });

  describe('getInsuranceFortune', () => {
    it('properly sums insuranceSecondPillar and insuranceThirdPillar', () => {
      expect(
        getInsuranceFortune({
          insuranceSecondPillar: 2,
          insuranceThirdPillar: 3,
        }),
      ).to.equal(5);

      expect(
        getInsuranceFortune({
          insuranceSecondPillar: 2,
          insuranceThirdPillar: undefined,
        }),
      ).to.equal(2);
    });

    it('works with multiple borrowers', () => {
      expect(
        getInsuranceFortune([
          {
            insuranceSecondPillar: 2,
            insuranceThirdPillar: 3,
          },
          {
            insuranceSecondPillar: 4,
            insuranceThirdPillar: 5,
          },
        ]),
      ).to.equal(14);
    });
  });

  describe('getBorrowerCompletion', () => {
    it('returns 0 if given a simple borrower', () => {
      expect(getBorrowerCompletion({ files: {}, logic: {} })).to.equal(0);
    });

    it('returns 1/3 when logic.hasValidatedFinances is true', () => {
      expect(
        getBorrowerCompletion({
          files: {},
          logic: { hasValidatedFinances: true },
        }),
      ).to.equal(1 / 3);
    });

    it('calculates files and personal info progress properly');
  });
});
