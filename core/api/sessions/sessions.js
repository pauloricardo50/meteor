import SessionSchema from './schemas/sessionSchema';
import { SESSIONS_COLLECTION } from './sessionConstants';
import { createCollection } from '../helpers/collectionHelpers';

const Sessions = createCollection(SESSIONS_COLLECTION);

Sessions.attachSchema(SessionSchema);
export default Sessions;
