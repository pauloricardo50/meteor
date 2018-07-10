import { analytics } from 'meteor/okgrow:analytics';

import { makeClientAnalytics } from '../factories';

export { default as EVENTS } from '../events';
export * from '../events';

export default makeClientAnalytics(analytics);
