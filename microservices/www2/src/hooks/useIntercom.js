import { useEffect } from 'react';
import { useLocation } from '@reach/router';

import { parseCookies } from 'core/utils/cookiesHelpers';

import callMethod from '../utils/meteorClient/callMethod';

const defaultSettings = {
  alignment: 'right',
  horizontal_padding: 16,
  vertical_padding: 16,
};

// This is exported as a convenience API
export const IntercomAPI = (method, ...args) => {
  if (window?.Intercom) {
    window?.Intercom?.apply(null, [method, args]);
  } else {
    console.warn('Intercom not initialized yet');
  }
};

const getTrackingIds = () => {
  const visitorId = window?.Intercom?.('getVisitorId') || null; // Make sure visitorId and intercomId are always passed to avoid Match Failed error
  const cookies = parseCookies();
  const intercomId =
    Object.keys(cookies).reduce(
      (id, cookie) => (cookie.match(/intercom-id/g) ? cookies[cookie] : id),
      undefined,
    ) || null;

  return { visitorId, intercomId };
};

const getIntercomUserSettings = async () => {
  const intercomSettings = await callMethod('getIntercomSettings', {});
  return { ...defaultSettings, ...intercomSettings };
};

const initializeIntercom = async location => {
  const intercomSettings = await getIntercomUserSettings();

  window.intercomSettings = intercomSettings;
  const { app_id } = intercomSettings || {};

  const w = window;
  const ic = w.Intercom;
  if (typeof ic === 'function') {
    ic('reattach_activator');
    ic('update', w?.intercomSettings);
  } else {
    const d = document;
    var i = function () {
      i.c(arguments);
    };
    i.q = [];
    i.c = function (args) {
      i.q.push(args);
    };
    w.Intercom = i;
    const l = function () {
      const s = d.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = `https://widget.intercom.io/widget/${app_id}`;
      const x = d.getElementsByTagName('script')[0];
      x.parentNode && x.parentNode.insertBefore(s, x);

      s.addEventListener('load', function () {
        callMethod('updateIntercomVisitorTrackingId', getTrackingIds());
        window?.Intercom?.('trackEvent', 'last-page', {
          title: document?.title,
          pathname: location?.pathname,
          microservice: 'www',
        });

        window?.Intercom?.('onShow', function () {
          callMethod('updateIntercomVisitorTrackingId', getTrackingIds());
          callMethod('analyticsOpenedIntercom', {
            lastPageTitle: document?.title,
            lastPagePath: location?.pathname,
            lastPageMicroservice: 'www',
          });
        });
      });
    };
    if (document.readyState === 'complete') {
      l();
    } else if (w?.attachEvent) {
      w?.attachEvent('onload', l);
    } else {
      w?.addEventListener('load', l, false);
    }
  }
};

const useIntercom = () => {
  const location = useLocation();
  // Initialization
  useEffect(() => {
    initializeIntercom(location);

    return () => {
      IntercomAPI('shutdown');
      delete window?.Intercom;
      delete window?.intercomSettings;
    };
  });

  useEffect(() => {
    IntercomAPI('shutdown');
    IntercomAPI('boot');
  }, []);

  return null;
};

export default useIntercom;
