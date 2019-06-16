import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import { liveSyncs } from '../liveSync';

exposeQuery({
  query: liveSyncs,
  overrides: {
    validateParams: { userId: Match.Maybe(Match.OneOf(String, Boolean)) },
  },
});
