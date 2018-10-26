import { Mongo } from 'meteor/mongo';

import Tasks from '../tasks';
import { COLLECTIONS } from '../../constants';

Tasks.addReducers({
  relatedDoc: {
    body: { docId: 1 },
    reduce: ({ docId }) => {
      let doc;
      let collection;
      Object.keys(COLLECTIONS).some((key) => {
        collection = COLLECTIONS[key];
        doc = Mongo.Collection.get(collection).findOne(docId, {
          fields: {
            _id: 1,
            name: 1,
            address1: 1,
          },
        });

        if (doc) {
          return true;
        }

        return false;
      });

      return { ...doc, collection };
    },
  },
});
