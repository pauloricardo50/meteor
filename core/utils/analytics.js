import { Meteor } from 'meteor/meteor';
// import { analytics } from 'meteor/okgrow:analytics';
import { storageAvailable } from './browserFunctions';

/**
 * allowTracking - Prevents tracking during tests and on a demo website
 *
 * @return {Boolean}
 */
export const allowTracking = () => {
  if (Meteor.isTest) {
    return false;
  }

  return true;
};

export const addUserTracking = (userId, metadata) => {
  if (!userId) {
    throw new Error('no tracking identification userId provided');
  }
  if (allowTracking()) {
    // analytics.identify(userId, metadata);
  }
};

const track = (eventName, metadata) => {
  if (!eventName) {
    throw new Error('no tracking eventName provided');
  }
  if (allowTracking()) {
    // analytics.track(eventName, metadata);
  }
};

export default track;

export const trackOncePerSession = (eventName, metadata) => {
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
