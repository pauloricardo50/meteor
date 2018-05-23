/* eslint-env mocha */
import { expect } from 'chai';
import moment from 'moment';
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
  isLoanValid,
  validateRatios,
  validateRatiosCompletely,
  getFees,
  getMaintenance,
  getAuctionEndTime,
} from '../loanFunctions';

describe('Loan functions', () => {
  let props = {};

  beforeEach(() => {
    props = {
      loan: {
        general: { propertyWork: 200000, usageType: 'PRIMARY' },
        logic: {},
      },
      property: { value: 1000000 },
    };
  });

  describe('Get project value', () => {
    it('Should return 1.25M with 1M property and 200k property work', () => {
      expect(getProjectValue(props)).to.equal(1250000);
    });

    it('Should return 1.27M with 1M property, 200k property work, and 200k insuranceFortuneUsed and a primary residence', () => {
      props.loan.general.insuranceFortuneUsed = 200000;
      props.loan.logic.insuranceUsePreset = 'WITHDRAWAL';

      expect(getProjectValue(props)).to.equal(1270000);
    });

    it('Should return 1.25M with 1M property, 200k property work, and 200k insuranceFortuneUsed for a non primary residence', () => {
      props.loan.general.usageType = 'INVESTMENT';
      props.loan.general.insuranceFortuneUsed = 200000;

      expect(getProjectValue(props)).to.equal(1250000);
    });

    it('Should return 0 with 0 property, any property work, and any insuranceFortuneUsed', () => {
      props.property.value = 0;
      props.loan.general.insuranceFortuneUsed = 1000 * Math.random();
      props.loan.general.propertyWork = 1000 * Math.random();

      expect(getProjectValue(props)).to.equal(0);
    });

    it('Should return 0 with any negative property value, any property work, and any insuranceFortuneUsed', () => {
      props.loan.general.insuranceFortuneUsed = 1000 * Math.random();
      props.loan.general.propertyWork = 1000 * Math.random();
      props.property.value = -100 * Math.random();

      expect(getProjectValue(props)).to.equal(0);
    });
  });

  describe('Get loan value', () => {
    it('returns the property value + fees if no fortune is used', () => {
      expect(getLoanValue({
        loan: { general: { fortuneUsed: undefined }, logic: {} },
        property: { value: 100 },
      })).to.equal(105);
    });

    it('returns the property value if 0 fortune is used', () => {
      expect(getLoanValue({
        loan: { general: { fortuneUsed: 0 }, logic: {} },
        property: { value: 100 },
      })).to.equal(105);
    });

    it("Should return 800'000 with 1M property, 250k cash", () => {
      const loan = {
        general: { fortuneUsed: 250000, insuranceFortuneUsed: 0 },
        logic: {},
      };
      const property = { value: 1000000 };

      expect(getLoanValue({ loan, property })).to.equal(800000);
    });

    it("Should return 600'000 with 1M property, 270k fortune, 200k insurance fortune", () => {
      const loan = {
        general: {
          fortuneUsed: 270000,
          insuranceFortuneUsed: 200000,
          usageType: 'PRIMARY',
        },
        logic: { insuranceUsePreset: 'WITHDRAWAL' },
      };
      const property = { value: 1000000 };

      expect(getLoanValue({ loan, property })).to.equal(600000);
    });

    it("Should return 700'000 with 1M property, 260k fortune, 100k insurance fortune, but no withdrawal", () => {
      const loan = {
        general: {
          fortuneUsed: 260000,
          insuranceFortuneUsed: 100000,
          usageType: 'PRIMARY',
        },
        logic: {},
      };
      const property = { value: 1000000, usageType: 'primary' };

      expect(getLoanValue({ loan, property })).to.equal(690000);
    });
  });

  describe('loanStrategySuccess', () => {
    it('Should properly verify a loan strategy is complete with one value', () => {
      expect(loanStrategySuccess([{ type: 'libor', value: 100 }], 100)).to.be
        .true;
    });

    it('Should properly verify a loan strategy is complete with two values', () => {
      expect(loanStrategySuccess(
        [{ type: 'libor', value: 100 }, { type: 'interest10', value: 100 }],
        200,
      )).to.equal(true);
    });

    it('Should return false if no loanTranche was given', () => {
      expect(loanStrategySuccess([], 200)).to.equal(false);
    });

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
      expect(loanStrategySuccess([{ value: 1 }, { value: 2 }], 3)).to.equal(true);
    });

    it('throws if loanValue is not an integer', () => {
      expect(() => loanStrategySuccess([], 'hi')).to.throw('integer');
    });
  });

  describe('strategiesChosen', () => {
    it('returns true for the right reasons', () => {
      expect(strategiesChosen({
        loan: {
          general: { loanTranches: [{ value: 80 }], fortuneUsed: 25 },
          logic: {
            amortizationStrategyPreset: 'hello',
            hasValidatedCashStrategy: true,
          },
        },
        property: { value: 100 },
      })).to.equal(true);
    });

    describe('getInterestsWithOffer', () => {
      it('returns 0 if no offer is provided', () => {
        expect(getInterestsWithOffer({})).to.equal(0);
      });

      it('returns -1 if an interest rate does not exist', () => {
        expect(getInterestsWithOffer({
          loan: {
            general: {
              loanTranches: [
                { type: 'test', value: 120000 },
                { type: 'test2, value: 9' },
              ],
            },
          },
          offer: { standardOffer: { test: 0.01 } },
        })).to.equal(-1);
      });
    });

    it('returns the right interests if everything is okay', () => {
      expect(getInterestsWithOffer({
        loan: {
          general: { loanTranches: [{ type: 'test', value: 120000 }] },
        },
        offer: { standardOffer: { test: 0.01 } },
      })).to.equal(100);

      expect(getInterestsWithOffer({
        loan: {
          general: {
            loanTranches: [
              { type: 'test', value: 120000 }, // 100
              { type: 'test2', value: 240000 }, // 400
            ],
          },
        },
        offer: { standardOffer: { test: 0.01, test2: 0.02 } },
      })).to.equal(500);
    });

    it('uses the counterpartOffer if asked nicely', () => {
      expect(getInterestsWithOffer(
        {
          loan: {
            general: { loanTranches: [{ type: 'test', value: 120000 }] },
          },
          offer: { counterpartOffer: { test: 0.01 } },
        },
        false,
      )).to.equal(100);
    });

    it('works with multiple interest rates', () => {
      expect(getInterestsWithOffer({
        loan: {
          general: {
            loanTranches: [
              { type: 'test', value: 120000 }, // 100
              { type: 'test2', value: 240000 }, // 400
              { type: 'test3', value: 360000 }, // 400
            ],
          },
        },
        offer: { standardOffer: { testx: 0.01, test2: 0.01, test3: 0.02 } },
      })).to.equal(-1);
    });
  });

  describe('getMonthlyWithOffer', () => {
    let loan;
    let offer;
    let property;

    beforeEach(() => {
      loan = {
        general: {
          loanTranches: [{ value: 720000, type: 'test' }],
          fortuneUsed: 250000,
        },
        logic: {},
      };
      property = { value: 1000000 };
      offer = { standardOffer: {}, counterpartOffer: {} };
    });

    it('returns 0 if interests is wrong', () => {
      expect(getMonthlyWithOffer({ property, loan, offer })).to.equal(0);
    });

    it('returns the right value if everything is wired up', () => {
      offer.standardOffer.test = 0.01;
      expect(getMonthlyWithOffer({ property, loan, offer })).to.equal((5000 + 800000 * 0.0125 + 600) / 12);
    });
  });

  describe('getPropAndWork', () => {
    it('returns 0 if nothing is given', () => {
      expect(getPropAndWork({})).to.equal(0);
    });

    it('should return value of the property if no propertyWork is specified', () => {
      expect(getPropAndWork({ property: { value: 1 } })).to.equal(1);
    });

    it('should add value and propertyWork', () => {
      expect(getPropAndWork({
        property: { value: 1 },
        loan: { general: { propertyWork: 2 } },
      })).to.equal(3);
    });
  });

  describe('getTotalUsed', () => {
    it('should add fortuneUsed and insuranceFortuneUsed', () => {
      expect(getTotalUsed({ loan: { general: { fortuneUsed: 1 } } })).to.equal(1);
      expect(getTotalUsed({
        loan: { general: { fortuneUsed: 1, insuranceFortuneUsed: 2 } },
      })).to.equal(3);
      expect(getTotalUsed({
        loan: {
          general: { fortuneUsed: 1, insuranceFortuneUsed: undefined },
        },
      })).to.equal(1);
    });
  });

  describe('getLenderCount', () => {
    it('returns 0 if empty objects are given', () => {
      expect(getLenderCount({})).to.equal(0);
    });
  });

  describe('disableForms', () => {
    it('returns true when the right conditions are true', () => {
      expect(disableForms({ loan: { logic: { step: 2 } } })).to.equal(true);
      expect(disableForms({
        loan: { logic: { verification: { requested: true } } },
      })).to.equal(true);
      expect(disableForms({
        loan: { logic: { verification: { validated: true } } },
      })).to.equal(true);
    });

    it("returns false if the conditions aren't met", () => {
      expect(disableForms({ loan: { logic: { step: 1 } } })).to.equal(false);
      expect(disableForms({ loan: { logic: { step: 0 } } })).to.equal(false);
      expect(disableForms({ loan: { verification: { requested: false } } })).to.equal(false);
      expect(disableForms({ loan: { verification: { validated: false } } })).to.equal(false);
    });
  });

  describe('getFees', () => {
    it('returns notaryFees correctly', () => {
      expect(getFees({
        property: { value: 100 },
        loan: { general: { usageType: 'PRIMARY' }, logic: {} },
      })).to.equal(5);
    });

    it('returns insuranceFortune fees only if property is a primary residency and is withdrawal', () => {
      expect(getFees({
        property: { value: 100 },
        loan: {
          general: { usageType: 'PRIMARY', insuranceFortuneUsed: 10 },
          logic: { insuranceUsePreset: 'WITHDRAWAL' },
        },
      })).to.equal(6);

      expect(getFees({
        property: { value: 100 },
        loan: {
          general: { usageType: 'SECONDARY', insuranceFortuneUsed: 10 },
          logic: {},
        },
      })).to.equal(5);
    });
  });

  describe('isLoanValid', () => {
    let loan;
    let borrowers;
    let property;
    let fortuneUsed;

    beforeEach(() => {
      fortuneUsed = 250000;
      loan = {
        general: { fortuneUsed },
        logic: {},
      };
      property = { value: 1000000 };
      borrowers = [{ salary: 100000 }];
    });

    it('should throw for insufficient revenues', () => {
      expect(() => isLoanValid({ loan, borrowers, property })).to.throw('income');
    });

    it('should throw for insufficient cash', () => {
      // 150k is required here
      loan.general.fortuneUsed = 140000;
      loan.general.insuranceFortuneUsed = 250000;
      borrowers = [{ salary: 300000 }];
      expect(() => isLoanValid({ loan, borrowers, property })).to.throw('cash');
    });

    it('should throw for insufficient own funds', () => {
      loan.general.fortuneUsed = 160000;
      loan.general.insuranceFortuneUsed = 80000;
      borrowers = [{ salary: 300000 }];
      expect(() => isLoanValid({ loan, borrowers, property })).to.throw('ownFunds');
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
      expect(() => validateRatios(0.2, 0.85, true, 0.9)).to.throw('fortuneTight');
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

    it('throws if an incorrect loan is given', () => {
      expect(() => getMaintenance({})).to.throw();
      expect(() => getMaintenance()).to.throw();
    });
  });
});

describe('getAuctionEndTime', () => {
  let endDate;

  beforeEach(() => {
    endDate = moment()
      .year(2017)
      .month(0)
      .hours(23)
      .minutes(59)
      .seconds(59)
      .milliseconds(0);
  });

  it('Should return wednesday night for a monday afternoon', () => {
    // Jan 2nd 2017, a monday
    const date = moment()
      .year(2017)
      .month(0)
      .date(2)
      .hours(14);
    endDate.date(4);

    expect(getAuctionEndTime(date).getTime()).to.equal(endDate.toDate().getTime());
  });

  it('Should return monday night for a thursday afternoon', () => {
    // Jan 5th 2017, a thursday
    const date = moment()
      .year(2017)
      .month(0)
      .date(5)
      .hours(14);
    endDate.date(9);

    expect(getAuctionEndTime(date).getTime()).to.equal(endDate.toDate().getTime());
  });

  it('Should return Tuesday night for a friday afternoon', () => {
    // Jan 6th 2017, a friday
    const date = moment()
      .year(2017)
      .month(0)
      .date(6)
      .hours(14);
    endDate.date(10);

    expect(getAuctionEndTime(date).getTime()).to.equal(endDate.toDate().getTime());
  });

  it('Should return Tuesday night for a monday early morning', () => {
    // Jan 2nd 2017, a monday
    const date = moment()
      .year(2017)
      .month(0)
      .date(2)
      .hours(5);
    endDate.date(3);

    expect(getAuctionEndTime(date).getTime()).to.equal(endDate.toDate().getTime());
  });

  it('Should return Tuesday night for a saturday afternoon', () => {
    // Jan 7th 2017, a saturday
    const date = moment()
      .year(2017)
      .month(0)
      .date(7)
      .hours(14);
    endDate.date(10);

    expect(getAuctionEndTime(date).getTime()).to.equal(endDate.toDate().getTime());
  });

  it('Should return Tuesday night for a saturday early morning', () => {
    // Jan 7th 2017, a saturday
    const date = moment()
      .year(2017)
      .month(0)
      .date(7)
      .hours(5);
    endDate.date(10);

    expect(getAuctionEndTime(date).getTime()).to.equal(endDate.toDate().getTime());
  });

  it('Should return Tuesday night for a sunday afternoon', () => {
    // Jan 8th 2017, a sunday
    const date = moment()
      .year(2017)
      .month(0)
      .date(8)
      .hours(14);
    endDate.date(10);

    expect(getAuctionEndTime(date).getTime()).to.equal(endDate.toDate().getTime());
  });

  it('Should return Tuesday night for a sunday early morning', () => {
    // Jan 8th 2017, a sunday
    const date = moment()
      .year(2017)
      .month(0)
      .date(8)
      .hours(5);
    endDate.date(10);

    expect(getAuctionEndTime(date).getTime()).to.equal(endDate.toDate().getTime());
  });
});
