import SimpleSchema from 'simpl-schema';

import { createCollection } from '../../helpers/collectionHelpers';
import { createdAt, updatedAt } from '../../helpers/sharedSchemas';
import { UPDATE_WATCHERS_COLLECTION } from '../updateWatcherConstants';

const UpdateWatchers = createCollection(UPDATE_WATCHERS_COLLECTION);

const UpdateWatcherSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  collection: String,
  docId: String,
  userId: { type: String, optional: true },
  updatedFields: { type: Array, defaultValue: [] },
  'updatedFields.$': { type: Object, blackbox: true },
});

UpdateWatchers.attachSchema(UpdateWatcherSchema);

export default UpdateWatchers;
