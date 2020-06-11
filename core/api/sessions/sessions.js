import { createCollection } from '../helpers/collectionHelpers';
import SessionSchema from './schemas/sessionSchema';
import { SESSIONS_COLLECTION } from './sessionConstants';

const Sessions = createCollection(SESSIONS_COLLECTION);

Sessions.attachSchema(SessionSchema);
export default Sessions;
