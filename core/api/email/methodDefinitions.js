import { Method } from '../methods/methods';

export const subscribeToNewsletter = new Method({
  name: 'subscribeToNewsletter',
  params: { email: String },
});
