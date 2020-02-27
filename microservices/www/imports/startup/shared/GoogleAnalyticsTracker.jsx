import { Meteor } from 'meteor/meteor';

import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const GoogleAnalyticsTracker = props => {
  const history = useHistory();
  useEffect(() => {
    let unlisten;
    if (Meteor.isClient) {
      unlisten = history.listen(location => {
        if (window.gtag) {
          window.gtag('config', window.GA_TAG, {
            page_path: location.pathname + location.search,
          });
        }
      });
    }

    return () => unlisten && unlisten();
  }, []);

  return props.children;
};

export default GoogleAnalyticsTracker;
