/* eslint-env mocha */
import { expect } from 'chai';

import {
  EXPENSES,
  OWN_FUNDS_TYPES,
} from '../../../api/borrowers/borrowerConstants';
import { INTEREST_RATES } from '../../../api/interestRates/interestRatesConstants';
import {
  OWN_FUNDS_USAGE_TYPES,
  PURCHASE_TYPE,
} from '../../../api/loans/loanConstants';
import {
  PROPERTY_CATEGORY,
  RESIDENCE_TYPE,
} from '../../../api/properties/propertyConstants';
import { REAL_ESTATE_INCOME_ALGORITHMS } from '../../../config/financeConstants';
import Calculator, { Calculator as CalculatorClass } from '..';

describe('LoanCalculator', () => {
  describe('getProjectValue', () => {
    it('returns 0 if the property value is 0 or does not exist', () => {
      expect(Calculator.getProjectValue({ loan: { structure: {} } })).to.equal(
        0,
      );
      expect(
        Calculator.getProjectValue({
          loan: { structure: { property: { value: 0 } }, propertyWork: 100 },
        }),
      ).to.equal(0);
    });

    it('calculates project with propertyValue, notary fees and propertyWork', () => {
      expect(
        Calculator.getProjectValue({
          loan: { structure: { property: { value: 100 }, propertyWork: 50 } },
        }),
      ).to.equal(155);
    });

    it('adds reimbursement penalty when needed', () => {
      expect(
        Calculator.getProjectValue({
          loan: {
            purchaseType: PURCHASE_TYPE.REFINANCING,
            structure: {
              property: { value: 100 },
              reimbursementPenalty: 15,
              notaryFees: 10,
            },
          },
        }),
      ).to.equal(125);
    });
  });

  describe('getTotalUsed', () => {
    it('it gets the sum of all used own funds, without pledged funds', () => {
      expect(
        Calculator.getTotalUsed({
          loan: {
            structure: {
              ownFunds: [
                { value: 3, usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW },
                { value: 2, usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE },
                { value: 1 },
              ],
            },
          },
        }),
      ).to.equal(6);
    });
  });

  describe('getNotaryFees', () => {
    it('calculates fees if no notary fees exist', () => {
      expect(
        Calculator.getNotaryFees({
          loan: {
            structure: {
              propertyId: 'prop',
              property: { _id: 'prop', value: 100 },
            },
          },
        }).total,
      ).to.equal(5);
    });

    it('uses provided notary fees if they are defined', () => {
      expect(
        Calculator.getNotaryFees({
          loan: { structure: { property: { value: 100 }, notaryFees: 123 } },
        }).total,
      ).to.equal(123);
    });

    it('uses provided notary fees if they are 0', () => {
      expect(
        Calculator.getNotaryFees({
          loan: { structure: { property: { value: 100 }, notaryFees: 0 } },
        }).total,
      ).to.equal(0);
    });

    it('returns accurate notary fees if data is sufficient', () => {
      expect(
        Calculator.getNotaryFees({
          loan: {
            structure: {
              propertyId: 'prop',
              wantedLoan: 800000,
              property: { _id: 'prop', value: 1000000, canton: 'GE' },
            },
          },
        }),
      ).to.deep.include({ total: 55159.1 });
    });

    it('calculates accurate fees for a promotionOption', () => {
      expect(
        Calculator.getNotaryFees({
          loan: {
            structures: [
              {
                id: 'struct1',
                promotionOptionId: 'option1',
                wantedLoan: 800000,
              },
            ],
            promotionOptions: [
              {
                value: 1000000,
                _id: 'option1',
                promotionLots: [
                  {
                    properties: [{ _id: 'prop', canton: 'GE' }],
                  },
                ],
              },
            ],
          },
          structureId: 'struct1',
        }),
      ).to.deep.include({ total: 55159.1 });
    });

    it('does not return null', () => {
      expect(
        Calculator.getNotaryFees({
          loan: { structure: { property: { value: 100 }, notaryFees: null } },
        }).total,
      ).to.equal(5);
    });
  });

  describe('getInterests', () => {
    it('uses interest rates if provided', () => {
      expect(
        Calculator.getInterests({
          loan: {
            structure: {
              property: { value: 100000 },
              wantedLoan: 500000,
              loanTranches: [{ value: 500000, type: 'myRate' }],
            },
          },
          interestRates: { myRate: 0.012 },
        }),
      ).to.equal(500);
    });

    it('uses the rates from the offer if it exists, even if interest rate is provided', () => {
      expect(
        Calculator.getInterests({
          loan: {
            structure: {
              property: { value: 100000 },
              wantedLoan: 500000,
              loanTranches: [{ value: 500000, type: 'myRate' }],
              offer: { myRate: 0.012 },
            },
          },
          interestRates: { myRate: 0.024 },
        }),
      ).to.equal(500);
    });
  });

  describe('getTheoretialInterests', () => {
    it('uses the theoretical rate', () => {
      expect(
        Calculator.getTheoreticalInterests({
          loan: {
            structure: { wantedLoan: 1200000, property: { value: 1000000 } },
          },
        }),
      ).to.equal(5000);
    });

    it('uses the overridden theoretial rate', () => {
      const Calc = new CalculatorClass({
        theoreticalInterestRate: 0.04,
        theoreticalInterestRate2ndRank: 0.04,
      });
      expect(
        Calc.getTheoreticalInterests({
          loan: {
            structure: { wantedLoan: 1200000, property: { value: 1000000 } },
          },
        }),
      ).to.equal(4000);
    });

    it('uses theoreticalInterestRate2ndRank to calculate the rate', () => {
      const Calc = new CalculatorClass({
        theoreticalInterestRate: 0.01,
        theoreticalInterestRate2ndRank: 0.1,
      });

      // 650k at 1%
      // 150k at 10%
      // -> 1791

      expect(
        Calc.getTheoreticalInterests({
          loan: {
            structure: { wantedLoan: 800000, property: { value: 1000000 } },
          },
        }),
      ).to.be.within(1791, 1792);
    });
  });

  describe('getAmortization', () => {
    it('figures out what amortization should be', () => {
      expect(
        Calculator.getAmortization({
          loan: {
            borrowers: [],
            structure: {
              wantedLoan: 960000,
              propertyWork: 0,
              property: { value: 1200000 },
            },
          },
        }),
      ).to.equal(1000);
    });

    it('does not amortize if loan is lower than 65%', () => {
      expect(
        Calculator.getAmortization({
          loan: {
            structure: {
              wantedLoan: 650000,
              propertyWork: 0,
              property: { value: 1000000 },
            },
          },
        }),
      ).to.equal(0);

      expect(
        Calculator.getAmortization({
          loan: {
            structure: {
              wantedLoan: 1000,
              propertyWork: 0,
              property: { value: 1000000 },
            },
          },
        }),
      ).to.equal(0);
    });

    it('does amortize if the loan is even a little bit above 65%', () => {
      expect(
        Calculator.getAmortization({
          loan: {
            structure: {
              wantedLoan: 650001,
              propertyWork: 0,
              property: { value: 1000000 },
            },
          },
        }),
      ).to.be.above(0);
    });

    it('gets amortization from the offer if it is defined', () => {
      expect(
        Calculator.getAmortization({
          loan: {
            structure: {
              wantedLoan: 960000,
              propertyWork: 0,
              offer: { amortizationGoal: 0.5 },
              property: { value: 1200000 },
            },
          },
        }),
      ).to.equal(2000);
    });

    it('uses amortizationYears from the offer if defined', () => {
      expect(
        Calculator.getAmortization({
          loan: {
            structure: {
              wantedLoan: 960000,
              propertyWork: 0,
              offer: { amortizationGoal: 0.5, amortizationYears: 30 },
              property: { value: 1200000 },
            },
          },
        }),
      ).to.equal(1000);
    });

    it('resets amortizationGoal after calculating with offers', () => {
      expect(
        Calculator.getAmortization({
          loan: {
            structure: {
              wantedLoan: 960000,
              propertyWork: 0,
              offer: { amortizationGoal: 0.5 },
              property: { value: 1200000 },
            },
          },
        }),
      ).to.equal(2000);

      expect(
        Calculator.getAmortization({
          loan: {
            structure: {
              wantedLoan: 960000,
              propertyWork: 0,
              property: { value: 1200000 },
            },
          },
        }),
      ).to.equal(1000);
    });

    it('calculates amortization with an overrideOffer if provided', () => {
      expect(
        Calculator.getAmortization({
          loan: {
            structures: [
              {
                id: 'asdf',
                wantedLoan: 640000,
                propertyWork: 0,
                propertyId: 'prop',
              },
            ],
            properties: [{ _id: 'prop', value: 1000000 }],
          },
          offerOverride: { amortizationGoal: 0.65 },
          structureId: 'asdf',
        }),
      ).to.equal(0);

      expect(
        Calculator.getAmortization({
          loan: {
            structures: [
              {
                id: 'asdf',
                wantedLoan: 650000,
                propertyWork: 0,
                propertyId: 'prop',
              },
            ],
            properties: [{ _id: 'prop', value: 1000000 }],
          },
          offerOverride: { amortizationGoal: 0.5, amortizationYears: 10 },
          structureId: 'asdf',
        }),
      ).to.equal(1250);
    });

    it('does not amortize pledged cash', () => {
      expect(
        Calculator.getAmortization({
          loan: {
            structures: [
              {
                id: 'asdf',
                wantedLoan: 1080000,
                propertyWork: 0,
                propertyId: 'prop',
                ownFunds: [
                  { value: 180000, type: OWN_FUNDS_TYPES.BANK_FORTUNE },
                  {
                    value: 80000,
                    type: OWN_FUNDS_TYPES.INSURANCE_2,
                    usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
                  },
                  {
                    value: 40000,
                    type: OWN_FUNDS_TYPES.INSURANCE_3A,
                    usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
                  },
                ],
              },
            ],
            properties: [{ _id: 'prop', value: 1200000 }],
          },
          structureId: 'asdf',
        }),
      ).to.be.within(1444, 1445);
    });

    it('does not amortize pledged cash with an offer', () => {
      expect(
        Calculator.getAmortization({
          loan: {
            structures: [
              {
                id: 'asdf',
                wantedLoan: 1080000,
                propertyWork: 0,
                propertyId: 'prop',
                ownFunds: [
                  { value: 180000, type: OWN_FUNDS_TYPES.BANK_FORTUNE },
                  {
                    value: 80000,
                    type: OWN_FUNDS_TYPES.INSURANCE_2,
                    usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
                  },
                  {
                    value: 40000,
                    type: OWN_FUNDS_TYPES.INSURANCE_3A,
                    usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
                  },
                ],
              },
            ],
            properties: [{ _id: 'prop', value: 1200000 }],
          },
          offerOverride: { amortizationGoal: 0.7, amortizationYears: 10 },
          structureId: 'asdf',
        }),
      ).to.be.within(1666, 1667);
    });

    it('should amortize faster if borrowers are old', () => {
      const sixtyYearsAgo = new Date();
      sixtyYearsAgo.setFullYear(sixtyYearsAgo.getFullYear() - 60);

      // I.e. amortize in 5 years
      expect(
        Calculator.getAmortization({
          loan: {
            structure: {
              wantedLoan: 960000,
              propertyWork: 0,
              property: { value: 1200000 },
            },
            borrowers: [{ birthDate: sixtyYearsAgo }],
          },
        }),
      ).to.equal(3000);
    });

    it('amortizes investment properties faster', () => {
      // I.e. amortize in 10 years
      expect(
        Calculator.getAmortization({
          loan: {
            structure: {
              wantedLoan: 960000,
              propertyWork: 0,
              property: { value: 1200000 },
            },
            residenceType: RESIDENCE_TYPE.INVESTMENT,
          },
        }),
      ).to.equal(1500);
    });

    it('amortizes faster if a firstRank is set', () => {
      expect(
        Calculator.getAmortization({
          loan: {
            structure: {
              wantedLoan: 960000,
              propertyWork: 0,
              property: { value: 1200000 },
              firstRank: 0.5,
            },
          },
        }),
      ).to.equal(2000);
    });

    it('amortizes faster if a firstRank is set, even with offer', () => {
      expect(
        Calculator.getAmortization({
          loan: {
            structure: {
              wantedLoan: 960000,
              propertyWork: 0,
              property: { value: 1200000 },
              offer: { amortizationGoal: 0.6 },
              firstRank: 0.5,
            },
          },
        }),
      ).to.equal(2000);
    });
  });

  describe('getTheoreticalAmortization', () => {
    it('ignores offers and firstRank when calculating', () => {
      expect(
        Calculator.getTheoreticalAmortization({
          loan: {
            structure: {
              wantedLoan: 960000,
              property: { value: 1200000 },
              propertyWork: 0,
              offer: { amortizationGoal: 0.3 },
              firstRank: 0.2,
            },
          },
        }),
      ).to.equal(1000);
    });
  });

  describe('getMonthly', () => {
    it('sums amortization and interests', () => {
      expect(
        Calculator.getMonthly({
          loan: {
            structure: {
              wantedLoan: 960000,
              property: { value: 1200000 },
              propertyWork: 0,
              loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 960000 }],
            },
            currentInterestRates: { [INTEREST_RATES.YEARS_10]: 0.01 },
          },
        }),
      ).to.be.within(1800, 2500);
    });

    it('uses provided interestRates', () => {
      expect(
        Calculator.getMonthly({
          loan: {
            structure: {
              wantedLoan: 960000,
              property: { value: 1200000 },
              propertyWork: 0,
              loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 960000 }],
            },
          },
          interestRates: { [INTEREST_RATES.YEARS_10]: 0.01 },
        }),
      ).to.equal(1800);
    });

    it('uses the offer interestRates', () => {
      expect(
        Calculator.getMonthly({
          loan: {
            structure: {
              wantedLoan: 960000,
              property: { value: 1200000 },
              offer: {
                amortizationGoal: 0.5,
                [INTEREST_RATES.YEARS_10]: 0.02,
              },
              propertyWork: 0,
              loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 960000 }],
            },
          },
          interestRates: { [INTEREST_RATES.YEARS_10]: 0.01 },
        }),
      ).to.equal(3600);
    });
  });

  describe('getMonthlyProjectCost', () => {
    it('uses the default theoretical rate', () => {
      expect(
        Calculator.getMonthlyProjectCost({
          loan: {
            structure: {
              wantedLoan: 960000,
              property: { value: 1200000 },
              propertyWork: 0,
              loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 960000 }],
            },
          },
        }),
      ).to.equal(6000);
    });

    it('uses the provided theoretical rate', () => {
      const Calc = new CalculatorClass({
        interestRates: { myRate: 0.012 },
        theoreticalInterestRate: 0.01,
      });
      expect(
        Calc.getMonthlyProjectCost({
          loan: {
            structure: {
              wantedLoan: 960000,
              property: { value: 1200000 },
              propertyWork: 0,
              loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 960000 }],
            },
          },
        }),
      ).to.equal(2800);
    });

    it('adds any expenses from the borrowers', () => {
      const Calc = new CalculatorClass({
        interestRates: { myRate: 0.012 },
        theoreticalInterestRate: 0.01,
        expensesSubtractFromIncome: Object.values(EXPENSES).filter(
          v => v !== EXPENSES.LEASING,
        ),
      });

      // 2800 for the loan
      // 100 more for the leasing
      // 2800 for the other property

      expect(
        Calc.getMonthlyProjectCost({
          loan: {
            structure: {
              wantedLoan: 960000,
              property: { value: 1200000 },
              propertyWork: 0,
              loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 960000 }],
            },
            borrowers: [
              {
                expenses: { description: EXPENSES.LEASING, value: 1200 },
                realEstate: [{ value: 1200000, loan: 960000 }],
              },
            ],
          },
        }),
      ).to.equal(5700);
    });
  });

  describe('getIncomeRatio', () => {
    it('compares theoretical monthly cost and income', () => {
      // Valeurs magiques qui donnent 33.33%
      // Tu peux le retrouver en utilisant notre calculateur pour une acquisition de 1mio
      expect(
        Calculator.getIncomeRatio({
          loan: {
            structure: {
              wantedLoan: 800000,
              property: { value: 1000000 },
              propertyWork: 0,
              loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 800000 }],
            },
            borrowers: [{ salary: 180000 }],
          },
          interestRates: { [INTEREST_RATES.YEARS_10]: 0.01 },
        }),
      ).to.be.within(0.33, 0.34);
    });

    it('returns 1 if the incomeRatio is negative', () => {
      expect(
        Calculator.getIncomeRatio({
          loan: {
            structure: {
              wantedLoan: 800000,
              property: { value: 1000000 },
              propertyWork: 0,
              loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 800000 }],
            },
            borrowers: [
              { expenses: [{ value: 10000, description: EXPENSES.LEASING }] },
            ],
          },
          interestRates: { [INTEREST_RATES.YEARS_10]: 0.01 },
        }),
      ).to.equal(1);
    });

    it('includes investmentRent on the property', () => {
      const calc = new CalculatorClass({
        realEstateIncomeConsideration: 0.5,
      });

      expect(
        calc.getIncomeRatio({
          loan: {
            structure: {
              wantedLoan: 800000,
              property: { value: 1000000, investmentRent: 40000 },
              propertyWork: 0,
              loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 800000 }],
            },
            borrowers: [{ salary: 160000 }],
          },
          interestRates: { [INTEREST_RATES.YEARS_10]: 0.01 },
        }),
      ).to.be.within(0.33, 0.34);
    });

    it('Calculates property income based on positive and negative deltas', () => {
      const calc = new CalculatorClass({
        realEstateIncomeAlgorithm:
          REAL_ESTATE_INCOME_ALGORITHMS.POSITIVE_NEGATIVE_SPLIT,
      });

      const incomeRatio = calc.getIncomeRatio({
        loan: {
          structure: {
            wantedLoan: 800000,
            property: { value: 1000000, investmentRent: 36000 },
            propertyWork: 0,
            loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 1 }],
          },
          borrowers: [{ salary: 160000 }],
        },
      });

      expect(incomeRatio).to.equal(0.15);
    });

    it('Adds the borrower expenses to expenses', () => {
      const calc = new CalculatorClass({
        expensesSubtractFromIncome: [],
      });

      const incomeRatio = calc.getIncomeRatio({
        loan: {
          structure: {
            wantedLoan: 800000,
            property: { value: 1000000 },
            loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 1 }],
          },
          borrowers: [
            {
              salary: 160000,
              expenses: [{ value: 20000, description: EXPENSES.LEASING }],
            },
          ],
        },
      });

      expect(Math.round(incomeRatio * 100) / 100).to.equal(0.5);
    });

    it('Splits the right borrower expenses between expenses and income', () => {
      const calc = new CalculatorClass({
        expensesSubtractFromIncome: [EXPENSES.LEASING],
      });

      const incomeRatio = calc.getIncomeRatio({
        loan: {
          structure: {
            wantedLoan: 800000,
            property: { value: 1000000 },
            loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 1 }],
          },
          borrowers: [
            {
              salary: 160000,
              expenses: [
                { value: 20000, description: EXPENSES.LEASING },
                { value: 10000, description: EXPENSES.PENSIONS },
              ],
            },
          ],
        },
      });

      expect(Math.round(incomeRatio * 100) / 100).to.equal(0.5);
    });

    it('Adds negative deltas to expenses using positive negative split algorithm', () => {
      const calc = new CalculatorClass({
        realEstateIncomeAlgorithm:
          REAL_ESTATE_INCOME_ALGORITHMS.POSITIVE_NEGATIVE_SPLIT,
      });

      const incomeRatio = calc.getIncomeRatio({
        loan: {
          structure: {
            wantedLoan: 800000,
            property: { value: 1000000 },
            loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 1 }],
          },
          borrowers: [
            {
              salary: 160000,
              realEstate: [
                // 30'000 expenses
                {
                  value: 1000000,
                  loan: 800000,
                  income: 0,
                  theoreticalExpenses: 30000,
                },
                // 20'000 income
                {
                  value: 1000000,
                  loan: 800000,
                  income: 20000,
                  theoreticalExpenses: 0,
                },
              ],
            },
          ],
        },
      });

      // 90'000 / 180'000
      expect(Math.round(incomeRatio * 100) / 100).to.equal(0.5);
    });

    it('returns 0 if a property pays for itself', () => {
      const calc = new CalculatorClass({
        realEstateIncomeAlgorithm:
          REAL_ESTATE_INCOME_ALGORITHMS.POSITIVE_NEGATIVE_SPLIT,
      });

      const incomeRatio = calc.getIncomeRatio({
        loan: {
          structure: {
            wantedLoan: 800000,
            property: { value: 1000000, investmentRent: 60000 },
            propertyWork: 0,
            loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 1 }],
          },
          borrowers: [{ salary: 160000 }],
        },
      });

      expect(incomeRatio).to.equal(0);
    });
  });

  describe('getBorrowRatio', () => {
    it('calculates ratio based on loan, property value, and propertyWork', () => {
      expect(
        Calculator.getBorrowRatio({
          loan: {
            structure: {
              wantedLoan: 500,
              propertyWork: 100,
              property: { value: 900 },
            },
          },
        }),
      ).to.equal(0.5);
    });
  });

  describe('getMaxBorrowRatio', () => {
    it('returns the max ratio for a loan without offer', () => {
      expect(
        Calculator.getMaxBorrowRatio({
          loan: { structures: [] },
        }),
      ).to.equal(0.8);
    });

    it('returns the max ratio for a loan with an offer', () => {
      expect(
        Calculator.getMaxBorrowRatio({
          loan: {
            structures: [
              { id: 'struct1', propertyValue: 1000, offerId: 'offer1' },
            ],
            offers: [{ _id: 'offer1', maxAmount: 500 }],
          },
          structureId: 'struct1',
        }),
      ).to.equal(0.5);
    });

    it('returns the max ratio for a loan with an offer with higher maxAmount than propertyValue', () => {
      expect(
        Calculator.getMaxBorrowRatio({
          loan: {
            structures: [
              { id: 'struct1', propertyValue: 1000, offerId: 'offer1' },
            ],
            offers: [{ _id: 'offer1', maxAmount: 1500 }],
          },
          structureId: 'struct1',
        }),
      ).to.equal(1);
    });

    it('returns the max ratio for a loan with an offer and without propertyValue', () => {
      expect(
        Calculator.getMaxBorrowRatio({
          loan: {
            structures: [{ id: 'struct1', offerId: 'offer1' }],
            offers: [{ _id: 'offer1', maxAmount: 500 }],
          },
          structureId: 'struct1',
        }),
      ).to.equal(0.8);
    });

    it('returns the max ratio for a loan with an offer and without propertyValue', () => {
      const calc = new CalculatorClass({ maxBorrowRatio: 0.5 });
      expect(
        calc.getMaxBorrowRatio({
          loan: {
            structures: [{ id: 'struct1' }],
          },
          structureId: 'struct1',
        }),
      ).to.equal(0.5);
    });

    it('returns the maximum legal value for investment properties', () => {
      const calc = new CalculatorClass({ maxBorrowRatio: 0.8 });

      expect(
        calc.getMaxBorrowRatio({
          loan: {
            structures: [{ id: 'struct1' }],
            residenceType: RESIDENCE_TYPE.INVESTMENT,
          },
          structureId: 'struct1',
        }),
      ).to.equal(0.75);

      const calc2 = new CalculatorClass({ maxBorrowRatio: 0.5 });

      expect(
        calc2.getMaxBorrowRatio({
          loan: {
            structures: [{ id: 'struct1' }],
            residenceType: RESIDENCE_TYPE.INVESTMENT,
          },
          structureId: 'struct1',
        }),
      ).to.equal(0.5);
    });
  });

  describe('loanHasMinimalInformation', () => {
    it('returns true if ownFunds, property value and wantedLoan are defined', () => {
      expect(
        Calculator.loanHasMinimalInformation({
          loan: {
            structure: {
              wantedLoan: 1,
              ownFunds: [{ value: 100000 }],
              property: { value: 1 },
            },
          },
        }),
      ).to.equal(true);
    });

    it('returns false if one of these fields is undefined', () => {
      expect(
        Calculator.loanHasMinimalInformation({
          loan: {
            structure: {
              fortuneUsed: 1,
              property: { value: 1 },
            },
          },
        }),
      ).to.equal(false);
      expect(
        Calculator.loanHasMinimalInformation({
          loan: {
            structure: {
              wantedLoan: 1,
              property: { value: 1 },
            },
          },
        }),
      ).to.equal(false);
      expect(
        Calculator.loanHasMinimalInformation({
          loan: {
            structure: {
              wantedLoan: 1,
              fortuneUsed: 1,
            },
          },
        }),
      ).to.equal(false);
    });
  });

  describe('getLoanFilesProgress', () => {
    it('returns 0 for an empty loan', () => {
      expect(
        Calculator.getLoanFilesProgress({ loan: { logic: {} } }),
      ).to.deep.equal({ percent: 0, count: 1 });
    });

    it('returns 100% for a loan initially, when documents have arrived', () => {
      expect(
        Calculator.getLoanFilesProgress({
          loan: { documents: {}, logic: {} },
        }),
      ).to.deep.equal({ percent: 1, count: 0 });
    });
  });

  describe('getMissingLoanDocuments', () => {
    it('shows nothing is required initially', () => {
      expect(
        Calculator.getMissingLoanDocuments({
          loan: { logic: {} },
        }),
      ).to.deep.equal([]);
      expect(
        Calculator.getMissingLoanDocuments({
          loan: { logic: {} },
        }),
      ).to.deep.equal([]);
      expect(
        Calculator.getMissingLoanDocuments({
          loan: { documents: {}, logic: {} },
        }),
      ).to.deep.equal([]);
      expect(
        Calculator.getMissingLoanDocuments({
          loan: {
            documents: { other: [{ key: 'hello' }] },
            logic: {},
          },
        }),
      ).to.deep.equal([]);
    });
  });

  describe('getMortgageNoteIncrease', () => {
    it('returns the loan value if no mortgage note is added', () => {
      expect(
        Calculator.getMortgageNoteIncrease({
          loan: {
            structure: {
              propertyId: 'propertyId',
              wantedLoan: 800000,
              property: {},
            },
          },
        }),
      ).to.equal(800000);
    });

    it('returns the loan value if no property is selected', () => {
      expect(
        Calculator.getMortgageNoteIncrease({
          loan: {
            structure: {
              wantedLoan: 800000,
              property: {},
            },
          },
        }),
      ).to.equal(800000);
    });

    it('returns the increase with mortgageNotes on the property', () => {
      expect(
        Calculator.getMortgageNoteIncrease({
          loan: {
            structure: {
              propertyId: 'propertyId',
              wantedLoan: 800000,
              property: { mortgageNotes: [{ value: 100000 }] },
            },
          },
        }),
      ).to.equal(700000);
    });

    it('counts a mortgagenote as 0 if no value is set on it', () => {
      expect(
        Calculator.getMortgageNoteIncrease({
          loan: {
            structure: {
              propertyId: 'propertyId',
              wantedLoan: 800000,
              property: {},
            },
          },
        }),
      ).to.equal(800000);
    });

    it('works with borrowers mortgageNotes', () => {
      expect(
        Calculator.getMortgageNoteIncrease({
          loan: {
            structure: {
              wantedLoan: 800000,
              mortgageNoteIds: ['note'],
              property: {},
            },
            borrowers: [{ mortgageNotes: [{ _id: 'note' }] }],
          },
        }),
      ).to.equal(800000);
      expect(
        Calculator.getMortgageNoteIncrease({
          loan: {
            structure: {
              wantedLoan: 800000,
              mortgageNoteIds: ['note'],
              property: {},
            },
            borrowers: [{ mortgageNotes: [{ _id: 'note', value: 200000 }] }],
          },
        }),
      ).to.equal(600000);
    });

    it('caps the increase at 0', () => {
      expect(
        Calculator.getMortgageNoteIncrease({
          loan: {
            structure: {
              wantedLoan: 800000,
              propertyId: 'propertyId',
              mortgageNoteIds: ['note'],
              property: { mortgageNotes: [{ value: 500000 }] },
            },
            borrowers: [{ mortgageNotes: [{ _id: 'note', value: 500000 }] }],
          },
        }),
      ).to.equal(0);
    });
  });

  describe('getNonPledgedOwnFunds', () => {
    it('gets them', () => {
      const loan = {
        structure: {
          ownFunds: [
            { value: 100 },
            { value: 100, usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE },
          ],
        },
      };

      expect(Calculator.getNonPledgedOwnFunds({ loan })).to.equal(100);
    });
  });

  describe('getMissingOwnFunds', () => {
    it('returns a standard amount', () => {
      expect(
        Calculator.getMissingOwnFunds({
          properties: [{ _id: 'propertyId', value: 1000000 }],
          loan: {
            properties: [{ _id: 'propertyId', value: 1000000 }],
            structures: [
              {
                id: 'struct1',
                wantedLoan: 800000,
                propertyId: 'propertyId',
                propertyWork: 0,
                ownFunds: [],
              },
            ],
            borrowers: [{}],
          },
          structureId: 'struct1',
          structure: {
            id: 'struct1',
            wantedLoan: 800000,
            propertyId: 'propertyId',
            propertyWork: 0,
            ownFunds: [],
          },
        }),
      ).to.equal(250000);
    });

    it('overrides notaryFees if provided', () => {
      expect(
        Calculator.getMissingOwnFunds({
          structure: {
            id: 'struct1',
            wantedLoan: 800000,
            propertyId: 'propertyId',
            propertyWork: 0,
            ownFunds: [],
            notaryFees: 0,
          },
          properties: [{ _id: 'propertyId', value: 1000000 }],
          loan: {
            properties: [{ _id: 'propertyId', value: 1000000 }],
            structures: [
              {
                id: 'struct1',
                wantedLoan: 800000,
                propertyId: 'propertyId',
                propertyWork: 0,
                ownFunds: [],
                notaryFees: 0,
              },
            ],
          },
          borrowers: [{}],
          structureId: 'struct1',
        }),
      ).to.equal(200000);
    });

    it('uses property work', () => {
      expect(
        Calculator.getMissingOwnFunds({
          structure: {
            id: 'struct1',
            wantedLoan: 800000,
            propertyId: 'propertyId',
            propertyWork: 100000,
            ownFunds: [],
          },
          properties: [{ _id: 'propertyId', value: 900000 }],
          loan: {
            properties: [{ _id: 'propertyId', value: 900000 }],
            structures: [
              {
                id: 'struct1',
                wantedLoan: 800000,
                propertyId: 'propertyId',
                propertyWork: 100000,
                ownFunds: [],
              },
            ],
            borrowers: [{}],
          },
          structureId: 'struct1',
        }),
      ).to.equal(245000);
    });

    it('subtracts used own funds', () => {
      expect(
        Calculator.getMissingOwnFunds({
          structure: {
            id: 'struct1',
            wantedLoan: 800000,
            propertyId: 'propertyId',
            propertyWork: 0,
            ownFunds: [{ value: 100000 }],
          },
          properties: [{ _id: 'propertyId', value: 1000000 }],
          loan: {
            properties: [{ _id: 'propertyId', value: 1000000 }],
            structures: [
              {
                id: 'struct1',
                wantedLoan: 800000,
                propertyId: 'propertyId',
                propertyWork: 0,
                ownFunds: [{ value: 100000 }],
              },
            ],
          },
          borrowers: [{}],
          structureId: 'struct1',
        }),
      ).to.equal(150000);
    });

    it('does not count pledge as own funds', () => {
      expect(
        Calculator.getMissingOwnFunds({
          structure: {
            id: 'struct1',
            wantedLoan: 800000,
            propertyId: 'propertyId',
            propertyWork: 0,
            ownFunds: [
              { value: 100000, usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE },
              { value: 100000, usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW },
            ],
          },
          properties: [{ _id: 'propertyId', value: 1000000 }],
          loan: {
            properties: [{ _id: 'propertyId', value: 1000000 }],
            structures: [
              {
                id: 'struct1',
                wantedLoan: 800000,
                propertyId: 'propertyId',
                propertyWork: 0,
                ownFunds: [
                  { value: 100000, usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE },
                  { value: 100000, usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW },
                ],
              },
            ],
          },
          borrowers: [{}],
          structureId: 'struct1',
        }),
      ).to.equal(150000);
    });

    it('uses calculated notary fees and rounds them', () => {
      expect(
        Calculator.getMissingOwnFunds({
          structure: {
            id: 'struct1',
            wantedLoan: 1179750,
            propertyId: 'propertyId',
            propertyWork: 165000,
            ownFunds: [],
          },
          properties: [{ _id: 'propertyId', value: 1650000, canton: 'GE' }],
          loan: {
            properties: [{ _id: 'propertyId', value: 1650000, canton: 'GE' }],
            structures: [
              {
                id: 'struct1',
                wantedLoan: 1179750,
                propertyId: 'propertyId',
                propertyWork: 165000,
                ownFunds: [],
              },
            ],
            borrowers: [{}],
          },
          structureId: 'struct1',
        }),
      ).to.be.within(720693, 720694);
    });

    it('works for refinancing when increasing your loan', () => {
      expect(
        Calculator.getMissingOwnFunds({
          loan: {
            purchaseType: PURCHASE_TYPE.REFINANCING,
            properties: [{ _id: 'propertyId', value: 1000000, canton: 'GE' }],
            structures: [
              {
                id: 'struct1',
                wantedLoan: 800000,
                propertyId: 'propertyId',
                ownFunds: [],
              },
            ],
            borrowers: [{}],
            previousLoanTranches: [{ value: 650000 }],
          },
          structureId: 'struct1',
        }),
      ).to.equal(0);
    });

    it('works for refinancing when reducing your loan', () => {
      expect(
        Calculator.getMissingOwnFunds({
          loan: {
            purchaseType: PURCHASE_TYPE.REFINANCING,
            properties: [{ _id: 'propertyId', value: 1000000, canton: 'GE' }],
            structures: [
              {
                id: 'struct1',
                wantedLoan: 600000,
                propertyId: 'propertyId',
                ownFunds: [],
                notaryFees: 15000,
                reimbursementPenalty: 10000,
              },
            ],
            borrowers: [{}],
            previousLoanTranches: [{ value: 650000 }],
          },
          structureId: 'struct1',
        }),
      ).to.equal(75000);
    });

    it('takes into account reimbursement penalties and notaryfees when reducing loan', () => {
      expect(
        Calculator.getMissingOwnFunds({
          loan: {
            purchaseType: PURCHASE_TYPE.REFINANCING,
            properties: [{ _id: 'propertyId', value: 1000000, canton: 'GE' }],
            structures: [
              {
                id: 'struct1',
                wantedLoan: 600000,
                propertyId: 'propertyId',
                ownFunds: [],
                notaryFees: 4000,
                reimbursementPenalty: 4000,
              },
            ],
            borrowers: [{}],
            previousLoanTranches: [{ value: 650000 }],
          },
          structureId: 'struct1',
        }),
      ).to.equal(58000);
    });

    it('takes into account reimbursement penalties and notaryfees when increasing loan', () => {
      expect(
        Calculator.getMissingOwnFunds({
          loan: {
            purchaseType: PURCHASE_TYPE.REFINANCING,
            properties: [{ _id: 'propertyId', value: 1000000, canton: 'GE' }],
            structures: [
              {
                id: 'struct1',
                wantedLoan: 600000,
                propertyId: 'propertyId',
                ownFunds: [],
                notaryFees: 4000,
                reimbursementPenalty: 4000,
              },
            ],
            borrowers: [{}],
            previousLoanTranches: [{ value: 650000 }],
          },
          structureId: 'struct1',
        }),
      ).to.equal(58000);
    });
  });

  describe('getBorrowRatioStatus', () => {
    context('without an offer', () => {
      it('returns SUCCESS when borrowRatio is lower than maxBorrowRatio', () => {
        expect(
          Calculator.getBorrowRatioStatus({
            loan: {
              structures: [
                { id: 'struct1', wantedLoan: 500, propertyValue: 1000 },
              ],
            },
            structureId: 'struct1',
          }).status,
        ).to.equal('SUCCESS');
      });

      it('returns WARNING when there are not enough pledged own funds', () => {
        expect(
          Calculator.getBorrowRatioStatus({
            loan: {
              structures: [
                { id: 'struct1', wantedLoan: 900, propertyValue: 1000 },
              ],
            },
            structureId: 'struct1',
          }).status,
        ).to.equal('WARNING');
      });

      it('returns ERROR when borrowRatio is greater than maxBorrowRatioWithPledge', () => {
        expect(
          Calculator.getBorrowRatioStatus({
            loan: {
              structures: [
                { id: 'struct1', wantedLoan: 950, propertyValue: 1000 },
              ],
            },
            structureId: 'struct1',
          }).status,
        ).to.equal('ERROR');
      });

      it('returns SUCCESS when there are enough pledged own funds', () => {
        expect(
          Calculator.getBorrowRatioStatus({
            loan: {
              structures: [
                {
                  id: 'struct1',
                  wantedLoan: 850,
                  propertyValue: 1000,
                  ownFunds: [
                    {
                      value: 50,
                      usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
                    },
                  ],
                },
              ],
            },
            structureId: 'struct1',
          }).status,
        ).to.equal('SUCCESS');
      });
    });

    context('with an offer', () => {
      context(
        'when offer maxBorrowRatio is lower than lender rules maxBorrowRatio',
        () => {
          it('returns SUCCESS if borrowRatio is lower than maxBorrowRatio', () => {
            expect(
              Calculator.getBorrowRatioStatus({
                loan: {
                  structures: [
                    {
                      id: 'struct1',
                      wantedLoan: 750,
                      propertyValue: 1000,
                      offerId: 'offer1',
                    },
                  ],
                  offers: [{ _id: 'offer1', maxAmount: 750 }],
                },
                structureId: 'struct1',
              }).status,
            ).to.equal('SUCCESS');
          });

          it('returns ERROR if borrowRatio is greater than maxBorrowRatio', () => {
            expect(
              Calculator.getBorrowRatioStatus({
                loan: {
                  structures: [
                    {
                      id: 'struct1',
                      wantedLoan: 760,
                      propertyValue: 1000,
                      offerId: 'offer1',
                    },
                  ],
                  offers: [{ _id: 'offer1', maxAmount: 750 }],
                },
                structureId: 'struct1',
              }).status,
            ).to.equal('ERROR');
          });
        },
      );

      context(
        'when offer maxBorrowRatio is greater than lender rules maxBorrowRatio',
        () => {
          context(
            'when maxBorrowRatio is greater than lender rules maxBorrowRatioWithPledge',
            () => {
              it('returns SUCCESS when borrowRatio is lower than lender rules maxBorrowRatio', () => {
                expect(
                  Calculator.getBorrowRatioStatus({
                    loan: {
                      structures: [
                        {
                          id: 'struct1',
                          wantedLoan: 750,
                          propertyValue: 1000,
                          offerId: 'offer1',
                        },
                      ],
                      offers: [{ _id: 'offer1', maxAmount: 950 }],
                    },
                    structureId: 'struct1',
                  }).status,
                ).to.equal('SUCCESS');
              });

              it('returns WARNING when there are not enough pledged own funds', () => {
                expect(
                  Calculator.getBorrowRatioStatus({
                    loan: {
                      structures: [
                        {
                          id: 'struct1',
                          wantedLoan: 850,
                          propertyValue: 1000,
                          offerId: 'offer1',
                        },
                      ],
                      offers: [{ _id: 'offer1', maxAmount: 950 }],
                    },
                    structureId: 'struct1',
                  }).status,
                ).to.equal('WARNING');

                expect(
                  Calculator.getBorrowRatioStatus({
                    loan: {
                      structures: [
                        {
                          id: 'struct1',
                          wantedLoan: 920,
                          propertyValue: 1000,
                          offerId: 'offer1',
                        },
                      ],
                      offers: [{ _id: 'offer1', maxAmount: 950 }],
                    },
                    structureId: 'struct1',
                  }).status,
                ).to.equal('WARNING');
              });

              it('returns ERROR when borrowRatio is greater than maxBorrowRatio', () => {
                expect(
                  Calculator.getBorrowRatioStatus({
                    loan: {
                      structures: [
                        {
                          id: 'struct1',
                          wantedLoan: 960,
                          propertyValue: 1000,
                          offerId: 'offer1',
                        },
                      ],
                      offers: [{ _id: 'offer1', maxAmount: 950 }],
                    },
                    structureId: 'struct1',
                  }).status,
                ).to.equal('ERROR');
              });

              it('returns SUCCESS when there are enough pledged own funds', () => {
                expect(
                  Calculator.getBorrowRatioStatus({
                    loan: {
                      structures: [
                        {
                          id: 'struct1',
                          wantedLoan: 950,
                          propertyValue: 1000,
                          offerId: 'offer1',
                          ownFunds: [
                            {
                              value: 150,
                              usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
                            },
                          ],
                        },
                      ],
                      offers: [{ _id: 'offer1', maxAmount: 950 }],
                    },
                    structureId: 'struct1',
                  }).status,
                ).to.equal('SUCCESS');
              });
            },
          );

          context(
            'when maxBorrowRatio is lower than lender rules maxBorrowRatioWithPledge',
            () => {
              it('returns SUCCESS when borrowRatio is lower than lender rules maxBorrowRatio', () => {
                expect(
                  Calculator.getBorrowRatioStatus({
                    loan: {
                      structures: [
                        {
                          id: 'struct1',
                          wantedLoan: 750,
                          propertyValue: 1000,
                          offerId: 'offer1',
                        },
                      ],
                      offers: [{ _id: 'offer1', maxAmount: 850 }],
                    },
                    structureId: 'struct1',
                  }).status,
                ).to.equal('SUCCESS');
              });

              it('returns WARNING when there are not enough pledged own funds', () => {
                expect(
                  Calculator.getBorrowRatioStatus({
                    loan: {
                      structures: [
                        {
                          id: 'struct1',
                          wantedLoan: 810,
                          propertyValue: 1000,
                          offerId: 'offer1',
                        },
                      ],
                      offers: [{ _id: 'offer1', maxAmount: 850 }],
                    },
                    structureId: 'struct1',
                  }).status,
                ).to.equal('WARNING');
              });

              it('returns ERROR when borrowRatio is greater than maxBorrowRatio', () => {
                expect(
                  Calculator.getBorrowRatioStatus({
                    loan: {
                      structures: [
                        {
                          id: 'struct1',
                          wantedLoan: 860,
                          propertyValue: 1000,
                          offerId: 'offer1',
                        },
                      ],
                      offers: [{ _id: 'offer1', maxAmount: 850 }],
                    },
                    structureId: 'struct1',
                  }).status,
                ).to.equal('ERROR');
              });

              it('returns SUCCESS when there are enough pledged own funds', () => {
                expect(
                  Calculator.getBorrowRatioStatus({
                    loan: {
                      structures: [
                        {
                          id: 'struct1',
                          wantedLoan: 820,
                          propertyValue: 1000,
                          offerId: 'offer1',
                          ownFunds: [
                            {
                              value: 20,
                              usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
                            },
                          ],
                        },
                      ],
                      offers: [{ _id: 'offer1', maxAmount: 850 }],
                    },
                    structureId: 'struct1',
                  }).status,
                ).to.equal('SUCCESS');
              });
            },
          );
        },
      );
    });
  });

  describe('getPropertyValidFieldsRatio', () => {
    it('returns the ratio of valid fields', () => {
      const property = { address1: 'yo', category: PROPERTY_CATEGORY.USER };
      const ratio = Calculator.getPropertyValidFieldsRatio({
        loan: { structure: { property }, properties: [property] },
      });
      expect(ratio).to.deep.equal({ valid: 1, required: 14 });
    });

    it('returns the ratio of valid fields', () => {
      const property = {
        address1: 'yo',
        zipCode: 1400,
        category: PROPERTY_CATEGORY.USER,
      };
      const ratio = Calculator.getPropertyValidFieldsRatio({
        loan: { structure: { property }, properties: [property] },
      });
      expect(ratio).to.deep.equal({ valid: 2, required: 14 });
    });

    it('does not count fields if it is a pro property, because Pros are responsible for it', () => {
      const property = { address1: 'yo', category: PROPERTY_CATEGORY.PRO };
      const ratio = Calculator.getPropertyValidFieldsRatio({
        loan: { structure: { property }, properties: [property] },
      });
      expect(ratio).to.equal(null);
    });

    it('does not count fields if it is a promotion property, because Pros are responsible for it', () => {
      const property = {
        address1: 'yo',
        category: PROPERTY_CATEGORY.PROMOTION,
      };
      const ratio = Calculator.getPropertyValidFieldsRatio({
        loan: { structure: { property }, properties: [property] },
      });
      expect(ratio).to.equal(null);
    });
  });

  describe('getCashRatio', () => {
    it('returns an accurate percentage', () => {
      const cashRatio = Calculator.getCashRatio({
        loan: {
          structure: {
            notaryFees: 50000,
            propertyValue: 1000000,
            wantedLoan: 800000,
            ownFunds: [{ value: 100000, type: OWN_FUNDS_TYPES.BANK_FORTUNE }],
          },
        },
      });
      expect(cashRatio).to.equal(0.05);
    });

    it('includes everything but insurance2', () => {
      const cashRatio = Calculator.getCashRatio({
        loan: {
          structure: {
            notaryFees: 0,
            propertyValue: 1000000,
            wantedLoan: 800000,
            ownFunds: [
              { value: 10000, type: OWN_FUNDS_TYPES.BANK_FORTUNE },
              { value: 10000, type: OWN_FUNDS_TYPES.BANK_3A },
              { value: 10000, type: OWN_FUNDS_TYPES.DONATION },
              { value: 10000, type: OWN_FUNDS_TYPES.INSURANCE_3A },
              { value: 10000, type: OWN_FUNDS_TYPES.INSURANCE_3B },
              { value: 10000, type: OWN_FUNDS_TYPES.INSURANCE_2 },
            ],
          },
        },
      });
      expect(cashRatio).to.equal(0.05);
    });

    it('does not include pledged funds', () => {
      const cashRatio = Calculator.getCashRatio({
        loan: {
          structure: {
            notaryFees: 50000,
            propertyValue: 1000000,
            wantedLoan: 800000,
            ownFunds: [
              { value: 100000, type: OWN_FUNDS_TYPES.BANK_FORTUNE },
              {
                value: 100000,
                type: OWN_FUNDS_TYPES.INSURANCE_3A,
                usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
              },
            ],
          },
        },
      });
      expect(cashRatio).to.equal(0.05);
    });

    it('works for refinancings that reduce their loan', () => {
      const cashRatio = Calculator.getCashRatio({
        loan: {
          previousLoanTranches: [{ value: 650000 }],
          structure: {
            notaryFees: 50000,
            propertyValue: 1000000,
            wantedLoan: 600000,
            ownFunds: [{ value: 100000, type: OWN_FUNDS_TYPES.BANK_FORTUNE }],
          },
        },
      });
      expect(cashRatio).to.equal(0.05);
    });
  });

  describe('getMaxLoanValue', () => {
    it('returns 80% of the propertyValue', () => {
      const maxLoan = Calculator.getMaxLoanValue({
        loan: {
          structures: [{ id: 'struct', propertyValue: 1000000 }],
          selectedStructure: 'struct',
        },
      });
      expect(maxLoan).to.equal(800000);
    });

    it('returns 75% of the propertyValue for investment properties', () => {
      const maxLoan = Calculator.getMaxLoanValue({
        loan: {
          structures: [{ id: 'struct', propertyValue: 1000000 }],
          selectedStructure: 'struct',
          residenceType: RESIDENCE_TYPE.INVESTMENT,
        },
      });
      expect(maxLoan).to.equal(750000);
    });

    it('returns the maxAmount from the offer', () => {
      const maxLoan = Calculator.getMaxLoanValue({
        loan: {
          structures: [{ id: 'struct', offerId: 'o', propertyValue: 1000000 }],
          lenders: [{ offers: [{ _id: 'o', maxAmount: 10 }] }],
          selectedStructure: 'struct',
        },
      });
      expect(maxLoan).to.equal(10);
    });

    it('increases the max loan by the pledged own funds amount', () => {
      const maxLoan = Calculator.getMaxLoanValue({
        loan: {
          structures: [
            {
              id: 'struct',
              propertyValue: 1000000,
              ownFunds: [
                {
                  value: 20000,
                  type: OWN_FUNDS_TYPES.INSURANCE_2,
                  usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
                },
              ],
            },
          ],
          selectedStructure: 'struct',
          residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
        },
      });
      expect(maxLoan).to.equal(820000);
    });

    it('caps the max loan amount at maxBorrowRatioWithPledge', () => {
      const maxLoan = Calculator.getMaxLoanValue({
        loan: {
          structures: [
            {
              id: 'struct',
              propertyValue: 1000000,
              ownFunds: [
                {
                  value: 120000,
                  type: OWN_FUNDS_TYPES.INSURANCE_2,
                  usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
                },
              ],
            },
          ],
          selectedStructure: 'struct',
          residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
        },
      });
      expect(maxLoan).to.equal(900000);
    });

    it('counts propertyWork in the math', () => {
      const maxLoan = Calculator.getMaxLoanValue({
        loan: {
          structures: [
            { id: 'struct', propertyValue: 1000000, propertyWork: 100000 },
          ],
          selectedStructure: 'struct',
        },
      });
      expect(maxLoan).to.equal(880000);
    });

    it('floors to nearest 1000', () => {
      const maxLoan = Calculator.getMaxLoanValue({
        loan: {
          structures: [{ id: 'struct', propertyValue: 1234567 }],
          selectedStructure: 'struct',
        },
      });
      expect(maxLoan).to.equal(987000);
    });

    it("uses the property's value", () => {
      const maxLoan = Calculator.getMaxLoanValue({
        loan: {
          structures: [{ id: 'struct', propertyId: 'p' }],
          selectedStructure: 'struct',
          properties: [{ _id: 'p', value: 1000000 }],
        },
      });
      expect(maxLoan).to.equal(800000);
    });

    it('uses the property bankValue', () => {
      const maxLoan = Calculator.getMaxLoanValue({
        loan: {
          structures: [{ id: 'struct', propertyId: 'p' }],
          selectedStructure: 'struct',
          properties: [{ _id: 'p', value: 1000000, bankValue: 900000 }],
        },
      });
      expect(maxLoan).to.equal(720000);
    });

    it('ignores the bankValue if it is 0', () => {
      const maxLoan = Calculator.getMaxLoanValue({
        loan: {
          structures: [{ id: 'struct', propertyId: 'p' }],
          selectedStructure: 'struct',
          properties: [{ _id: 'p', value: 1000000, bankValue: 0 }],
        },
      });
      expect(maxLoan).to.equal(800000);
    });

    it('lets you preview a maxLoanValue with pledgeOverride', () => {
      const maxLoan = Calculator.getMaxLoanValue({
        loan: {
          structures: [{ id: 'struct', propertyValue: 1000000 }],
          selectedStructure: 'struct',
          residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
        },
        pledgeOverride: 50000,
      });
      expect(maxLoan).to.equal(850000);
    });
  });
});
