import moment from 'moment';

import constants from '../config/constants';
import { USAGE_TYPE, LOAN_STRATEGY_PRESET, OFFER_TYPE, FILE_STEPS } from '../api/constants';
import { getIncomeRatio } from './finance-math';
import { propertyPercent, filesPercent } from '../arrays/steps';
import { loanDocuments, propertyDocuments } from '../api/files/documents';

export const getProjectValue = ({ loan, property }) => {
  if (!property || !property.value) {
    return 0;
  } else if (property.value <= 0) {
    return 0;
  }

  let value =
    property.value * (1 + constants.notaryFees) +
    (loan.general.propertyWork || 0);

  if (loan.general.usageType === USAGE_TYPE.PRIMARY) {
    value += (loan.general.insuranceFortuneUsed || 0) * constants.lppFees;
  }

  return Math.max(0, Math.round(value));
};

export const getLoanValue = ({ loan, property }, roundedTo10000) => {
  if (!loan || !loan.general) {
    return 0;
  }

  let value =
    getProjectValue({ loan, property }) - (loan.general.fortuneUsed || 0);

  if (loan.general.usageType === USAGE_TYPE.PRIMARY) {
    value -= loan.general.insuranceFortuneUsed || 0;
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

export const strategiesChosen = ({ loan, property }) =>
  loanStrategySuccess(
    loan.general.loanTranches,
    getLoanValue({ loan, property }),
  ) &&
  loan.logic.amortizationStrategyPreset &&
  loan.logic.hasValidatedCashStrategy;

/**
 * getInterestsWithOffer - Get the aggregate monthly interest rate for a
 * loan and an offer
 *
 * @param {type}    loan              Description
 * @param {type}    offer                    Description
 * @param {boolean} [withCounterparts=false] Description
 *
 * @return {Number} min 0
 */
export const getInterestsWithOffer = ({ loan, offer }, isStandard = true) => {
  if (!offer) {
    return 0;
  }

  const tranches = loan.general.loanTranches;
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
  { loan, property, offer },
  isStandard = true,
  fortuneUsed = 0,
  insuranceFortuneUsed = 0,
) => {
  // Return undefined if the counterpartOffer doesn't exist
  if (!isStandard && !offer.counterpartOffer) {
    return undefined;
  }

  // Make a copy of the loan
  const r = {
    ...loan,
    general: {
      ...loan.general,
      fortuneUsed: fortuneUsed || loan.general.fortuneUsed,
      insuranceFortuneUsed:
        insuranceFortuneUsed || loan.general.insuranceFortuneUsed,
    },
  };

  // Modify it to include additional parameters
  // r.general.fortuneUsed = fortuneUsed || r.general.fortuneUsed;
  // r.general.insuranceFortuneUsed =
  //   insuranceFortuneUsed || r.general.insuranceFortuneUsed;
  const loanValue = getLoanValue({ loan: r, property });

  const maintenance =
    constants.maintenanceReal *
    (property.value + (r.general.propertyWork || 0));

  let amortization = isStandard
    ? offer.standardOffer.amortization
    : offer.counterpartOffer.amortization;
  amortization = amortization || constants.amortization;

  const interests = getInterestsWithOffer({ loan: r, offer }, isStandard);

  return interests >= 0
    ? Math.round((maintenance + loanValue * amortization + interests) / 12) || 0
    : 0;
};

export const getMonthlyWithExtractedOffer = ({ loan, offer, property }) =>
  getMonthlyWithOffer(
    {
      loan,
      property,
      offer: {
        [offer.type === OFFER_TYPE.STANDARD
          ? 'standardOffer'
          : 'counterpartOffer']: offer,
      },
    },
    offer.type === OFFER_TYPE.STANDARD,
  );

export const getPropAndWork = ({ loan, property }) =>
  (property &&
    property.value +
      ((loan && loan.general && loan.general.propertyWork) || 0)) ||
  0;

export const getTotalUsed = ({ loan }) =>
  Math.round(loan.general.fortuneUsed + (loan.general.insuranceFortuneUsed || 0));

export const getBorrowRatio = ({ loan, property }) => {
  const loanValue = getLoanValue({ loan, property });
  const propAndWork = getPropAndWork({ loan, property });

  return loanValue / propAndWork;
};

export const getLenderCount = ({ loan, borrowers, property }) => {
  const incomeRatio = getIncomeRatio({ loan, borrowers, property });
  const borrowRatio = getBorrowRatio({ loan, property });
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

export const disableForms = ({ loan }) =>
  !!(
    loan.logic &&
    (loan.logic.step > 1 ||
      (loan.logic.verification &&
        (loan.logic.verification.requested ||
          loan.logic.verification.validated !== undefined)))
  );

export const getFees = ({ loan, property }) => {
  const notaryFees = property.value * constants.notaryFees;
  let insuranceFees = 0;

  if (loan.general.usageType === USAGE_TYPE.PRIMARY) {
    insuranceFees = loan.general.insuranceFortuneUsed * constants.lppFees;
  }

  return notaryFees + (insuranceFees || 0);
};

export const isLoanValid = ({ loan, borrowers, property }) => {
  const incomeRatio = getIncomeRatio({ loan, borrowers, property });
  const borrowRatio = getBorrowRatio({ loan, borrowers, property });
  const fees = getFees({ loan, property });
  const propAndWork = getPropAndWork({ loan, property });

  const cashRequired = constants.minCash * propAndWork + fees;

  if (incomeRatio > 0.38) {
    throw new Error('income');
  } else if (loan.general.fortuneUsed < cashRequired) {
    throw new Error('cash');
  } else if (borrowRatio > 0.8) {
    throw new Error('ownFunds');
  }

  return true;
};

export const getPropertyCompletion = ({ loan, borrowers, property }) => {
  const formsProgress = propertyPercent(loan, borrowers, property);
  const filesProgress = filesPercent(property, propertyDocuments, FILE_STEPS.AUCTION);

  return (formsProgress + filesProgress) / 2;
};
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

export const strategyDone = ({ loan, property }) => {
  const { general, logic } = loan;
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
    !loanStrategySuccess(
      general.loanTranches,
      getLoanValue({ loan, property }, true),
    )
  ) {
    return false;
  }

  return true;
};

// Gives the end time of an auction, given the start time
export const getAuctionEndTime = (startTime) => {
  const time = moment(startTime);

  if (time.isoWeekday() === 6) {
    // On saturdays, go to Tuesday
    time.add(3, 'd');
  } else if (time.isoWeekday() === 7) {
    // On saturdays, go to Tuesday
    time.add(2, 'd');
  } else if (time.hour() >= 0 && time.hour() < 7) {
    // If the start time is between midnight and 7:00,
    // set endtime to be tomorrow night
    time.add(1, 'd');
  } else {
    // Else, set endtime in 2 days from now
    time.add(2, 'd');
  }

  // Skip weekends
  if (time.isoWeekday() === 6 || time.isoWeekday() === 7) {
    // Saturday or Sunday
    time.add(2, 'd');
  }

  // Auctions always end at midnight
  time.hours(23);
  time.minutes(59);
  time.seconds(59);
  time.milliseconds(0);

  return time.toDate();
};

export const loanIsVerified = ({
  loan: { logic: { verification: { validated } } },
}) => {
  if (validated !== undefined) {
    return true;
  }

  return false;
};
