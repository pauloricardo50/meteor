import constants from '../config/constants';
import { USAGE_TYPE, LOAN_STRATEGY_PRESET, OFFER_TYPE } from '../api/constants';
import { getIncomeRatio } from './finance-math';
import { propertyPercent, filesPercent } from '../arrays/steps';
import { requestFiles, propertyFiles } from '../api/files/files';

export const getProjectValue = ({ loanRequest, property }) => {
  if (!property.value) {
    return 0;
  } else if (property.value <= 0) {
    return 0;
  }

  let value =
    property.value * (1 + constants.notaryFees) + (general.propertyWork || 0);

  if (loanRequest.general.usageType === USAGE_TYPE.PRIMARY) {
    value +=
      (loanRequest.general.insuranceFortuneUsed || 0) * constants.lppFees;
  }

  return Math.max(0, Math.round(value));
};

export const getLoanValue = ({ loanRequest, property }, roundedTo10000) => {
  if (!loanRequest.general) {
    return 0;
  }

  let value =
    getProjectValue({ loanRequest, property }) -
    (loanRequest.general.fortuneUsed || 0);

  if (loanRequest.general.usageType === USAGE_TYPE.PRIMARY) {
    value -= loanRequest.general.insuranceFortuneUsed || 0;
  }

  // Do this when picking tranches
  if (roundedTo10000) {
    value = Math.round(value / 10000) * 10000;
  }

  // Check negative values
  return Math.max(0, Math.round(value));
};

export const loanStrategySuccess = (loanTranches = [], loanValue) => {
  if (!Number.isInteger(loanValue)) {
    throw new Error('loanValue must be an integer');
  }
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

export const strategiesChosen = ({ loanRequest }) =>
  loanStrategySuccess(
    loanRequest.general.loanTranches,
    getLoanValue({ loanRequest }),
  ) &&
  loanRequest.logic.amortizationStrategyPreset &&
  loanRequest.logic.hasValidatedCashStrategy;

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
  { loanRequest, offer },
  isStandard = true,
) => {
  if (!offer) {
    return 0;
  }

  const tranches = loanRequest.general.loanTranches;
  const interestRates = isStandard
    ? offer.standardOffer
    : offer.counterpartOffer;

  let interests = 0;
  tranches.every((tranche) => {
    const rate = interestRates[tranche.type];

    // If the lender doesn't have this interest rate, return false
    if (!rate) {
      interests = -1;
      // break loop
      return false;
    }

    interests += tranche.value * rate;
    return true;
  });

  return interests >= 0 ? Math.round(interests / 12) : interests;
};

export const getMonthlyWithOffer = (
  { loanRequest, property },
  offer,
  isStandard = true,
  fortuneUsed = 0,
  insuranceFortuneUsed = 0,
) => {
  // Return undefined if the counterpartOffer doesn't exist
  if (!isStandard && !offer.counterpartOffer) {
    return undefined;
  }

  // Make a copy of the request
  const r = {
    ...loanRequest,
    general: {
      ...loanRequest.general,
      fortuneUsed: fortuneUsed || loanRequest.general.fortuneUsed,
      insuranceFortuneUsed:
        insuranceFortuneUsed || loanRequest.general.insuranceFortuneUsed,
    },
  };

  // Modify it to include additional parameters
  // r.general.fortuneUsed = fortuneUsed || r.general.fortuneUsed;
  // r.general.insuranceFortuneUsed =
  //   insuranceFortuneUsed || r.general.insuranceFortuneUsed;
  const loan = getLoanValue({ loanRequest: r, property });

  const maintenance =
    constants.maintenanceReal *
    (property.value + (r.general.propertyWork || 0));

  let amortization = isStandard
    ? offer.standardOffer.amortization
    : offer.counterpartOffer.amortization;
  amortization = amortization || constants.amortization;

  const interests = getInterestsWithOffer(
    { loanRequest: r },
    offer,
    isStandard,
  );

  return interests >= 0
    ? Math.round((maintenance + loan * amortization + interests) / 12) || 0
    : 0;
};

export const getMonthlyWithExtractedOffer = ({ loanRequest, offer }) =>
  getMonthlyWithOffer(
    loanRequest,
    {
      [offer.type === OFFER_TYPE.STANDARD
        ? 'standardOffer'
        : 'counterpartOffer']: offer,
    },
    offer.type === OFFER_TYPE.STANDARD,
  );

export const getPropAndWork = ({ loanRequest, property }) =>
  (property && property.value + (loanRequest.general.propertyWork || 0)) || 0;

export const getTotalUsed = ({ loanRequest }) =>
  Math.round(loanRequest.general.fortuneUsed +
      (loanRequest.general.insuranceFortuneUsed || 0));

export const getBorrowRatio = ({ loanRequest, property }) => {
  const loan = getLoanValue({ loanRequest, property });
  const propAndWork = getPropAndWork({ loanRequest, property });

  return loan / propAndWork;
};

export const getLenderCount = ({ loanRequest, borrowers, property }) => {
  const incomeRatio = getIncomeRatio(loanRequest, borrowers);
  const borrowRatio = getBorrowRatio({ loanRequest, property });
  if (incomeRatio > 0.38) {
    return 0;
  } else if (incomeRatio > 1 / 3) {
    return 4;
  } else if (borrowRatio <= 0.65) {
    return 20;
  } else if (borrowRatio > 0.65 && borrowRatio <= 0.9) {
    return 10;
  }

  return 0;
};

export const disableForms = ({ loanRequest }) =>
  !!(
    loanRequest.logic &&
    (loanRequest.logic.step > 1 ||
      (loanRequest.logic.verification &&
        (loanRequest.logic.verification.requested ||
          loanRequest.logic.verification.validated !== undefined)))
  );

export const getFees = ({ loanRequest, property }) => {
  const notaryFees = property.value * constants.notaryFees;
  let insuranceFees = 0;

  if (loanRequest.general.usageType === USAGE_TYPE.PRIMARY) {
    insuranceFees =
      loanRequest.general.insuranceFortuneUsed * constants.lppFees;
  }

  return notaryFees + (insuranceFees || 0);
};

export const isRequestValid = ({ loanRequest, borrowers }) => {
  const incomeRatio = getIncomeRatio({ loanRequest, borrowers });
  const borrowRatio = getBorrowRatio({ loanRequest, borrowers });
  const fees = getFees({ loanRequest });
  const propAndWork = getPropAndWork({ loanRequest, props });

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

export const getPropertyCompletion = ({ loanRequest, borrowers, property }) =>
  (propertyPercent(loanRequest, borrowers, property) +
    filesPercent(loanRequest, requestFiles, 'auction') +
    filesPercent(property, propertyFiles, 'auction')) /
  3;

export const validateRatios = (
  incomeRatio,
  borrowRatio,
  allowInsurance = true,
  borrowRatioWanted,
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

  return true;
};

export const validateRatiosCompletely = (
  incomeRatio,
  borrowRatio,
  allowInsurance = true,
  borrowRatioWanted = 0.9,
) => {
  try {
    validateRatios(incomeRatio, borrowRatio, borrowRatioWanted, allowInsurance);
    return {
      isValid: true,
      message: 'valid',
      message2: '',
      icon: 'check',
      className: 'success',
    };
  } catch (error) {
    const isTight = error.message.indexOf('Tight') >= 0;
    return {
      isValid: false,
      message: `${error.message}`,
      message2: `${error.message}2`,
      icon: isTight ? 'warning' : 'close',
      className: isTight ? 'warning' : 'error',
    };
  }
};

// Returns the maintenance to pay every month, i.e. 1% of the property divided by 12 months
export const getMaintenance = ({ property }) => property.value * 0.01 / 12;

export const strategyDone = ({ loanRequest }) => {
  const { general, logic } = loanRequest;
  if (general.insuranceFortuneUsed > 0 && !logic.insuranceUsePreset) {
    return false;
  }

  if (!logic.amortizationStrategyPreset) {
    return false;
  }

  if (!logic.loanStrategyPreset) {
    return false;
  }

  if (
    logic.loanStrategyPreset === LOAN_STRATEGY_PRESET.MANUAL &&
    !loanStrategySuccess(general.loanTranches, getLoanValue(loanRequest, true))
  ) {
    return false;
  }

  return true;
};
