/* eslint-env mocha */
import { expect } from 'chai';

import constants from '/imports/js/config/constants';
import {
  getProjectValue,
  getLoanValue,
  loanStrategySuccess,
  strategiesChosen,
  getMonthlyWithOffer,
  getInterestsWithOffer,
  getPropAndWork,
  getTotalUsed,
  getLenderCount,
  disableForms,
  isRequestValid,
  getPropertyCompletion,
  validateRatios,
  validateRatiosCompletely,
  getFees,
  getMaintenance,
  getBorrowRatio,
} from '../requestFunctions';

describe('Request functions', () => {
  describe('Get project value', () => {
    it('Should return 1.25M with 1M property and 200k property work', () => {
      const request = {
        general: {},
        property: { value: 1000000, propertyWork: 200000 },
      };

      expect(getProjectValue(request)).to.equal(1250000);
    });

    it('Should return 1.27M with 1M property, 200k property work, and 200k insuranceFortuneUsed and a primary residence', () => {
      const request = {
        general: { insuranceFortuneUsed: 200000 },
        property: {
          value: 1000000,
          propertyWork: 200000,
          usageType: 'primary',
        },
      };

      expect(getProjectValue(request)).to.equal(1270000);
    });

    it('Should return 1.25M with 1M property, 200k property work, and 200k insuranceFortuneUsed for a non primary residence', () => {
      const request = {
        general: { insuranceFortuneUsed: 200000, usageType: 'investment' },

        property: { value: 1000000, propertyWork: 200000 },
      };

      expect(getProjectValue(request)).to.equal(1250000);
    });

    it('Should return 0 with 0 property, any property work, and any insuranceFortuneUsed', () => {
      const request = {
        general: { insuranceFortuneUsed: 1000 * Math.random() },

        property: { value: 0, propertyWork: 1000 * Math.random() },
      };

      expect(getProjectValue(request)).to.equal(0);
    });

    it('Should return 0 with any negative property value, any property work, and any insuranceFortuneUsed', () => {
      const request = {
        general: { insuranceFortuneUsed: 1000 * Math.random() },

        property: {
          value: -100 * Math.random(),
          propertyWork: 1000 * Math.random(),
        },
      };

      expect(getProjectValue(request)).to.equal(0);
    });
  });

  describe('Get loan value', () => {
    it('returns the property value + fees if no fortune is used', () => {
      expect(
        getLoanValue({
          general: {
            fortuneUsed: undefined,
          },
          property: {
            value: 100,
          },
        }),
      ).to.equal(105);
    });

    it('returns the property value if 0 fortune is used', () => {
      expect(
        getLoanValue({
          general: {
            fortuneUsed: 0,
          },
          property: {
            value: 100,
          },
        }),
      ).to.equal(105);
    });

    it("Should return 800'000 with 1M property, 250k cash", () => {
      const loanRequest = {
        general: { fortuneUsed: 250000, insuranceFortuneUsed: 0 },
        property: { value: 1000000 },
      };

      expect(getLoanValue(loanRequest)).to.equal(800000);
    });

    it("Should return 600'000 with 1M property, 270k fortune, 200k insurance fortune", () => {
      const loanRequest = {
        general: {
          fortuneUsed: 270000,
          insuranceFortuneUsed: 200000,
        },
        property: { value: 1000000, usageType: 'primary' },
      };

      expect(getLoanValue(loanRequest)).to.equal(600000);
    });

    it("Should return 700'000 with 1M property, 260k fortune, 100k insurance fortune", () => {
      const loanRequest = {
        general: {
          fortuneUsed: 260000,
          insuranceFortuneUsed: 100000,
        },
        property: { value: 1000000, usageType: 'primary' },
      };

      expect(getLoanValue(loanRequest)).to.equal(700000);
    });
  });

  describe('Loan strategy success', () => {
    it('Should properly verify a loan strategy is complete with one value', () => {
      expect(loanStrategySuccess([{ type: 'libor', value: 100 }], 100)).to.be
        .true;
    });

    it('Should properly verify a loan strategy is complete with two values', () => {
      expect(
        loanStrategySuccess(
          [{ type: 'libor', value: 100 }, { type: 'interest10', value: 100 }],
          200,
        ),
      ).to.be.true;
    });

    it('Should return false if no loanTranche was given', () => {
      expect(loanStrategySuccess([], 200)).to.be.false;
    });
  });

  describe('loanStrategySuccess', () => {
    it('returns false if loan tranches is an empty array', () => {
      expect(loanStrategySuccess([], 0)).to.equal(false);
    });

    it('returns false if loan tranches is undefined', () => {
      expect(loanStrategySuccess(undefined, 0)).to.equal(false);
    });

    it('returns false if a loan tranche is not a number', () => {
      expect(loanStrategySuccess([{ value: 'hi' }], 0)).to.equal(false);
    });

    it("returns false if loan tranches don't add up to loanValue", () => {
      expect(loanStrategySuccess([{ value: 1 }], 2)).to.equal(false);
      expect(loanStrategySuccess([{ value: 3 }], 2)).to.equal(false);
      expect(loanStrategySuccess([{ value: 2.1 }], 2)).to.equal(false);
    });

    it('returns true if tranches do add up', () => {
      expect(loanStrategySuccess([{ value: 2 }], 2)).to.equal(true);
      expect(loanStrategySuccess([{ value: 1 }, { value: 2 }], 3)).to.equal(
        true,
      );
    });

    it('throws if loanValue is not an integer', () => {
      expect(() => loanStrategySuccess([], 'hi')).to.throw('integer');
    });
  });

  describe('strategiesChosen', () => {
    it('returns true for the right reasons', () => {
      expect(
        strategiesChosen({
          general: { loanTranches: [{ value: 80 }], fortuneUsed: 25 },
          property: { value: 100 },
          logic: {
            amortizationStrategyPreset: 'hello',
            hasValidatedCashStrategy: true,
          },
        }),
      ).to.equal(true);
    });

    describe('getInterestsWithOffer', () => {
      it('returns 0 if no offer is provided', () => {
        expect(getInterestsWithOffer({})).to.equal(0);
      });

      it('returns -1 if an interest rate does not exist', () => {
        expect(
          getInterestsWithOffer({ general: { loanTranches: [] } }, {}),
        ).to.equal(0);

        expect(
          getInterestsWithOffer(
            {
              general: {
                loanTranches: [
                  { type: 'test', value: 120000 },
                  { type: 'test2, value: 9' },
                ],
              },
            },
            { standardOffer: { test: 0.01 } },
          ),
        ).to.equal(-1);
      });
    });

    it('returns the right interests if everything is okay', () => {
      expect(
        getInterestsWithOffer(
          { general: { loanTranches: [{ type: 'test', value: 120000 }] } },
          { standardOffer: { test: 0.01 } },
        ),
      ).to.equal(100);

      expect(
        getInterestsWithOffer(
          {
            general: {
              loanTranches: [
                { type: 'test', value: 120000 }, // 100
                { type: 'test2', value: 240000 }, // 400
              ],
            },
          },
          { standardOffer: { test: 0.01, test2: 0.02 } },
        ),
      ).to.equal(500);
    });

    it('uses the counterpartOffer if asked nicely', () => {
      expect(
        getInterestsWithOffer(
          { general: { loanTranches: [{ type: 'test', value: 120000 }] } },
          { counterpartOffer: { test: 0.01 } },
          false,
        ),
      ).to.equal(100);
    });

    it('works with multiple interest rates', () => {
      expect(
        getInterestsWithOffer(
          {
            general: {
              loanTranches: [
                { type: 'test', value: 120000 }, // 100
                { type: 'test2', value: 240000 }, // 400
                { type: 'test3', value: 360000 }, // 400
              ],
            },
          },
          { standardOffer: { testx: 0.01, test2: 0.01, test3: 0.02 } },
        ),
      ).to.equal(-1);
    });
  });

  describe('getMonthlyWithOffer', () => {
    let request;
    let offer;

    beforeEach(() => {
      request = {
        general: {
          loanTranches: [{ value: 720000, type: 'test' }],
          fortuneUsed: 250000,
        },
        property: { value: 1000000 },
      };
      offer = {
        standardOffer: {},
        counterpartOffer: {},
      };
    });

    it('returns 0 if interests is wrong', () => {
      expect(getMonthlyWithOffer(request, offer)).to.equal(0);
    });

    it('returns the right value if everything is wired up', () => {
      offer.standardOffer.test = 0.01;
      expect(getMonthlyWithOffer(request, offer)).to.equal(
        (5000 + 800000 * 0.0125 + 600) / 12,
      );
    });
  });

  describe('getPropAnrWork', () => {
    it('returns 0 if an empty object is given', () => {
      expect(getPropAndWork({})).to.equal(0);
    });

    it('should return value of the property if no propertyWork is specified', () => {
      expect(getPropAndWork({ property: { value: 1 } })).to.equal(1);
    });

    it('should add value and propertyWork', () => {
      expect(
        getPropAndWork({ property: { value: 1, propertyWork: 2 } }),
      ).to.equal(3);
    });
  });

  describe('getTotalUsed', () => {
    it('should add fortuneUsed and insuranceFortuneUsed', () => {
      expect(getTotalUsed({ general: { fortuneUsed: 1 } })).to.equal(1);
      expect(
        getTotalUsed({ general: { fortuneUsed: 1, insuranceFortuneUsed: 2 } }),
      ).to.equal(3);
      expect(
        getTotalUsed({
          general: { fortuneUsed: 1, insuranceFortuneUsed: undefined },
        }),
      ).to.equal(1);
    });
  });

  describe('getLenderCount', () => {
    it('returns 0 if empty objects are given', () => {
      expect(getLenderCount({}, {})).to.equal(0);
    });
  });

  describe('disableForms', () => {
    it('returns true when the right conditions are true', () => {
      expect(disableForms({ logic: { step: 2 } })).to.equal(true);
      expect(
        disableForms({ logic: { verification: { requested: true } } }),
      ).to.equal(true);
      expect(
        disableForms({ logic: { verification: { validated: true } } }),
      ).to.equal(true);
    });

    it("returns false if the conditions aren't met", () => {
      expect(disableForms({ logic: { step: 1 } })).to.equal(false);
      expect(disableForms({ logic: { step: 0 } })).to.equal(false);
      expect(disableForms({ verification: { requested: false } })).to.equal(
        false,
      );
      expect(disableForms({ verification: { validated: false } })).to.equal(
        false,
      );
    });
  });

  describe('getFees', () => {
    it('returns notaryFees correctly', () => {
      expect(
        getFees({
          property: { usageType: 'primary', value: 100 },
          general: {},
        }),
      ).to.equal(5);
    });

    it('returns insuranceFortune fees only if property is a primary residency', () => {
      expect(
        getFees({
          property: { usageType: 'primary', value: 100 },
          general: {
            insuranceFortuneUsed: 10,
          },
        }),
      ).to.equal(6);

      expect(
        getFees({
          property: { usageType: 'not-primary', value: 100 },
          general: {
            insuranceFortuneUsed: 10,
          },
        }),
      ).to.equal(5);
    });
  });

  describe('isRequestValid', () => {
    let request;
    let borrowers;
    let fortuneUsed;
    let insuranceFortuneUsed;
    let tranches;
    let amortization;
    let interestRates;

    beforeEach(() => {
      fortuneUsed = 250000;
      insuranceFortuneUsed = 0;
      request = {
        property: { value: 1000000 },
        general: { fortuneUsed },
        logic: {},
      };
      borrowers = [{ salary: 100000 }];
    });

    it('should throw for insufficient revenues', () => {
      expect(() => isRequestValid(request, borrowers)).to.throw('income');
    });

    it('should throw for insufficient cash', () => {
      // 150k is required here
      request.general.fortuneUsed = 140000;
      request.general.insuranceFortuneUsed = 250000;
      borrowers = [{ salary: 300000 }];
      expect(() => isRequestValid(request, borrowers)).to.throw('cash');
    });

    it('should throw for insufficient own funds', () => {
      request.general.fortuneUsed = 160000;
      request.general.insuranceFortuneUsed = 80000;
      borrowers = [{ salary: 300000 }];
      expect(() => isRequestValid(request, borrowers)).to.throw('ownFunds');
    });
  });

  describe('validateRatios', () => {
    it('should return true for valid ratios', () => {
      expect(validateRatios(0.2, 0.6)).to.equal(true);
      expect(validateRatios(0.33, 0.8)).to.equal(true);
      expect(validateRatios(1 / 3, 0.8)).to.equal(true);
    });

    it('should throw fortune if the borrowRatio is lower than borrowRatioWanted', () => {
      expect(() => validateRatios(0.3, 0.7, false, 0.6)).to.throw('fortune');
    });

    it('should throw fortuneTight if insuranceFortune is allowed and conditions', () => {
      expect(() => validateRatios(0.2, 0.85, true, 0.9)).to.throw(
        'fortuneTight',
      );
    });

    it('should throw fortune if insuranceFortune is not allowed and conditions', () => {
      expect(() => validateRatios(0.2, 0.85, false)).to.throw('fortune');
    });

    it('should throw fortune if borrowRatio is above 0.9', () => {
      expect(() => validateRatios(0.2, 0.91, true, 0.9)).to.throw('fortune');
    });

    it('should throw income if incomeRatio is above 0.38', () => {
      expect(() => validateRatios(0.39, 0.8, false)).to.throw('income');
    });

    it('should throw income if income is above 1/3', () => {
      expect(() => validateRatios(0.34, 0.7, false)).to.throw('incomeTight');
    });

    it('should throw fortune if borrowRatio is above 0.9', () => {
      expect(() => validateRatios(0.34, 0.91, true)).to.throw('fortune');
    });
  });

  describe('validateRatiosCompletely', () => {
    it('returns an object', () => {
      const validated = validateRatiosCompletely(0.3, 0.8);
      expect(typeof validated).to.equal('object');
      expect(Object.keys(validated)).to.deep.equal([
        'isValid',
        'message',
        'message2',
        'icon',
        'className',
      ]);
      expect(validated.className).to.equal('success');
      expect(validated.message2).to.equal('');
      expect(validated.message).to.equal('valid');
    });

    it('returns warning as a class for tight errors', () => {
      expect(validateRatiosCompletely(0.35, 0.8).className).to.equal('warning');
    });

    it('returns error as a class for tight errors', () => {
      expect(validateRatiosCompletely(0.39, 0.8).className).to.equal('error');
    });
  });

  describe('getMaintenance', () => {
    it('should return 0.83% of a property value', () => {
      expect(getMaintenance({ property: { value: 100 } })).to.equal(1 / 12);
    });

    it('throws if an incorrect request is given', () => {
      expect(() => getMaintenance({})).to.throw();
      expect(() => getMaintenance()).to.throw();
    });
  });
});
