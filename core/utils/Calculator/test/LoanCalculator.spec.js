// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import Calculator, { Calculator as CalculatorClass } from '..';
import { INTEREST_RATES } from 'core/api/constants';

describe('LoanCalculator', () => {
  describe('getProjectValue', () => {
    it('returns 0 if the property value is 0 or does not exist', () => {
      expect(Calculator.getProjectValue({ loan: { structure: {} } })).to.equal(0);
      expect(Calculator.getProjectValue({
        loan: { structure: { property: { value: 0 } }, propertyWork: 100 },
      })).to.equal(0);
    });

    it('calculates project with propertyValue, notary fees and propertyWork', () => {
      expect(Calculator.getProjectValue({
        loan: { structure: { property: { value: 100 }, propertyWork: 50 } },
      })).to.equal(155);
    });
  });

  describe('getTotalUsed', () => {
    it('it gets the sum of all used own funds', () => {
      expect(Calculator.getTotalUsed({
        loan: {
          structure: {
            secondPillarPledged: 1,
            thirdPillarPledged: 2,
            fortuneUsed: 3,
          },
        },
      })).to.equal(6);
    });
  });

  describe('getFees', () => {
    it('calculates fees if no notary fees exist', () => {
      expect(Calculator.getFees({
        loan: { structure: { property: { value: 100 } } },
      })).to.equal(5);
    });

    it('uses provided notary fees if they are defined', () => {
      expect(Calculator.getFees({
        loan: { structure: { property: { value: 100 }, notaryFees: 123 } },
      })).to.equal(123);
    });

    it('uses provided notary fees if they are 0', () => {
      expect(Calculator.getFees({
        loan: { structure: { property: { value: 100 }, notaryFees: 0 } },
      })).to.equal(0);
    });
  });

  describe('getInterests', () => {
    it('uses constructor interest rates if none are provided', () => {
      const Calc = new CalculatorClass({ interestRates: { myRate: 0.012 } });
      expect(Calc.getInterests({
        loan: {
          structure: {
            property: { value: 100000 },
            wantedLoan: 500000,
            loanTranches: [{ value: 1, type: 'myRate' }],
          },
        },
      })).to.equal(500);
    });

    it('uses interest rates if provided', () => {
      expect(Calculator.getInterests({
        loan: {
          structure: {
            property: { value: 100000 },
            wantedLoan: 500000,
            loanTranches: [{ value: 1, type: 'myRate' }],
          },
        },
        interestRates: { myRate: 0.012 },
      })).to.equal(500);
    });

    it('uses the rates from the offer if it exists, even if interest rate is provided', () => {
      expect(Calculator.getInterests({
        loan: {
          structure: {
            property: { value: 100000 },
            wantedLoan: 500000,
            loanTranches: [{ value: 1, type: 'myRate' }],
            offer: { myRate: 0.012 },
          },
        },
        interestRates: { myRate: 0.024 },
      })).to.equal(500);
    });
  });

  describe('getTheoretialInterests', () => {
    it('uses the theoretical rate', () => {
      expect(Calculator.getTheoreticalInterests({
        loan: { structure: { wantedLoan: 1200000 } },
      })).to.equal(5000);
    });

    it('uses the overridden theoretial rate', () => {
      const Calc = new CalculatorClass({ theoreticalInterestRate: 0.04 });
      expect(Calc.getTheoreticalInterests({
        loan: { structure: { wantedLoan: 1200000 } },
      })).to.equal(4000);
    });
  });

  describe('getAmortization', () => {
    it('figures out what amortization should be', () => {
      expect(Calculator.getAmortization({
        loan: {
          structure: {
            wantedLoan: 960000,
            propertyWork: 0,
            property: { value: 1200000 },
          },
        },
      })).to.equal(1000);
    });

    it('does not amortize if loan is lower than 65%', () => {
      expect(Calculator.getAmortization({
        loan: {
          structure: {
            wantedLoan: 650000,
            propertyWork: 0,
            property: { value: 1000000 },
          },
        },
      })).to.equal(0);

      expect(Calculator.getAmortization({
        loan: {
          structure: {
            wantedLoan: 1000,
            propertyWork: 0,
            property: { value: 1000000 },
          },
        },
      })).to.equal(0);
    });

    it('does amortize if the loan is even a little bit above 65%', () => {
      expect(Calculator.getAmortization({
        loan: {
          structure: {
            wantedLoan: 650001,
            propertyWork: 0,
            property: { value: 1000000 },
          },
        },
      })).to.be.above(0);
    });

    it('should amortize faster if borrowers are old');
  });

  describe('getMonthly', () => {
    it('sums amortization and interests', () => {
      expect(Calculator.getMonthly({
        loan: {
          structure: {
            wantedLoan: 960000,
            property: { value: 1200000 },
            propertyWork: 0,
            loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 1 }],
          },
        },
      })).to.be.within(1800, 2500);
    });

    it('uses provided interestRates', () => {
      expect(Calculator.getMonthly({
        loan: {
          structure: {
            wantedLoan: 960000,
            property: { value: 1200000 },
            propertyWork: 0,
            loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 1 }],
          },
        },
        interestRates: { [INTEREST_RATES.YEARS_10]: 0.01 },
      })).to.equal(1800);
    });

    it('uses the offer interestRates', () => {
      expect(Calculator.getMonthly({
        loan: {
          structure: {
            wantedLoan: 960000,
            property: { value: 1200000 },
            offer: {
              [INTEREST_RATES.YEARS_10]: 0.02,
            },
            propertyWork: 0,
            loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 1 }],
          },
        },
        interestRates: { [INTEREST_RATES.YEARS_10]: 0.01 },
      })).to.equal(2600);
    });
  });

  describe('getTheoreticalMonthly', () => {
    it('uses the default theoretical rate', () => {
      expect(Calculator.getTheoreticalMonthly({
        loan: {
          structure: {
            wantedLoan: 960000,
            property: { value: 1200000 },
            propertyWork: 0,
            loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 1 }],
          },
        },
      })).to.equal(5000);
    });

    it('uses the provided theoretical rate', () => {
      const Calc = new CalculatorClass({
        interestRates: { myRate: 0.012 },
        theoreticalInterestRate: 0.01,
      });
      expect(Calc.getTheoreticalMonthly({
        loan: {
          structure: {
            wantedLoan: 960000,
            property: { value: 1200000 },
            propertyWork: 0,
            loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 1 }],
          },
        },
      })).to.equal(1800);
    });
  });

  describe('getIncomeRatio', () => {
    it('compares theoretical monthly cost and income', () => {
      expect(Calculator.getIncomeRatio({
        loan: {
          structure: {
            wantedLoan: 1920000,
            property: { value: 2400000 },
            propertyWork: 0,
            loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 1 }],
          },
          borrowers: [{ salary: 1 / 12 }], // Use 1/12 salary to cancel monthly division and get a round number for this test
        },
        interestRates: { [INTEREST_RATES.YEARS_10]: 0.01 },
      })).to.equal(10000);
    });
  });

  describe('getBorrowRatio', () => {
    it('calculates ratio based on loan, property value, and propertyWork', () => {
      expect(Calculator.getBorrowRatio({
        loan: {
          structure: {
            wantedLoan: 500,
            propertyWork: 100,
            property: { value: 900 },
          },
        },
      })).to.equal(0.5);
    });
  });

  describe('getMaxBorrowRatio', () => {
    it('returns the max ratio for a loan', () => {
      expect(Calculator.getMaxBorrowRatio({ loan: { general: {} } })).to.equal(0.8);
    });
  });

  describe('loanHasMinimalInformation', () => {
    it('returns true if fortune property value and wantedLoan are defined', () => {
      expect(Calculator.loanHasMinimalInformation({
        loan: {
          structure: {
            wantedLoan: 1,
            fortuneUsed: 1,
            property: { value: 1 },
          },
        },
      })).to.equal(true);
    });

    it('returns false if one of these fields is undefined', () => {
      expect(Calculator.loanHasMinimalInformation({
        loan: {
          structure: {
            fortuneUsed: 1,
            property: { value: 1 },
          },
        },
      })).to.equal(false);
      expect(Calculator.loanHasMinimalInformation({
        loan: {
          structure: {
            wantedLoan: 1,
            property: { value: 1 },
          },
        },
      })).to.equal(false);
      expect(Calculator.loanHasMinimalInformation({
        loan: {
          structure: {
            wantedLoan: 1,
            fortuneUsed: 1,
          },
        },
      })).to.equal(false);
    });
  });

  describe('getLoanFilesProgress', () => {
    it('returns 0 for an empty loan', () => {
      expect(Calculator.getLoanFilesProgress({})).to.equal(0);
      expect(Calculator.getLoanFilesProgress({ loan: {} })).to.equal(0);
    });

    it('returns 100% for a loan initially, when documents have arrived', () => {
      expect(Calculator.getLoanFilesProgress({ loan: { documents: {} } })).to.equal(1);
    });
  });

  describe('getMissingLoanDocuments', () => {
    it('shows nothing is required initially', () => {
      expect(Calculator.getMissingLoanDocuments({})).to.deep.equal([]);
      expect(Calculator.getMissingLoanDocuments({ loan: {} })).to.deep.equal([]);
      expect(Calculator.getMissingLoanDocuments({ loan: { documents: {} } })).to.deep.equal([]);
      expect(Calculator.getMissingLoanDocuments({
        loan: { documents: { other: [{ key: 'hello' }] } },
      })).to.deep.equal([]);
    });
  });
});
