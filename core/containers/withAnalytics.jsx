import React from 'react';
import { branch, lifecycle, withProps } from 'recompose';
import analytics, { getEvent } from '../api/analytics/client/analytics';

const withFunctionAnalytics = event =>
  withProps((props) => {
    const { func } = getEvent(event);
    const { [func]: functionToTrack } = props;

    const trackedFunction = (...args) => {
      // here you can track later and run the tracked function first if you want
      analytics.track(event, ...args);

      return functionToTrack(...args);
    };

    return { [func]: trackedFunction };
  });

withProps(() => {
  const { func } = getEvent(event);
  const { [func]: functionToTrack } = props;

  const trackedFunction = (...args) => {
    // here you can track later and run the tracked function first if you want
    analytics.track(event, ...args);

    return functionToTrack(...args);
  };

  const trackedProps = { ...props, [func]: trackedFunction };
});

const withLifecycleAnalytics = (event) => {
  const { lifecycleMethod } = getEvent(event);

  return branch(
    () => !!lifecycleMethod,
    lifecycle({
      [lifecycleMethod]() {
        analytics.track(event, this.props);
      },
    }),
  );
};

const withAnalytics = (event) => {
  const { func } = getEvent(event);

  return func ? withFunctionAnalytics(event) : withLifecycleAnalytics(event);
};

export default withAnalytics;
