import { Method } from '../methods/methods';

export const sessionInsert = new Method({
  name: 'sessionInsert',
  params: {
    session: Object,
  },
});

export const sessionRemove = new Method({
  name: 'sessionRemove',
  params: {
    sessionId: String,
  },
});

export const sessionUpdate = new Method({
  name: 'sessionUpdate',
  params: {
    sessionId: String,
    object: Object,
  },
});
