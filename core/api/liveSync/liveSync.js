import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

const LiveSync = new Mongo.Collection('liveSync');
const STALE_LIVE_SYNC_MS = 2 * 60 * 1000;

Meteor.methods({
  liveSyncStart() {
    LiveSync.upsert({ userId: this.userId }, { userId: this.userId });
  },
  liveSyncStop() {
    LiveSync.remove({ userId: this.userId });
  },
  liveSyncUpdate(options) {
    check(options, String);
    LiveSync.update(
      { userId: this.userId },
      { $set: { options, updatedAt: new Date() } },
    );
  },
  liveSyncClear() {
    const now = new Date();
    LiveSync.remove({
      updatedAt: { $lt: new Date(now.getTime() - STALE_LIVE_SYNC_MS) },
    });
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
