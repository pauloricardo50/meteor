import { Meteor } from 'meteor/meteor';
import throttle from 'lodash/throttle';
import { storageAvailable } from '../../utils/browserFunctions';
import { getEvent, getEventConfig } from './events';

// having this as a function enables us to test the `allowTracking`
// param of `makeClientAnalytics`
const isTestMode = () => Meteor.isTest || Meteor.isAppTest;

const validateParam = (eventName, paramName) => {
  if (!eventName) {
    throw new Error(`the tracking ${paramName} was not provided`);
  }
};

const validateEvent = (event, params) => {
  const { eventName } = getEventConfig(event, params);
  validateParam(eventName, 'eventName');
};

const limitEventOncePerSession = (event, params) => {
  const { trackOncePerSession } = getEvent(event);
  const { eventName } = getEventConfig(event, params);

  if (!trackOncePerSession) {
    return false;
  }

  if (!storageAvailable('sessionStorage')) {
    return false;
  }

  const localEventId = `epotek-tracking.${eventName}`;

  const hasAlreadyRunOnce = !!sessionStorage.getItem(localEventId);
  console.log('hasAlreadyRunOnce', hasAlreadyRunOnce);
  if (hasAlreadyRunOnce) {
    return true;
  }

  sessionStorage.setItem(localEventId, eventName);
  return false;
};

const makeThrottledTrackFunction = (
  trackFunction,
  event,
  throttledTrackFunctionsCache,
) => {
  const { throttle: timeToThrottle } = getEvent(event);

  if (!timeToThrottle) {
    return trackFunction;
  }

  // cache the throttled function so we return only once instance of it
  throttledTrackFunctionsCache[event] =
    throttledTrackFunctionsCache[event] ||
    throttle(trackFunction, timeToThrottle, { trailing: false });

  return throttledTrackFunctionsCache[event];
};

const makeLimitedOncePerSessionTrackFunction = (
  trackFunction,
  event,
  params,
) => () => {
  const isLimitedOncePerSession = limitEventOncePerSession(event, params);
  if (isLimitedOncePerSession) {
    return null;
  }

  return trackFunction();
};

/**
 * This is a factory of analytics modules
 *
 * @export
 * @param {Object} analytics The underlying analytics library used
 * @param {Object} allowTracking prevents tracking
 *                 (e.g.: during tests and on a demo website)
 *
 * @returns a wrapper module over okgrow analytics
 */
export const makeClientAnalytics = (
  okgrowAnalytics,
  allowTracking = !isTestMode(),
) => {
  const throttledTrackFunctionsCache = {};

  return {
    track: (event, params) => {
      validateEvent(event, params);

      if (!allowTracking) {
        return null;
      }

      const trackFunction = () => {
        const { eventName, metadata } = getEventConfig(event, params);
        okgrowAnalytics.track(eventName, metadata);
      };

      const performMaybePerSessionTrack = makeLimitedOncePerSessionTrackFunction(
        trackFunction,
        event,
        params,
      );

      const performMaybePerSessionOrThrottledTrack = makeThrottledTrackFunction(
        performMaybePerSessionTrack,
        event,
        throttledTrackFunctionsCache,
      );

      performMaybePerSessionOrThrottledTrack();
    },
  };
};
