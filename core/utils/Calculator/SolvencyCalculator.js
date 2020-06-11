import { OWN_FUNDS_TYPES } from '../../api/borrowers/borrowerConstants';
import { OWN_FUNDS_USAGE_TYPES } from '../../api/loans/loanConstants';
import { RESIDENCE_TYPE } from '../../api/properties/propertyConstants';
import {
  MIN_INSURANCE2_WITHDRAW,
  OWN_FUNDS_ROUNDING_AMOUNT,
} from '../../config/financeConstants';
import { roundValue } from '../conversionFunctions';
import { arrayify } from '../general';
import { NotaryFeesCalculator } from '../notaryFees';

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
        .map(borrower => {
          const availableFunds = this.getFunds({ borrowers: borrower, type });
          const ownFundsObject = {
            type,
            value: Math.ceil(Math.min(max, availableFunds)),
            borrowerId: borrower._id,
          };

          // Make sure we never suggest the usage of insurance2 if the borrower
          // has less than MIN_INSURANCE2_WITHDRAW
          if (
            type === OWN_FUNDS_TYPES.INSURANCE_2 &&
            availableFunds < MIN_INSURANCE2_WITHDRAW
          ) {
            return { value: 0 };
          }

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
      loanValue,
      canton,
      residenceType,
      fees: forcedFees,
      borrowRatio = this.getMaxBorrowRatio({
        loan: this.createLoanObject({ residenceType }),
      }),
      purchaseType,
      previousLoanTranches,
    }) {
      let fees;

      const finalLoanValue =
        loanValue || Math.round(propertyValue * borrowRatio);

      if (forcedFees >= 0) {
        fees = forcedFees;
      } else {
        const notaryCalc = new NotaryFeesCalculator({ canton });
        fees = notaryCalc.getNotaryFeesWithoutLoan({
          propertyValue,
          mortgageNoteIncrease: finalLoanValue,
          residenceType,
          purchaseType,
        }).total;
      }

      let requiredOwnFunds = Math.round(
        this.getRequiredOwnFunds({
          loan: this.createLoanObject({
            residenceType,
            purchaseType,
            propertyValue,
            wantedLoan: finalLoanValue,
            notaryFees: fees, // This is a mix of notaryFees and reimbursementFees, but the math doesn't care about the split
            previousLoanTranches,
          }),
        }),
      );
      let ownFunds = [];

      // Get all possible OWN_FUNDS_TYPES
      const allowedOwnFundsTypes = this.getAllowedOwnFundsTypes({
        residenceType,
      });

      allowedOwnFundsTypes.forEach(type => {
        borrowers.forEach(borrower => {
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

      const insurance2Suggestions = ownFunds.filter(
        ({ type }) => type === OWN_FUNDS_TYPES.INSURANCE_2,
      );

      // If one of the recommended insurance2 withdrawals is too low, try to increase
      // it by increasing another value
      if (
        insurance2Suggestions.length &&
        insurance2Suggestions.some(
          ({ value }) => value < MIN_INSURANCE2_WITHDRAW,
        )
      ) {
        ownFunds = this.adjustInsurance2Withdrawal({ ownFunds });
      }

      return ownFunds;
    }

    adjustInsurance2Withdrawal({ ownFunds }) {
      // Reverse ownFunds to start from the last suggested ownFunds,
      // and progressively increase those if possible.
      // In getAllowedOwnFundsTypes we use up all the funds in that order
      // so we're most likely to find available funds in the last ones
      const newOwnFunds = ownFunds.slice(0).reverse();
      let insurance2Value = ownFunds.find(
        ({ type, value }) =>
          type === OWN_FUNDS_TYPES.INSURANCE_2 &&
          value < MIN_INSURANCE2_WITHDRAW,
      );

      const totalWithoutInsurance2 = ownFunds
        .filter(({ type }) => type !== OWN_FUNDS_TYPES.INSURANCE_2)
        .reduce((tot, { value: v }) => tot + v, 0);

      while (insurance2Value && insurance2Value.value) {
        let delta = MIN_INSURANCE2_WITHDRAW - insurance2Value.value;
        if (totalWithoutInsurance2 < delta) {
          // There's nothing that can be done to adjust this structure's insurance2,
          // just break and let this suggestion fail
          break;
        }

        newOwnFunds.forEach((ownFund, index) => {
          const { type, value } = ownFund;

          if (delta <= 0 || type === OWN_FUNDS_TYPES.INSURANCE_2) {
            // Iterate through all the non-insurance-2 ownFunds until delta is
            // brought down to 0, i.e. the missing insurance2 has been compensated
            // by removing other own funds
            return;
          }

          const amountToRemove = Math.min(value, delta);

          // Reduce another ownFund
          newOwnFunds[index] = {
            ...ownFund,
            value: value - amountToRemove,
          };

          delta -= amountToRemove;

          const insurance2Index = newOwnFunds.findIndex(
            ({ type: t, value: v }) =>
              t === OWN_FUNDS_TYPES.INSURANCE_2 && v < MIN_INSURANCE2_WITHDRAW,
          );

          // increase this ownFund
          newOwnFunds[insurance2Index] = {
            ...newOwnFunds[insurance2Index],
            value: newOwnFunds[insurance2Index].value + amountToRemove,
          };
        });

        // In the super rare (or even impossible) case where insurance2 of multiple borrowers is
        // below MIN_INSURANCE2_WITHDRAW
        insurance2Value = newOwnFunds.find(
          ({ type, value }) =>
            type === OWN_FUNDS_TYPES.INSURANCE_2 &&
            value < MIN_INSURANCE2_WITHDRAW,
        );
      }

      // filter out potential ownFund values brought to 0
      return [...newOwnFunds.reverse()].filter(({ value }) => value > 0);
    }

    createLoanObject({
      residenceType,
      borrowers,
      wantedLoan,
      propertyValue,
      canton,
      ownFunds = [],
      loanTranches = [],
      notaryFees,
      purchaseType,
      previousLoanTranches,
      ...rest
    }) {
      return {
        residenceType,
        purchaseType,
        borrowers,
        previousLoanTranches,
        structure: {
          wantedLoan,
          propertyValue,
          property: { canton },
          ownFunds,
          loanTranches,
          notaryFees,
        },
        ...rest,
      };
    }

    suggestedStructureIsValid({
      borrowers,
      propertyValue,
      loanValue,
      canton,
      residenceType,
      ownFunds,
      borrowRatio = this.getMaxBorrowRatio({
        loan: this.createLoanObject({ residenceType }),
      }),
      purchaseType,
      notaryFees,
    }) {
      const finalLoanValue =
        loanValue || Math.round(propertyValue * borrowRatio);
      const loanObject = this.createLoanObject({
        residenceType,
        borrowers,
        wantedLoan: finalLoanValue,
        propertyValue,
        canton,
        ownFunds,
        purchaseType,
        notaryFees,
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

    getMaxPropertyValue({
      borrowers,
      maxBorrowRatio,
      canton,
      residenceType,
      purchaseType,
    }) {
      // Immediately stop iterating if maxBorrowRatio is above what is allowed
      if (
        this.getMaxBorrowRatio({
          loan: this.createLoanObject({ residenceType }),
        }) < maxBorrowRatio
      ) {
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
          borrowRatio: maxBorrowRatio,
          canton,
          residenceType,
          propertyValue: nextPropertyValue,
          purchaseType,
        });

        if (
          this.suggestedStructureIsValid({
            borrowers,
            borrowRatio: maxBorrowRatio,
            canton,
            residenceType,
            propertyValue: nextPropertyValue,
            ownFunds,
            purchaseType,
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
      purchaseType,
    }) {
      let newStepSize = stepSize;
      let foundBetterValue;

      while (!foundBetterValue) {
        let nextValue;
        if (direction === 'upwards') {
          nextValue =
            cache[currentBorrowRatio + stepSize] ||
            this.getMaxPropertyValue({
              borrowers,
              residenceType,
              maxBorrowRatio: currentBorrowRatio + stepSize,
              canton,
              purchaseType,
            });
        } else {
          nextValue =
            cache[currentBorrowRatio - stepSize] ||
            this.getMaxPropertyValue({
              borrowers,
              residenceType,
              maxBorrowRatio: currentBorrowRatio - stepSize,
              canton,
              purchaseType,
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
      purchaseType,
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

        const center =
          cache[borrowRatio] ||
          this.getMaxPropertyValue({
            borrowers,
            residenceType,
            maxBorrowRatio: borrowRatio,
            canton,
            purchaseType,
          });
        setMax(borrowRatio, center);

        const yLeft =
          cache[borrowRatio - deltaX] ||
          this.getMaxPropertyValue({
            borrowers,
            residenceType,
            maxBorrowRatio: borrowRatio - deltaX,
            canton,
            purchaseType,
          });
        setMax(borrowRatio - deltaX, yLeft);
        const yRight =
          cache[borrowRatio + deltaX] ||
          this.getMaxPropertyValue({
            borrowers,
            residenceType,
            maxBorrowRatio: borrowRatio + deltaX,
            canton,
            purchaseType,
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
            purchaseType,
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
            purchaseType,
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
      const finalPropertyValue =
        cache[finalBorrowRatio] ||
        this.getMaxPropertyValue({
          borrowers,
          residenceType,
          maxBorrowRatio: finalBorrowRatio,
          canton,
          purchaseType,
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
      const {
        borrowers,
        residenceType: loanResidenceType,
        purchaseType,
      } = loan;
      return this.getMaxPropertyValue({
        borrowers,
        residenceType: residenceType || loanResidenceType,
        maxBorrowRatio,
        canton,
        purchaseType,
      });
    }

    getMaxBorrowRatioForLoan({
      loan,
      structureId,
      canton = this.selectPropertyKey({ loan, structureId, key: 'canton' }),
      residenceType = loan.residenceType,
    }) {
      const { borrowers = [], purchaseType } = loan;
      const propertyValue = this.selectPropertyValue({ loan, structureId });
      const maxBorrowRatio = this.getMaxBorrowRatio({ loan, structureId });
      const previousOwnFunds = this.getPreviousOwnFunds({ loan, structureId });
      const borrowRatioStepSize = 0.005;
      const updatedBorrowers = borrowers.map(
        ({ bankFortune = [], ...borrower }, index) => {
          if (index === 0) {
            // Inject the current own funds of the property in the borrowers bankFortune
            // this is not entirely accurate, but we're assuming that there is enough fortune in there
            // to cover the required 10% cash needed
            return {
              ...borrower,
              bankFortune: [...bankFortune, { value: previousOwnFunds }],
            };
          }
          return borrower;
        },
      );
      let borrowRatio = maxBorrowRatio;
      let foundStructure = false;

      while (borrowRatio > 0 && !foundStructure) {
        const ownFunds = this.suggestStructure({
          borrowers: updatedBorrowers,
          borrowRatio,
          canton,
          residenceType,
          propertyValue,
          // FIXME: There could be notary fees related to increasing the mortgage note
          // this is currently not handled and a potential flaw to take into
          // account
          fees: 0,
          purchaseType,
        });

        if (
          this.suggestedStructureIsValid({
            borrowers: updatedBorrowers,
            borrowRatio,
            canton,
            residenceType,
            propertyValue,
            ownFunds,
            purchaseType,
            notaryFees: 0,
          })
        ) {
          foundStructure = true;
        } else {
          borrowRatio -= borrowRatioStepSize;
        }
      }

      return { borrowRatio, propertyValue };
    }

    suggestStructureForLoan({ loan, structureId }) {
      const propertyValue = this.getPropAndWork({ loan, structureId });
      const loanValue = this.selectLoanValue({ loan, structureId });
      const fees = this.getFees({ loan, structureId }).total;
      const {
        borrowers,
        residenceType,
        purchaseType,
        previousLoanTranches,
      } = loan;

      return this.suggestStructure({
        borrowers,
        propertyValue,
        loanValue,
        residenceType,
        fees,
        purchaseType,
        previousLoanTranches,
      });
    }
  };
