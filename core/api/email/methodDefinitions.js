import { Method } from '../methods/methods';

export const subscribeToNewsletter = new Method({
  name: 'subscribeToNewsletter',
  params: { email: String },
});

export const unsubscribeFromNewsletter = new Method({
  name: 'unsubscribeFromNewsletter',
  params: { email: String },
});

export const updateMailchimpProfile = new Method({
  name: 'updateMailchimpProfile',
  params: { userId: String, status: String },
});
