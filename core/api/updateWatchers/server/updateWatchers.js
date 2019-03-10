import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import SimpleSchema from 'simpl-schema';

import { createdAt, updatedAt } from '../../helpers/sharedSchemas';
import { UPDATE_WATCHERS_COLLECTION } from '../updateWatcherConstants';

const UpdateWatchers = new Mongo.Collection(UPDATE_WATCHERS_COLLECTION);

UpdateWatchers.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

UpdateWatchers.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

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

Meteor.startup(() => {
  UpdateWatchers._ensureIndex({ docId: 1, collection: 1 });
  UpdateWatchers._ensureIndex({ updatedAt: -1 });
});

export default UpdateWatchers;
