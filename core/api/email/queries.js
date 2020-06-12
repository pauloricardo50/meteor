import { createQuery } from 'meteor/cultofcoders:grapher';

import { EMAIL_QUERIES } from './emailConstants';

export const recentNewsletters = createQuery(
  EMAIL_QUERIES.RECENT_NEWSLETTERS,
  () => {},
);
