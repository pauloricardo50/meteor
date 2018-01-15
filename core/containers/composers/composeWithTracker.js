import { compose } from 'react-komposer';
import { Tracker } from 'meteor/tracker';

const getTrackerLoader = loaderFunc => (props, onData, env) => {
  let trackerCleanup = () => null;

  const handler = Tracker.nonreactive(() =>
    Tracker.autorun(() => {
      // Store clean-up function if provided.
      trackerCleanup = loaderFunc(props, onData, env) || (() => null);
    }));

  return () => {
    trackerCleanup();
    return handler.stop();
  };
};

const composeWithTracker = (loadFunc, options) => component => compose(getTrackerLoader(loadFunc), options)(component);

export default composeWithTracker;
