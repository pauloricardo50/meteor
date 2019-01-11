import React from 'react';
import Loadable from 'react-loadable';
import { logError } from '../api/methods/index';
import Loading from '../components/Loading';

const LoadableLoading = ({ error, retry, pastDelay }) => {
  if (error) {
    logError.run({
      error: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))),
      additionalData: ['Loadable error'],
      url: window && window.location && window.location.href,
    });
    return (
      <div className="error">
        Error: {error.message} <button onClick={retry}>Retry</button>
      </div>
    );
  }
  if (pastDelay) {
    return <Loading />;
  }
  return null;
};

export default options =>
  Loadable({
    loading: LoadableLoading,
    delay: 200, // Hides the loading component for 200ms, to avoid flickering
    ...options,
  });
