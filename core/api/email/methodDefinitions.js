import { Match } from 'meteor/check';

import { Method } from '../methods/methods';

export const subscribeToNewsletter = new Method({
  name: 'subscribeToNewsletter',
  params: { email: String, trackingId: Match.Maybe(Match.OneOf(String, null)) },
});

export const unsubscribeFromNewsletter = new Method({
  name: 'unsubscribeFromNewsletter',
  params: { email: String },
});

export const updateNewsletterProfile = new Method({
  name: 'updateNewsletterProfile',
  params: { userId: String, status: String },
});
