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
  params: {
    trackingId: Match.Maybe(Match.OneOf(String, null)), // Can be optional if cookies are blocked
  },
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
    trackingId: Match.Maybe(Match.OneOf(String, null)),
    lastPageTitle: Match.Maybe(String),
    lastPagePath: Match.Maybe(String),
    lastPageMicroservice: Match.Maybe(String),
  },
  doNotRefetchQueries: true,
});
