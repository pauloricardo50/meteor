import { Mongo } from 'meteor/mongo';
import { Migrations } from 'meteor/percolate:migrations';

import { BORROWERS_COLLECTION } from '../../borrowers/borrowerConstants';
import FileService from '../../files/server/FileService';
import { LOANS_COLLECTION } from '../../loans/loanConstants';
import { ORGANISATIONS_COLLECTION } from '../../organisations/organisationConstants';
import { PROMOTIONS_COLLECTION } from '../../promotions/promotionConstants';
import { PROPERTIES_COLLECTION } from '../../properties/propertyConstants';

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
