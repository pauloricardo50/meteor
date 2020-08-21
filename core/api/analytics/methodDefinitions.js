import { Match } from 'meteor/check';

import { Method } from '../methods/methods';

export const analyticsLogin = new Method({
  name: 'analyticsLogin',
  doNotRefetchQueries: true,
  params: {
    loginType: String,
  },
  hideClientError: true,
});

export const analyticsPage = new Method({
  name: 'analyticsPage',
  params: {
    cookies: Object,
    sessionStorage: Object,
    path: String,
    route: String,
    queryParams: Object,
    queryString: Object,
    microservice: String,
  },
  doNotRefetchQueries: true,
  hideClientError: true,
});

export const analyticsVerifyEmail = new Method({
  name: 'analyticsVerifyEmail',
  doNotRefetchQueries: true,
  hideClientError: true,
});

export const analyticsCTA = new Method({
  name: 'analyticsCTA',
  params: {
    cookies: Object,
    name: String,
    path: String,
    route: String,
    toPath: Match.Maybe(String),
  },
  doNotRefetchQueries: true,
  hideClientError: true,
});

export const analyticsOpenedIntercom = new Method({
  name: 'analyticsOpenedIntercom',
  params: {
    lastPageTitle: Match.Maybe(String),
    lastPagePath: Match.Maybe(String),
    lastPageMicroservice: Match.Maybe(String),
  },
  doNotRefetchQueries: true,
});

// Triggered when a user lands on a step
export const analyticsOnboardingStep = new Method({
  name: 'analyticsOnboardingStep',
  params: {
    loanId: String,
    activeStep: String,
    // If undefined, it means that:
    // - It is the very first step
    // - User came back to continue its onboarding in a new session
    latestStep: Match.Maybe(String),
    currentTodoStep: String,
    // If undefined, it means that it is the very last step
    nextStep: Match.Maybe(String),
  },
});
