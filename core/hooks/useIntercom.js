import { useEffect } from 'react';

import usePrevious from './usePrevious';

const APP_ID = 'fzxlw28z';

// This is exported as a convenience API
export const IntercomAPI = (method, ...args) => {
  if (window.Intercom) {
    window.Intercom.apply(null, [method, args]);
  } else {
    console.warn('Intercom not initialized yet');
  }
};

const initializeIntercom = () => {
  const w = window;
  const ic = w.Intercom;
  if (typeof ic === 'function') {
    ic('reattach_activator');
    ic('update', w.intercomSettings);
  } else {
    const d = document;
    var i = function() {
      i.c(arguments);
    };
    i.q = [];
    i.c = function(args) {
      i.q.push(args);
    };
    w.Intercom = i;
    const l = function() {
      const s = d.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = `https://widget.intercom.io/widget/${APP_ID}`;
      const x = d.getElementsByTagName('script')[0];
      x.parentNode && x.parentNode.insertBefore(s, x);
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

const defaultSettings = {
  app_id: APP_ID,
  alignment: 'right',
  horizontal_padding: 16,
  vertical_padding: 16,
};

const useItercom = ({ userId, email } = {}) => {
  const intercomSettings = {
    ...defaultSettings,
    email,
    user_id: userId,
  };
  window.intercomSettings = intercomSettings;

  // Initialization
  useEffect(() => {
    initializeIntercom();

    return () => {
      IntercomAPI('shutdown');
      delete window.Intercom;
      delete window.intercomSettings;
    };
  }, []);

  const previousUserId = usePrevious(userId);

  useEffect(() => {
    if (previousUserId && !userId) {
      // If the user was previously logged in, and logged out, shut down and start over
      IntercomAPI('shutdown');
      IntercomAPI('boot', intercomSettings);
    } else if (userId) {
      // If the user was not logged in, just call 'update' to let Intercom know
      IntercomAPI('update');
    }
  }, [userId]);

  return null;
};

export default useItercom;
