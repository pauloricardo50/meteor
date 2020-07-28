import { TRACKING_COOKIE } from 'core/api/analytics/analyticsConstants';
import { getCookie } from 'core/utils/cookiesHelpers';

import { meteorClient } from './meteorClient';

const callMethod = (method, params) =>
  meteorClient.call(method, params, {
    trackingId: () => getCookie(TRACKING_COOKIE),
    location: window
      ? {
          href: window.location.href,
          host: window.location.host,
          pathname: window.location.pathname,
        }
      : undefined,
  });

export default callMethod;
