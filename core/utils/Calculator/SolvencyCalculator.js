import { OWN_FUNDS_TYPES, RESIDENCE_TYPE } from '../../api/constants';
import { arrayify } from '../general';
import { NotaryFeesCalculator } from '../notaryFees/index';

// @flow

export const withSolvencyCalculator = (SuperClass = class {}) =>
  class extends SuperClass {
    getAllowedOwnFundsTypes({ residenceType }) {
      return residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE
        ? Object.values(OWN_FUNDS_TYPES)
        : [
          OWN_FUNDS_TYPES.BANK_FORTUNE,
          OWN_FUNDS_TYPES.INSURANCE_3B,
          OWN_FUNDS_TYPES.THIRD_PARTY_FORTUNE,
        ];
    }

    makeOwnFunds({ borrowers, type, usageType, max }) {
      return arrayify(borrowers)
        .map((borrower) => {
          const ownFundsObject = {
            type,
            value: Math.ceil(Math.min(max, this.getFunds({ borrowers: borrower, type }))),
            borrowerId: borrower._id,
          };

          if (usageType) {
            return { ...ownFundsObject, usageType };
          }

          return ownFundsObject;
        })
        .filter(({ value }) => value && value > 0);
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

      loanValue = loanValue || Math.round(propertyValue * maxBorrowRatio);

      if (forcedNotaryFees) {
        notaryFees = forcedNotaryFees;
      } else {
        const notaryCalc = new NotaryFeesCalculator({ canton });
        notaryFees = notaryCalc.getNotaryFeesWithoutLoan({
          propertyValue,
          mortgageNoteIncrease: loanValue,
          residenceType,
        }).total;
      }

      let requiredOwnFunds = propertyValue + notaryFees - loanValue;
      const ownFunds = [];

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

          ownFunds.push(...newOwnFunds);
        });
      });

      return ownFunds;
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
      loanValue = loanValue || Math.round(propertyValue * maxBorrowRatio);
      const loanObject = {
        residenceType,
        borrowers,
        structure: {
          wantedLoan: loanValue,
          propertyValue,
          property: { canton },
          ownFunds,
        },
      };

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
      let foundValue = false;
      let minBound = 0;
      let maxBound = 1000000;
      let absoluteMax = 100000000;
      let iterations = 0;

      while (!foundValue) {
        iterations++;
        const nextPropertyValue = Math.round((minBound + maxBound) / (2 * 10000)) * 10000;

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
          maxBound = Math.min(maxBound * 2, absoluteMax);
        } else {
          maxBound = nextPropertyValue;
          absoluteMax = maxBound;
        }

        if (maxBound - minBound <= 10000) {
          foundValue = minBound;
        }

        if (iterations > 50) {
          return minBound;
        }
      }

      console.log('getMaxPropertyValue iterations:', iterations);
      return foundValue;
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
      const propertyValue = this.selectPropertyValue({ loan, structureId });
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
