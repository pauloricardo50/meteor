import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { COLLECTIONS } from '../../constants';
import SecurityService from '../../security';

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
