import { Meteor } from 'meteor/meteor';

import SimpleSchema from 'simpl-schema';

import { address } from 'core/api/helpers/sharedSchemas';
import { MAX_BORROW_RATIO_PRIMARY_PROPERTY } from '../../../../config/financeConstants';
import Calculator, {
  Calculator as CalculatorClass,
} from '../../../../utils/Calculator';
import zipcodes from '../../../../utils/zipcodes';
import {
  RESIDENCE_TYPE,
  INTEREST_RATES,
  PURCHASE_TYPE,
} from '../../../constants';
import currentInterestRates from '../../../interestRates/queries/currentInterestRates';
import { checkQuery } from './helpers';

const LUXURY_VALUE_THRESHOLD = 2500000;
const SECOND_OR_LUXURY_AMORTIZATION_GOAL = 0.5;
const SECOND_OR_LUXURY_BORROW_RATIO = 0.67;

const roundToCents = val => Number(val.toFixed(2));
const getBorrowRatio = (residenceType, propertyValue) => {
  if (residenceType === RESIDENCE_TYPE.SECOND_RESIDENCE) {
    return SECOND_OR_LUXURY_BORROW_RATIO;
  }

  if (propertyValue >= LUXURY_VALUE_THRESHOLD) {
    return SECOND_OR_LUXURY_BORROW_RATIO;
  }

  return MAX_BORROW_RATIO_PRIMARY_PROPERTY;
};

const querySchema = new SimpleSchema({
  'property-value': { type: Number, min: 50000 },
  'monthly-maintenance': {
    type: Number,
    optional: true,
    defaultValue: 0,
    min: 0,
  },
  'residence-type': {
    type: String,
    optional: true,
    defaultValue: RESIDENCE_TYPE.MAIN_RESIDENCE,
    allowedValues: Object.values(RESIDENCE_TYPE),
  },
  'purchase-type': {
    type: String,
    optional: true,
    defaultValue: PURCHASE_TYPE.ACQUISITION,
    allowedValues: Object.values(PURCHASE_TYPE),
  },
  'include-notary-fees': {
    type: Boolean,
    optional: true,
    defaultValue: true,
  },
  ...{ 'zip-code': address.zipCode, canton: address.canton },
});

const mortgageEstimateAPI = ({ query }) => {
  const {
    'property-value': propertyValue,
    'residence-type': residenceType,
    'purchase-type': purchaseType,
    'zip-code': zipCode,
    'monthly-maintenance': maintenance,
    'include-notary-fees': includeNotaryFees,
    canton,
  } = checkQuery({ query, schema: querySchema });

  const date = Date.now();
  const { averageRates: interestRates } = currentInterestRates.clone().fetch();
  const finalCanton = zipCode ? zipcodes(zipCode) : canton;
  const borrowRatio = getBorrowRatio(residenceType, propertyValue);
  const loanValue = roundToCents(propertyValue * borrowRatio);
  const loanObject = Calculator.createLoanObject({
    residenceType,
    wantedLoan: loanValue,
    propertyValue,
    canton: finalCanton,
    currentInterestRates: interestRates,
    loanTranches: [{ value: 1, type: INTEREST_RATES.YEARS_10 }],
  });
  const amortizationGoal = borrowRatio === SECOND_OR_LUXURY_BORROW_RATIO
    ? SECOND_OR_LUXURY_AMORTIZATION_GOAL
    : undefined;

  const calc = new CalculatorClass({ loan: loanObject, amortizationGoal });
  const interests10 = calc.getInterests({ loan: loanObject });
  const interests5 = calc.getInterests({
    loan: Calculator.createLoanObject({
      residenceType,
      wantedLoan: loanValue,
      propertyValue,
      canton: finalCanton,
      currentInterestRates: interestRates,
      loanTranches: [{ value: 1, type: INTEREST_RATES.YEARS_5 }],
    }),
  });
  const interestsLibor = calc.getInterests({
    loan: Calculator.createLoanObject({
      residenceType,
      wantedLoan: loanValue,
      propertyValue,
      canton: finalCanton,
      currentInterestRates: interestRates,
      loanTranches: [{ value: 1, type: INTEREST_RATES.LIBOR }],
    }),
  });
  const amortization = roundToCents(calc.getAmortization({ loan: loanObject }));
  const notaryFees = includeNotaryFees
    ? calc.getFees({ loan: loanObject })
    : null;
  const totalValue = roundToCents(propertyValue + (notaryFees ? notaryFees.total : 0));

  return {
    borrowRatio,
    date,
    loanValue,
    monthlyAmortization: amortization,
    monthlyInterests: {
      interests10,
      interests5,
      interestsLibor,
    },
    monthlyMaintenance: maintenance,
    monthlyTotals: {
      interests10: amortization + maintenance + interests10,
      interests5: amortization + maintenance + interests5,
      interestsLibor: amortization + maintenance + interestsLibor,
    },
    notaryFees: notaryFees
      ? {
        canton: notaryFees.canton,
        estimate: notaryFees.estimate,
        total: notaryFees.total,
      }
      : undefined,
    ownFunds: roundToCents(totalValue - loanValue),
    purchaseType,
    residenceType,
    totalValue,
  };
};

export default mortgageEstimateAPI;
