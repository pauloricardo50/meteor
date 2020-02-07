import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import SecurityService from '../../security';
import LiveSync from '../liveSync';

const STALE_LIVE_SYNC_MS = 2 * 60 * 1000;

Meteor.methods({
  liveSyncStart() {
    SecurityService.checkUserIsAdmin(this.userId);
    LiveSync.upsert({ userId: this.userId }, { userId: this.userId });
  },
  liveSyncStop() {
    SecurityService.checkUserIsAdmin(this.userId);
    LiveSync.remove({ userId: this.userId });
  },
  liveSyncUpdate(options) {
    SecurityService.checkUserIsAdmin(this.userId);
    check(options, String);
    LiveSync.update(
      { userId: this.userId },
      { $set: { options, updatedAt: new Date() } },
    );
  },
  liveSyncClear() {
    SecurityService.checkUserIsAdmin(this.userId);
    const now = new Date();
    LiveSync.remove({
      updatedAt: { $lt: new Date(now.getTime() - STALE_LIVE_SYNC_MS) },
    });
  },
});
