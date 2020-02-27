import { Meteor } from 'meteor/meteor';

import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const GoogleAnalyticsTracker = props => {
  const history = useHistory();
  useEffect(() => {
    let unlisten;
    if (Meteor.isClient) {
      unlisten = history.listen(location => {
        if (window.ga) {
          window.ga('set', 'page', location.pathname + location.search);
          window.ga('send', 'pageview');
        }
      });
    }

    return () => unlisten && unlisten();
  }, []);

  return props.children;
};

export default GoogleAnalyticsTracker;
