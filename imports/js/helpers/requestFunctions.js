import constants from '../config/constants';

import { getIncomeRatio, getBorrowRatio, getFees } from './finance-math';
import { propertyPercent, filesPercent } from '/imports/js/arrays/steps';
import { requestFiles } from '/imports/js/arrays/files';

import CheckIcon from 'material-ui/svg-icons/navigation/check';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import WarningIcon from 'material-ui/svg-icons/alert/warning';

export const getProjectValue = (loanRequest) => {
  if (loanRequest.property.value <= 0) {
    return 0;
  }

  let value =
    loanRequest.property.value * (1 + constants.notaryFees) +
    (loanRequest.property.propertyWork || 0);

  if (loanRequest.property.usageType === 'primary') {
    value +=
      (loanRequest.general.insuranceFortuneUsed || 0) * constants.lppFees;
  }

  return Math.max(0, Math.round(value));
};

export const getLoanValue = (loanRequest) => {
  let value = getProjectValue(loanRequest) - loanRequest.general.fortuneUsed;

  if (loanRequest.property.usageType === 'primary') {
    value -= loanRequest.general.insuranceFortuneUsed || 0;
  }

  // Check negative values
  return Math.max(0, Math.round(value));
};

export const loanStrategySuccess = (loanTranches = [], loanValue) => {
  if (loanTranches.length < 1) {
    return false;
  }
  // User has to choose a preset
  const trancheSum = loanTranches.reduce(
    (tot, tranche) => tranche.value + tot,
    0,
  );
  if (trancheSum === loanValue) {
    // If the sum of all tranches is equal to the loan, success!
    return true;
  }

  return false;
};

export const strategiesChosen = loanRequest =>
  loanStrategySuccess(loanRequest) &&
  loanRequest.logic.amortizationStrategyPreset &&
  loanRequest.logic.hasValidatedCashStrategy;

export const getMonthlyWithOffer = (
  request,
  fortuneUsed,
  insuranceFortuneUsed,
  tranches,
  interestRates,
  amortization,
) => {
  // Make a copy of the request
  const r = JSON.parse(JSON.stringify(request));

  // Modify it to include additional parameters
  r.general.fortuneUsed = fortuneUsed || r.general.fortuneUsed;
  r.general.insuranceFortuneUsed =
    insuranceFortuneUsed || r.general.insuranceFortuneUsed;
  const loan = getLoanValue(r);

  const maintenance =
    constants.maintenanceReal *
    (r.property.value + (r.property.propertyWork || 0));

  let interests = 0;
  tranches.some((tranche) => {
    const rate = interestRates[tranche.type];

    // If the lender doesn't have this interest rate, return false
    if (!rate) {
      interests = -1;
      return false;
    }

    interests += tranche.value * rate;
  });

  return interests >= 0
    ? Math.round((maintenance + loan * amortization + interests) / 12)
    : 0;
};

/**
 * getInterestsWithOffer - Get the aggregate monthly interest rate for a
 * loanRequest and an offer
 *
 * @param {type}    loanRequest              Description
 * @param {type}    offer                    Description
 * @param {boolean} [withCounterparts=false] Description
 *
 * @return {Number} min 0
 */
export const getInterestsWithOffer = (
  loanRequest,
  offer,
  withCounterparts = false,
) => {
  const tranches = loanRequest.general.loanTranches;
  const interestRates = withCounterparts
    ? offer.counterpartOffer
    : offer.standardOffer;

  let interests = 0;
  tranches.some((tranche) => {
    const rate = interestRates[tranche.type];

    // If the lender doesn't have this interest rate, return false
    if (!rate) {
      interests = -1;
      return false;
    }

    interests += tranche.value * rate;
  });

  return interests >= 0 ? Math.round(interests / 12) : 0;
};

export const getPropAndWork = loanRequest =>
  loanRequest.property.value + (loanRequest.property.propertyWork || 0);

export const getTotalUsed = loanRequest =>
  Math.round(
    loanRequest.general.fortuneUsed +
      (loanRequest.general.insuranceFortuneUsed || 0),
  );

export const getLenderCount = (loanRequest, borrowers) => {
  const incomeRatio = getIncomeRatio(loanRequest, borrowers);
  const borrowRatio = getBorrowRatio(loanRequest, borrowers);
  if (incomeRatio > 0.38) {
    return 0;
  } else if (incomeRatio > 1 / 3) {
    return 4;
  } else if (borrowRatio <= 0.65) {
    return 30;
  } else if (borrowRatio > 0.65 && borrowRatio <= 0.9) {
    return 20;
  }

  return 0;
};

export const disableForms = loanRequest =>
  loanRequest.logic.step > 1 ||
  loanRequest.logic.verification.requested ||
  loanRequest.logic.verification.validated !== undefined;

export const isRequestValid = (loanRequest, borrowers) => {
  const incomeRatio = getIncomeRatio(loanRequest, borrowers);
  const borrowRatio = getBorrowRatio(loanRequest, borrowers);
  const fees = getFees(loanRequest);
  const propAndWork = getPropAndWork(loanRequest);

  const cashRequired = constants.minCash * propAndWork + fees;

  if (incomeRatio > 0.38) {
    throw new Error('income');
  } else if (loanRequest.general.fortuneUsed < cashRequired) {
    throw new Error('cash');
  } else if (borrowRatio > 0.8) {
    throw new Error('ownFunds');
  }

  return true;
};

export const getPropertyCompletion = (loanRequest, borrowers) =>
  (propertyPercent(loanRequest, borrowers) +
    filesPercent(loanRequest, requestFiles, 'auction')) /
  2;

export const validateRatios = (
  incomeRatio,
  borrowRatio,
  borrowRatioWanted,
  allowInsurance,
) => {
  // To prevent rounding errors
  const incomeRatioSafe = incomeRatio - 0.001;
  const borrowRatioSafe = borrowRatio - 0.001;

  if (borrowRatioWanted && borrowRatioWanted !== 0.8) {
    if (borrowRatioSafe > borrowRatioWanted) {
      throw new Error('fortune');
    }
  }

  if (incomeRatioSafe > 0.38) {
    throw new Error('income');
  } else if (!allowInsurance && borrowRatioSafe > 0.8) {
    throw new Error('fortune');
  } else if (borrowRatioSafe > 0.9) {
    throw new Error('fortune');
  } else if (incomeRatioSafe > 1 / 3) {
    throw new Error('incomeTight');
  } else if (borrowRatioSafe > 0.8) {
    throw new Error('fortuneTight');
  }
};

export const validateRatiosCompletely = (
  incomeRatio,
  borrowRatio,
  borrowRatioWanted,
  allowInsurance = true,
) => {
  try {
    validateRatios(incomeRatio, borrowRatio, borrowRatioWanted, allowInsurance);
    return {
      isValid: true,
      message: 'valid',
      message2: '',
      icon: CheckIcon,
      className: 'success',
    };
  } catch (error) {
    const isTight = error.message.indexOf('Tight') >= 0;
    return {
      isValid: false,
      message: `${error.message}`,
      message2: `${error.message}2`,
      icon: isTight ? WarningIcon : CloseIcon,
      className: isTight ? 'warning' : 'error',
    };
  }
};
