import { Meteor } from 'meteor/meteor';

import React, { useEffect, useState } from 'react';
import Loadable from 'react-loadable';

import { logError } from '../api/errorLogger/methodDefinitions';
import LayoutError from '../components/ErrorBoundary/LayoutError';
import Loading from '../components/Loading';

const LoadableLoading = ({ error, pastDelay, loaderProps, serverSideName }) => {
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
    if (Meteor.isServer) {
      logError.run({
        error: JSON.parse(
          JSON.stringify(error, Object.getOwnPropertyNames(error)),
        ),
        additionalData: ['Loadable server-side error'],
        url: serverSideName,
      });
    }
    return <LayoutError error={error} />;
  }

  if (hasLoggedAnError) {
    setHasLoggedError(false);
  }

  if (pastDelay) {
    return <Loading {...loaderProps} />;
  }

  return null;
};

export default ({ loader, loaderProps, serverSideName, ...options }) =>
  Loadable({
    loading: props => (
      <LoadableLoading
        {...props}
        loaderProps={loaderProps}
        serverSideName={serverSideName}
      />
    ),
    delay: 200, // Hides the loading component for 200ms, to avoid flickering
    loader,
    ...options,
  });
