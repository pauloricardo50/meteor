import { LOCAL_STORAGE_ANONYMOUS_LOAN } from 'core/api/loans/loanConstants';
import { anonymousLoanInsert } from 'core/api/loans/methodDefinitions';
import { LOCAL_STORAGE_REFERRAL } from 'core/api/users/userConstants';

import { steps } from './onboardingSteps';

export const getSteps = loan =>
  steps.filter(({ condition }) => condition(loan));

export const insertAnonymousLoan = purchaseType =>
  anonymousLoanInsert
    .run({
      referralId: localStorage.getItem(LOCAL_STORAGE_REFERRAL) || undefined,
      existingAnonymousLoanId: localStorage.getItem(
        LOCAL_STORAGE_ANONYMOUS_LOAN,
      ),
      purchaseType,
    })
    .then(loanId => {
      localStorage.setItem(LOCAL_STORAGE_ANONYMOUS_LOAN, loanId);
      return loanId;
    });
