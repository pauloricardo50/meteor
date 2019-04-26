import { Migrations } from 'meteor/percolate:migrations';
import { Mongo } from 'meteor/mongo';

import {
  LOANS_COLLECTION,
  BORROWERS_COLLECTION,
  PROPERTIES_COLLECTION,
  ORGANISATIONS_COLLECTION,
  PROMOTIONS_COLLECTION,
  PROMOTION_LOTS_COLLECTION,
} from 'core/api/constants';
import FileService from 'core/api/files/server/FileService';

const collections = [
  LOANS_COLLECTION,
  BORROWERS_COLLECTION,
  PROPERTIES_COLLECTION,
  ORGANISATIONS_COLLECTION,
  PROMOTIONS_COLLECTION,
  PROMOTION_LOTS_COLLECTION,
];

export const up = async () => {
  for (let index = 0; index < collections.length; index++) {
    const collection = collections[index];

    const docs = Mongo.Collection.get(collection)
      .find({}, { fields: { _id: 1 } })
      .fetch();

    for (let index2 = 0; index2 < docs.length; index2++) {
      const { _id: docId } = docs[index2];
      await FileService.updateDocumentsCache({ collection, docId });
    }
  }
};

export const down = () => {
  collections.forEach((collection) => {
    Mongo.Collection.get(collection).update(
      {},
      { $unset: { documents: true } },
      { multi: true },
    );
  });
};

Migrations.add({
  version: 13,
  name: 'Add documents cache on all collections',
  up,
  down,
});
