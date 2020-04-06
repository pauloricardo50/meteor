import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import SecurityService from '../../security';
import { COLLECTIONS } from '../../server/serverConstants';

Meteor.startup(() => {
  Object.values(COLLECTIONS).forEach(collectionName => {
    const Collection = Mongo.Collection.get(collectionName);

    Collection.expose({
      firewall(filters, options, userId) {
        SecurityService.checkUserIsAdmin(userId);
      },
      publication: true,
      method: true,
      blocking: false,
    });
  });
});
