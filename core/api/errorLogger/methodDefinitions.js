import { Match } from 'meteor/check';

import { Method } from '../methods/methods';

export const logError = new Method({
  name: 'logError',
  doNotRefetchQueries: true,
  params: {
    error: Match.Any,
    additionalData: Match.Maybe(Match.Any),
    url: Match.Optional(String),
  },
});
