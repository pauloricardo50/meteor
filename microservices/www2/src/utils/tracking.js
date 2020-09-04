import { useEffect } from 'react';

import { TRACKING_COOKIE } from 'core/api/analytics/analyticsConstants';
import { getCookie, parseCookies, setCookie } from 'core/utils/cookiesHelpers';

import { uuidv4 } from '../../../../core/utils/general';
import callMethod from './meteorClient/callMethod';

const getCurrentBrowserPosition = () => {
  const { sessionStorage } = window;
  const { pathname, search } = window.location;
  const searchParams = new URLSearchParams(search);
  const cookies = parseCookies();
  const queryString = {};

  if (searchParams) {
    const params = new URLSearchParams(searchParams);
    [...params.entries()].forEach(([key, value]) => {
      queryString[key] = value;
    });
  }

  return {
    cookies,
    sessionStorage,
    path: pathname,
    queryParams: {},
    queryString,
  };
};

const trackPage = pageTrackingId => {
  callMethod('analyticsPage', {
    ...getCurrentBrowserPosition(),
    route: pageTrackingId,
    microservice: 'www',
  });
};

const initTracking = () => {
  const trackingId = getCookie(TRACKING_COOKIE);
  if (!trackingId) {
    const randomId = uuidv4();
    setCookie(TRACKING_COOKIE, randomId);
  }
};

export const useTracking = pageTrackingId => {
  useEffect(() => {
    initTracking();
  }, []);

  useEffect(() => {
    if (pageTrackingId) {
      trackPage(pageTrackingId);
    }
  }, [pageTrackingId]);
};

export const trackCTA = ({ buttonTrackingId, toPath, pageTrackingId }) => {
  const { path } = getCurrentBrowserPosition();
  callMethod('analyticsCTA', {
    name: buttonTrackingId,
    path,
    route: pageTrackingId,
    toPath,
  });
};
