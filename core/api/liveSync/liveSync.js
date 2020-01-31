import { Mongo } from 'meteor/mongo';

const LiveSync = new Mongo.Collection('liveSync');

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
