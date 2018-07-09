// Here we have all the factory methods. They help on creating different
// familties of analytics modules (client and server)
import { Meteor } from 'meteor/meteor';
import { storageAvailable } from '../../utils/browserFunctions';

// having this as a function enables us to test the `allowTracking`
// param of `makeClientAnalytics`
const isTestMode = () => Meteor.isTest || Meteor.isAppTest;

const trackOncePerSession = (eventName, metadata) => {
  const localId = `epotek-tracking.${eventName}`;

  // Make sure we can use sessionStorage
  if (storageAvailable('sessionStorage')) {
    const localTracked = sessionStorage.getItem(localId);

    if (!localTracked) {
      // If this id has never been tracked in localStorage, track
      track(eventName, metadata);
      sessionStorage.setItem(localId, eventName);
    } else {
      return false;
    }
  }
};

const validateParam = (eventName, paramName) => {
  if (!eventName) {
    throw new Error(`the tracking ${paramName} was not provided`);
  }
};

/**
 * This is a factory of analytics modules
 *
 * @export
 * @param {Object} analytics The underlying analytics library used
 * @param {Object} allowTracking prevents tracking
 *                 (e.g.: during tests and on a demo website)
 *
 * @returns an analytics module
 */
export const makeClientAnalytics = (
  okgrowAnalytics,
  allowTracking = !isTestMode(),
) => ({
  track: (eventName, metadata) => {
    validateParam(eventName, 'eventName');

    if (!allowTracking) {
      return null;
    }

    okgrowAnalytics.track(eventName, metadata);
  },
});

export const makeServerAnalytics = (
  analyticsNode,
  allowTracking = !isTestMode(),
) => ({
  identify: (traits) => {
    validateParam(Meteor.userId(), 'Meteor.userId()');

    if (allowTracking) {
      analyticsNode.identify(Meteor.userId(), traits);
    }
  },

  track: (eventName, metadata) => {
    validateParam(Meteor.userId(), 'Meteor.userId()');
    validateParam(eventName, 'eventName');

    if (allowTracking) {
      analyticsNode.track(Meteor.userId(), eventName, metadata);
    }
  },
});
