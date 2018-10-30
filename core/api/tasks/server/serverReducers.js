import { Mongo } from 'meteor/mongo';

import Tasks from '../tasks';
import { COLLECTIONS } from '../../constants';
import assigneeReducer from '../../reducers/assigneeReducer';

Tasks.addReducers({
  ...assigneeReducer(),
  relatedDoc: {
    body: { docId: 1 },
    reduce: ({ docId }) => {
      if (!docId) {
        return {};
      }

      let doc;
      let collection;
      const foundRelatedDoc = Object.keys(COLLECTIONS).some((key) => {
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

      return foundRelatedDoc
        ? { ...doc, collection }
        : { collection: 'NOT_FOUND' };
    },
  },
});
