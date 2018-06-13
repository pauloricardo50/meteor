import { Method } from '../methods/methods';

export const notifyAdmin = new Method({
  name: 'notifyAdmin',
  params: {
    title: String,
    message: String,
  },
});
