import {
  ACQUISITION_STATUS,
  LOCAL_STORAGE_ANONYMOUS_LOAN,
} from 'core/api/loans/loanConstants';
import { anonymousLoanInsert } from 'core/api/loans/methodDefinitions';
import { LOCAL_STORAGE_REFERRAL } from 'core/api/users/userConstants';

import { isProFlow, isRefinancing, steps } from './onboardingSteps';

export const ONBOARDING_FLOWS = {
  ACQUISITION_SEARCH: 'ACQUISITION_SEARCH',
  ACQUISITION_IDENTIFIED: 'ACQUISITION_IDENTIFIED',
  PRO_OR_PROMO: 'PRO_OR_PROMO',
  REFINANCING: 'REFINANCING',
};

export const getSteps = loan =>
  steps.filter(({ condition }) => condition(loan));

export const insertAnonymousLoan = ({ purchaseType, proPropertyId }) =>
  anonymousLoanInsert
    .run({
      referralId: localStorage.getItem(LOCAL_STORAGE_REFERRAL) || undefined,
      existingAnonymousLoanId: localStorage.getItem(
        LOCAL_STORAGE_ANONYMOUS_LOAN,
      ),
      purchaseType,
      proPropertyId,
    })
    .then(loanId => {
      localStorage.setItem(LOCAL_STORAGE_ANONYMOUS_LOAN, loanId);
      return loanId;
    });

export const getOnBoardingFlow = loan => {
  if (isProFlow(loan)) {
    return ONBOARDING_FLOWS.PRO_OR_PROMO;
  }
  if (isRefinancing(loan)) {
    return ONBOARDING_FLOWS.REFINANCING;
  }

  if (loan.acquisitionStatus === ACQUISITION_STATUS.SEARCHING) {
    return ONBOARDING_FLOWS.ACQUISITION_SEARCH;
  }

  return ONBOARDING_FLOWS.ACQUISITION_IDENTIFIED;
};
