import { Meteor } from 'meteor/meteor';
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

const throttleEvent = (event, throttledEvents) => {
  const { throttle: timeToThrottle } = getEvent(event);

  if (!timeToThrottle) {
    return false;
  }

  // if there's no throttle set or the throttle expited,
  // start over with the throttling
  const throttleIsActive =
    throttledEvents[event] &&
    Date.now() - throttledEvents[event] <= timeToThrottle;

  if (!throttleIsActive) {
    throttledEvents[event] = Date.now();
    return false;
  }

  return true;
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
  if (hasAlreadyRunOnce) {
    return true;
  }

  sessionStorage.setItem(localEventId, eventName);
  return false;
};

const limitEventTracking = (event, { throttledEvents, params }) => {
  const isLimitedByThrottling = throttleEvent(event, throttledEvents);
  const isLimitedOncePerSession = limitEventOncePerSession(event, params);

  return isLimitedByThrottling || isLimitedOncePerSession;
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
  const throttledEvents = {};

  return {
    track: (event, params) => {
      validateEvent(event, params);

      if (!allowTracking) {
        return null;
      }

      const isLimited = limitEventTracking(event, { throttledEvents, params });
      if (isLimited) {
        return null;
      }

      const { eventName, metadata } = getEventConfig(event, params);
      okgrowAnalytics.track(eventName, metadata);
    },
  };
};
