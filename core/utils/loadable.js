import React, { useEffect, useState } from 'react';
import Loadable from 'react-loadable';

import { logError } from '../api/slack/methodDefinitions';
import LayoutError from '../components/ErrorBoundary/LayoutError';
import Loading from '../components/Loading';

const LoadableLoading = ({ error, retry, pastDelay }) => {
  const [hasLoggedAnError, setHasLoggedError] = useState(false);
  useEffect(() => {
    if (error && !hasLoggedAnError) {
      setHasLoggedError(true);
      logError.run({
        error: JSON.parse(
          JSON.stringify(error, Object.getOwnPropertyNames(error)),
        ),
        additionalData: ['Loadable error'],
        url:
          window && window.location && window.location.href
            ? window.location.href
            : '',
      });
    }
  }, [error, hasLoggedAnError]);

  if (error) {
    return <LayoutError error={error} />;
  }

  if (hasLoggedAnError) {
    setHasLoggedError(false);
  }

  if (pastDelay) {
    return <Loading />;
  }

  return null;
};

export default ({ loader, ...options }) =>
  Loadable({
    loading: LoadableLoading,
    delay: 200, // Hides the loading component for 200ms, to avoid flickering
    loader,
    ...options,
  });
