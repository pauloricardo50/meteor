import { Method } from '../methods/methods';

export const analyticsLogin = new Method({
  name: 'analyticsLogin',
  doNotRefetchQueries: true,
  params: {
    type: String,
  },
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
  },
  doNotRefetchQueries: true,
});

export const analyticsVerifyEmail = new Method({
  name: 'analyticsVerifyEmail',
  params: {
    trackingId: String,
  },
  doNotRefetchQueries: true,
});

export const analyticsCTA = new Method({
  name: 'analyticsCTA',
  params: {
    name: String,
    cookies: Object,
    sessionStorage: Object,
    path: String,
    route: String,
    queryParams: Object,
    queryString: Object,
  },
  doNotRefetchQueries: true,
});
