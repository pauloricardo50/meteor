import { Method } from '../methods/methods';

export const analyticsIdentify = new Method({
  name: 'analyticsIdentify',
  params: {
    trackingId: String,
  },
});
