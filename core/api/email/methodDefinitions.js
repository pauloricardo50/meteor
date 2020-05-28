import { Method } from '../methods/methods';

export const subscribeToNewsletter = new Method({
  name: 'subscribeToNewsletter',
  params: { email: String },
});

export const unsubscribeFromNewsletter = new Method({
  name: 'unsubscribeFromNewsletter',
  params: { email: String },
});

export const updateNewsletterProfile = new Method({
  name: 'updateNewsletterProfile',
  params: { userId: String, status: String },
});
