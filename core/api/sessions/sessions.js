import { Mongo } from 'meteor/mongo';

import SessionSchema from './schemas/sessionSchema';
import { SESSIONS_COLLECTION } from './sessionConstants';

const Sessions = new Mongo.Collection(SESSIONS_COLLECTION);

Sessions.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Sessions.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Sessions.attachSchema(SessionSchema);
export default Sessions;
