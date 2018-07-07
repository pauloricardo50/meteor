// Here we have all the factory methods. They help on creating different
// familties of analytics modules (client and server)
import { Meteor } from 'meteor/meteor';
import { storageAvailable } from './browserFunctions';

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

/** This allows us to create a custom method but with an enforced behaviour
 *  Prevents repeating the enforcement code (such as `validateArgs`
 *  or allowTracking) when creating another factory, such as one for
 *  server side analytics.
 */
const makeTrackFunction = analyticsModule => analyticsCallee => (...args) => ({
  validateArgs = () => {},
  transformArgs = (...argsToTransform) => [argsToTransform],
  allowTracking,
}) => {
  validateArgs(args);

  if (allowTracking) {
    const calleeArgs = transformArgs(args);
    return analyticsModule[analyticsCallee](...calleeArgs);
  }
};

// This is an example of creating a repeating function in multiple factories,
// without actually repeating the code for its creation
const makeIdentify = (analyticsModule, allowTracking) =>
  makeTrackFunction(analyticsModule)('identify')('userId')({
    validateArgs: (userId) => {
      if (!userId) {
        throw new Error('no userId provided for identifing the user');
      }
    },
    allowTracking,
  });

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
  analyticsModule,
  allowTracking = Meteor.isTest || Meteor.isAppTest,
) => ({
  identify: makeIdentify(analyticsModule, allowTracking),

  track: makeTrackFunction(analyticsModule)('track')('eventName', 'metadata')({
    validateArgs: (eventName) => {
      if (!eventName) {
        throw new Error('no tracking eventName provided');
      }
    },
    allowTracking,
  }),
});

export const makeServerAnalytics = (
  analyticsModule,
  allowTracking = Meteor.isTest || Meteor.isAppTest,
) => ({
  identify: makeIdentify(analyticsModule, allowTracking),

  track: makeTrackFunction(analyticsModule)('track')(
    'userId',
    'eventName',
    'properties',
  )({
    validateArgs: (userId, eventName) => {
      [userId, eventName].forEach((argument) => {
        if (!argument) {
          throw new Error(`no tracking ${argument} provided`);
        }
      });
    },
    allowTracking,
  }),
});
