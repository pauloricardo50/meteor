import { Method } from '../methods/methods';

export const analyticsLogin = new Method({
  name: 'analyticsLogin',
  params: {
    trackingId: String,
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
});

export const analyticsVerifyEmail = new Method({
  name: 'analyticsVerifyEmail',
});
