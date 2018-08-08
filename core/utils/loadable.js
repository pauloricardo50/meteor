import React from 'react';
import Loadable from 'react-loadable';
import Loading from '../components/Loading';

const LoadableLoading = ({ error, retry, pastDelay }) => {
  if (error) {
    return (
      <div>
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
