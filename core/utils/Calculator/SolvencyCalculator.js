// @flow
import { OWN_FUNDS_ROUNDING_AMOUNT } from '../../config/financeConstants';
import {
  OWN_FUNDS_TYPES,
  RESIDENCE_TYPE,
  OWN_FUNDS_USAGE_TYPES,
} from '../../api/constants';
import { arrayify } from '../general';
import { NotaryFeesCalculator } from '../notaryFees/index';
import { roundValue } from '../conversionFunctions';

const INITIAL_MIN_BOUND = 0;
const INITIAL_MAX_BOUND = 1000000;
const INITIAL_ABSOLUTE_MAX_BOUND = 100000000;
const MAX_ITERATIONS = 50;
const ACCURACY = 1000;
const ROUNDING_DIGITS = Math.log10(ACCURACY);
const MAX_BOUND_MULTIPLICATION_FACTOR = 2;
const OWN_FUNDS_ROUNDING_ALGO = 100;
const INITIAL_BORROW_RATIO_STEP_SIZE = 0.05;

export const withSolvencyCalculator = (SuperClass = class {}) =>
  class extends SuperClass {
    getAllowedOwnFundsTypes({ residenceType }) {
      return residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE
        ? [
          OWN_FUNDS_TYPES.DONATION,
          OWN_FUNDS_TYPES.BANK_FORTUNE,
          OWN_FUNDS_TYPES.INSURANCE_3A,
          OWN_FUNDS_TYPES.BANK_3A,
          OWN_FUNDS_TYPES.INSURANCE_3B,
          OWN_FUNDS_TYPES.INSURANCE_2,
        ]
        : [
          OWN_FUNDS_TYPES.DONATION,
          OWN_FUNDS_TYPES.BANK_FORTUNE,
          OWN_FUNDS_TYPES.INSURANCE_3B,
        ];
    }

    ownFundTypeRequiresUsageType({ type }) {
      return [
        OWN_FUNDS_TYPES.INSURANCE_2,
        OWN_FUNDS_TYPES.INSURANCE_3A,
        OWN_FUNDS_TYPES.INSURANCE_3B,
      ].includes(type);
    }

    makeOwnFunds({ borrowers, type, usageType, max }) {
      return arrayify(borrowers)
        .map((borrower) => {
          const ownFundsObject = {
            type,
            value: Math.ceil(Math.min(max, this.getFunds({ borrowers: borrower, type }))),
            borrowerId: borrower._id,
          };

          if (!usageType && this.ownFundTypeRequiresUsageType({ type })) {
            return {
              ...ownFundsObject,
              usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
            };
          }

          if (usageType) {
            return { ...ownFundsObject, usageType };
          }

          return ownFundsObject;
        })
        .filter(({ value }) => value > 0);
    }

    suggestStructure({
      borrowers,
      propertyValue,
      maxBorrowRatio = this.maxBorrowRatio,
      loanValue,
      canton,
      residenceType,
      notaryFees: forcedNotaryFees,
    }) {
      let notaryFees;

      const finalLoanValue = loanValue || Math.round(propertyValue * maxBorrowRatio);

      if (forcedNotaryFees >= 0) {
        notaryFees = forcedNotaryFees;
      } else {
        const notaryCalc = new NotaryFeesCalculator({ canton });
        notaryFees = notaryCalc.getNotaryFeesWithoutLoan({
          propertyValue,
          mortgageNoteIncrease: finalLoanValue,
          residenceType,
        }).total;
      }

      let requiredOwnFunds = Math.round(propertyValue + notaryFees - finalLoanValue);
      let ownFunds = [];

      // Get all possible OWN_FUNDS_TYPES
      const allowedOwnFundsTypes = this.getAllowedOwnFundsTypes({
        residenceType,
      });

      allowedOwnFundsTypes.forEach((type) => {
        borrowers.forEach((borrower) => {
          const newOwnFunds = this.makeOwnFunds({
            borrowers: borrower,
            type,
            max: requiredOwnFunds,
          });

          requiredOwnFunds -= newOwnFunds.reduce(
            (tot, { value }) => tot + value,
            0,
          );

          ownFunds = [...ownFunds, ...newOwnFunds];
        });
      });

      return ownFunds;
    }

    createLoanObject({
      residenceType,
      borrowers,
      wantedLoan,
      propertyValue,
      canton,
      ownFunds = [],
      loanTranches = [],
      ...rest
    }) {
      return {
        residenceType,
        borrowers,
        structure: {
          wantedLoan,
          propertyValue,
          property: { canton },
          ownFunds,
          loanTranches,
        },
        ...rest,
      };
    }

    suggestedStructureIsValid({
      borrowers,
      propertyValue,
      maxBorrowRatio = this.maxBorrowRatio,
      loanValue,
      canton,
      residenceType,
      ownFunds,
    }) {
      const finalLoanValue = loanValue || Math.round(propertyValue * maxBorrowRatio);
      const loanObject = this.createLoanObject({
        residenceType,
        borrowers,
        wantedLoan: finalLoanValue,
        propertyValue,
        canton,
        ownFunds,
      });

      // If the calculator has been initialized, reinitialize it according to this new potential loan
      if (this.lenderRules) {
        this.initialize({ loan: loanObject, lenderRules: this.lenderRules });
      }

      if (this.isMissingOwnFunds({ loan: loanObject })) {
        return false;
      }

      if (!this.hasEnoughCash({ loan: loanObject })) {
        return false;
      }

      if (!this.structureIsValid({ loan: loanObject })) {
        return false;
      }

      return true;
    }

    getMaxPropertyValue({ borrowers, maxBorrowRatio, canton, residenceType }) {
      // Immediately stop iterating if maxBorrowRatio is above what is allowed
      if (this.maxBorrowRatio < maxBorrowRatio) {
        return 0;
      }

      let foundValue = false;
      let minBound = INITIAL_MIN_BOUND;
      let maxBound = INITIAL_MAX_BOUND;
      let absoluteMax = INITIAL_ABSOLUTE_MAX_BOUND;
      let iterations = 0;

      // The rounding amount of 1000 is helpful when the user tries to
      // fit his own funds into a structure without being overly accurate
      // which is annoying.
      // However for this calculation we don't need to round own funds as loosely
      this.ownFundsRoundingAmount = OWN_FUNDS_ROUNDING_ALGO;

      while (!foundValue) {
        iterations += 1;
        const nextPropertyValue = roundValue(
          (minBound + maxBound) / 2,
          ROUNDING_DIGITS,
        );

        const ownFunds = this.suggestStructure({
          borrowers,
          maxBorrowRatio,
          canton,
          residenceType,
          propertyValue: nextPropertyValue,
        });

        if (
          this.suggestedStructureIsValid({
            borrowers,
            maxBorrowRatio,
            canton,
            residenceType,
            propertyValue: nextPropertyValue,
            ownFunds,
          })
        ) {
          minBound = nextPropertyValue;
          maxBound = Math.min(
            maxBound * MAX_BOUND_MULTIPLICATION_FACTOR,
            absoluteMax,
          );
        } else {
          maxBound = nextPropertyValue;
          absoluteMax = maxBound;
        }

        if (maxBound - minBound <= ACCURACY) {
          foundValue = true;
        }

        if (iterations > MAX_ITERATIONS) {
          foundValue = true;
        }
      }

      this.ownFundsRoundingAmount = OWN_FUNDS_ROUNDING_AMOUNT;

      return minBound;
    }

    getNextStepSize({
      currentMax,
      currentBorrowRatio,
      stepSize,
      borrowers,
      residenceType,
      canton,
      direction,
      cache,
    }) {
      let newStepSize = stepSize;
      let foundBetterValue;

      while (!foundBetterValue) {
        let nextValue;
        if (direction === 'upwards') {
          nextValue = cache[currentBorrowRatio + stepSize]
            || this.getMaxPropertyValue({
              borrowers,
              residenceType,
              maxBorrowRatio: currentBorrowRatio + stepSize,
              canton,
            });
        } else {
          nextValue = cache[currentBorrowRatio - stepSize]
            || this.getMaxPropertyValue({
              borrowers,
              residenceType,
              maxBorrowRatio: currentBorrowRatio - stepSize,
              canton,
            });
        }

        if (nextValue > currentMax) {
          foundBetterValue = true;
        } else {
          newStepSize /= 2;
        }

        if (newStepSize < 0.05) {
          foundBetterValue = true;
        }
      }

      return newStepSize;
    }

    getMaxPropertyValueWithoutBorrowRatio({
      borrowers,
      residenceType,
      canton,
    }) {
      let borrowRatio = 0.7;
      let foundValue = false;
      let iterations = 0;
      let stepSize = INITIAL_BORROW_RATIO_STEP_SIZE;
      const deltaX = 0.01;
      let maxPropertyValue = 0;
      let optimalBorrowRatio;
      const cache = {};

      const setMax = (ratio, propertyValue) => {
        // Cache each result to avoid recalculating it later
        if (!cache[`${ratio}`]) {
          cache[`${ratio}`] = propertyValue;
        }

        // Always store the highest encountered value, in case the loop
        // stops prematurely, or if the stopping conditions would've skipped
        // a value that we already calculated
        if (propertyValue > maxPropertyValue) {
          maxPropertyValue = propertyValue;
          optimalBorrowRatio = ratio;
        }
      };

      while (!foundValue) {
        iterations += 1;

        const center = cache[borrowRatio]
          || this.getMaxPropertyValue({
            borrowers,
            residenceType,
            maxBorrowRatio: borrowRatio,
            canton,
          });
        setMax(borrowRatio, center);

        const yLeft = cache[borrowRatio - deltaX]
          || this.getMaxPropertyValue({
            borrowers,
            residenceType,
            maxBorrowRatio: borrowRatio - deltaX,
            canton,
          });
        setMax(borrowRatio - deltaX, yLeft);
        const yRight = cache[borrowRatio + deltaX]
          || this.getMaxPropertyValue({
            borrowers,
            residenceType,
            maxBorrowRatio: borrowRatio + deltaX,
            canton,
          });
        setMax(borrowRatio + deltaX, yRight);

        const slope = yRight - yLeft;

        if (yRight === 0 && yLeft === 0) {
          // If the algorithm is at 0 on both sides, it means the borrowRatio
          // is way too high, so start him over again at 0, but with a large
          // step size to allow it to recover quickly
          borrowRatio = INITIAL_BORROW_RATIO_STEP_SIZE;
          stepSize = 0.2;
        } else if (slope > 0) {
          stepSize = this.getNextStepSize({
            currentMax: center,
            currentBorrowRatio: borrowRatio,
            stepSize,
            borrowers,
            residenceType,
            canton,
            direction: 'upwards',
            cache,
          });
          borrowRatio += stepSize;
        } else {
          stepSize = this.getNextStepSize({
            currentMax: center,
            currentBorrowRatio: borrowRatio,
            stepSize,
            borrowers,
            residenceType,
            canton,
            direction: 'downwards',
            cache,
          });
          borrowRatio -= stepSize;
        }

        if (stepSize < deltaX / 2) {
          foundValue = true;
        }

        if (iterations > 50) {
          foundValue = true;
        }
      }

      // Round the borrowRatio, and recompute the exact property value
      const finalBorrowRatio = Math.round(optimalBorrowRatio * 10000) / 10000;
      const finalPropertyValue = cache[finalBorrowRatio]
        || this.getMaxPropertyValue({
          borrowers,
          residenceType,
          maxBorrowRatio: finalBorrowRatio,
          canton,
        });

      return {
        borrowRatio: finalBorrowRatio,
        propertyValue: finalPropertyValue,
      };
    }

    getMaxPropertyValueForLoan({
      loan,
      maxBorrowRatio,
      canton,
      residenceType,
    }) {
      const { borrowers, residenceType: loanResidenceType } = loan;
      return this.getMaxPropertyValue({
        borrowers,
        residenceType: residenceType || loanResidenceType,
        maxBorrowRatio,
        canton,
      });
    }

    suggestStructureForLoan({ loan, structureId }) {
      const propertyValue = this.getPropAndWork({ loan, structureId });
      const loanValue = this.selectLoanValue({ loan, structureId });
      const notaryFees = this.getFees({ loan, structureId }).total;

      return this.suggestStructure({
        borrowers: loan.borrowers,
        propertyValue,
        loanValue,
        residenceType: loan.residenceType,
        notaryFees,
      });
    }
  };
