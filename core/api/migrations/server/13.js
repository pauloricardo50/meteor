import { Migrations } from 'meteor/percolate:migrations';
import { Mongo } from 'meteor/mongo';

import FileService from 'core/api/files/server/FileService';
import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import { BORROWERS_COLLECTION } from 'core/api/borrowers/borrowerConstants';
import { PROPERTIES_COLLECTION } from 'core/api/properties/propertyConstants';
import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';

const collections = [
  LOANS_COLLECTION,
  BORROWERS_COLLECTION,
  PROPERTIES_COLLECTION,
  ORGANISATIONS_COLLECTION,
  PROMOTIONS_COLLECTION,
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
  collections.forEach(collection => {
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
