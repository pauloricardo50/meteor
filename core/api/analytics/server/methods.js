import LoanService from '../../loans/server/LoanService';
import SecurityService from '../../security';
import {
  analyticsCTA,
  analyticsLogin,
  analyticsOnboardingStep,
  analyticsOpenedIntercom,
  analyticsPage,
  analyticsStartedOnboarding,
  analyticsVerifyEmail,
} from '../methodDefinitions';

// All these analytics methods are used to trigger analytics listeners
analyticsLogin.setHandler(() => {});

analyticsPage.setHandler(() => {});

analyticsVerifyEmail.setHandler(() => {});

analyticsCTA.setHandler(() => {});

analyticsOpenedIntercom.setHandler(() => {});

analyticsOnboardingStep.setHandler(() => {});

analyticsStartedOnboarding.setHandler((context, { loanId }) => {
  const { userId } = context;
  SecurityService.loans.isAllowedToUpdate(loanId, userId);
  LoanService.startedOnboarding({ loanId });
});
