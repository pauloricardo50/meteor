import { Meteor } from 'meteor/meteor';

import { useEffect } from 'react';

import {
  getIntercomSettings,
  updateIntercomVisitorTrackingId,
} from '../api/intercom/methodDefinitions';
import { parseCookies } from '../utils/cookiesHelpers';
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

const getIntercomUserSettings = async () => {
  const intercomSettings = await getIntercomSettings.run({});
  return { ...defaultSettings, ...intercomSettings };
};

const initializeIntercom = async () => {
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
        window.Intercom('onShow', function () {
          const visitorId = window.Intercom('getVisitorId');
          const cookies = parseCookies();
          updateIntercomVisitorTrackingId.run({ visitorId, cookies });
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
  // Initialization
  useEffect(() => {
    initializeIntercom();

    return () => {
      IntercomAPI('shutdown');
      delete window.Intercom;
      delete window.intercomSettings;
    };
  }, []);

  const previousUserId = usePrevious(Meteor.userId);

  useEffect(() => {
    if (previousUserId && !Meteor.userId) {
      // If the user was previously logged in, and logged out, shut down and start over
      IntercomAPI('shutdown');
      const intercomSettings = getIntercomUserSettings();
      IntercomAPI('boot', intercomSettings);
    } else if (Meteor.userId) {
      // If the user was not logged in, just call 'update' to let Intercom know
      IntercomAPI('update');
    }
  }, [Meteor.userId]);

  return null;
};

export default useIntercom;
