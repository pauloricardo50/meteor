import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

const LiveSync = new Mongo.Collection('liveSync');

Meteor.methods({
  liveSyncStart() {
    LiveSync.upsert({ userId: this.userId }, { userId: this.userId });
  },
  liveSyncStop() {
    LiveSync.remove({ userId: this.userId });
  },
  liveSyncUpdate(options) {
    check(options, String);
    LiveSync.update({ userId: this.userId }, { $set: { options } });
  },
});

export const liveSyncs = LiveSync.createQuery('liveSyncs', {
  $filter({ filters, params: { userId } }) {
    if (userId) {
      filters.userId = userId;
    }
  },
  userId: 1,
  options: 1,
});

export default LiveSync;
