import { Meteor } from 'meteor/meteor';

import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { TRACKING_COOKIE } from '../api/analytics/analyticsConstants';
import { analyticsOpenedIntercom } from '../api/analytics/methodDefinitions';
import {
  getIntercomSettings,
  updateIntercomVisitorTrackingId,
} from '../api/intercom/methodDefinitions';
import { parseCookies } from '../utils/cookiesHelpers';
import useCurrentUser from './useCurrentUser';
import usePrevious from './usePrevious';

const defaultSettings = {
  alignment: 'right',
  horizontal_padding: 16,
  vertical_padding: 16,
};

// This is exported as a convenience API
export const IntercomAPI = (method, ...args) => {
  if (window.Intercom) {
    window.Intercom.apply(null, [method, args]);
  } else {
    console.warn('Intercom not initialized yet');
  }
};

const getTrackingIds = () => {
  const visitorId = window?.Intercom?.('getVisitorId');
  const cookies = parseCookies();
  const trackingId = cookies?.[TRACKING_COOKIE];
  const intercomId = Object.keys(cookies).reduce(
    (id, cookie) => (cookie.match(/intercom-id/g) ? cookies[cookie] : id),
    undefined,
  );

  return { visitorId, trackingId, intercomId };
};

const getIntercomUserSettings = async () => {
  const intercomSettings = await getIntercomSettings.run({});
  return { ...defaultSettings, ...intercomSettings };
};

const initializeIntercom = async history => {
  const intercomSettings = await getIntercomUserSettings();

  window.intercomSettings = intercomSettings;
  const { app_id } = intercomSettings;

  const w = window;
  const ic = w.Intercom;
  if (typeof ic === 'function') {
    ic('reattach_activator');
    ic('update', w.intercomSettings);
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
        updateIntercomVisitorTrackingId.run(getTrackingIds());
        window?.Intercom?.('trackEvent', 'last-page', {
          title: document?.title,
          pathname: history?.location?.pathname,
          microservice: Meteor.microservice,
        });

        window?.Intercom?.('onShow', function () {
          updateIntercomVisitorTrackingId.run(getTrackingIds());
          analyticsOpenedIntercom.run({
            lastPageTitle: document?.title,
            lastPagePath: history?.location?.pathname,
            lastPageMicroservice: Meteor.microservice,
          });
        });
      });
    };
    if (document.readyState === 'complete') {
      l();
    } else if (w.attachEvent) {
      w.attachEvent('onload', l);
    } else {
      w.addEventListener('load', l, false);
    }
  }
};

const useIntercom = () => {
  const history = useHistory();
  // Initialization
  useEffect(() => {
    initializeIntercom(history);

    return () => {
      IntercomAPI('shutdown');
      delete window.Intercom;
      delete window.intercomSettings;
    };
  });

  const currentUser = useCurrentUser();

  const previousUserId = usePrevious(currentUser?._id);

  useEffect(() => {
    if (previousUserId && !currentUser?._id) {
      // If the user was previously logged in, and logged out, shut down and start over
      IntercomAPI('shutdown');
      // const intercomSettings = getIntercomUserSettings();
      IntercomAPI('boot');
    } else if (Meteor.userId) {
      // If the user was not logged in, just call 'update' to let Intercom know
      IntercomAPI('update');
    }
  }, [currentUser?._id]);

  return null;
};

export default useIntercom;
