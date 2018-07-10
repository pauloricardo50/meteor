import React from 'react';
import { branch, lifecycle } from 'recompose';
import analytics from '../api/analytics/client/analytics';

const withFunctionAnalytics = ({
  func,
  track,
}) => WrappedComponent => (props) => {
  const { [func]: functionToTrack } = props;

  const trackedFunction = (...args) => {
    // here you can track later and run the tracked function first if you want
    const { eventName, metadata } = track(...args);
    analytics.track(eventName, metadata);

    return functionToTrack(...args);
  };

  const trackedProps = { ...props, [func]: trackedFunction };
  return <WrappedComponent {...trackedProps} />;
};

const withLifecycleAnalytics = ({ lifecycleMethod, track }) =>
  branch(
    () => !!lifecycleMethod,
    lifecycle({
      [lifecycleMethod]: () => {
        const { eventName, metadata } = track();
        analytics.track(eventName, metadata);
      },
    }),
  );

const withAnalytics = analyticsArgs =>
  (analyticsArgs.func
    ? withFunctionAnalytics(analyticsArgs)
    : withLifecycleAnalytics(analyticsArgs));

export default withAnalytics;
