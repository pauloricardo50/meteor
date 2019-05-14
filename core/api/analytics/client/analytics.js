// import { analytics } from 'meteor/okgrow:analytics';

import { makeClientAnalytics } from '../factories';

export { default as EVENTS } from '../events';
export * from '../events';
export * from '../eventsHelpers';

export default makeClientAnalytics(null);
