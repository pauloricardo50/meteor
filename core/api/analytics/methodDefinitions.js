import { Method } from '../methods/methods';

export const analyticsIdentify = new Method({
  name: 'analyticsIdentify',
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
  },
});
