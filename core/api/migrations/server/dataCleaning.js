import { Mongo } from 'meteor/mongo';
import omit from 'lodash/omit';

const skippedCollections = ['_cacheMigrations', 'grapher_counts'];
const skippedFields = ['_id', 'createdAt', 'updatedAt'];

const makeCleanDocument = collection => doc => {
  const { _id } = doc;
  const schema = collection.instance.simpleSchema(doc);

  if (!schema) {
    console.log(collection.name, doc);
  }

  const cleanDoc = schema.clean(doc, {
    mutate: true,
    filter: true,
    autoConvert: true,
    removeEmptyStrings: false,
    trimStrings: true,
    getAutoValues: true,
  });
  const withoutSkippedFields = omit(cleanDoc, skippedFields);
  //   Sometimes empty documents can slip through, and update will fail because $set is empty
  if (!withoutSkippedFields || Object.keys(withoutSkippedFields).length === 0) {
    console.log(`empty ${collection.name} document: ${_id}`);
    return Promise.resolve();
  }
  return collection.instance
    .rawCollection()
    .update({ _id }, { $set: withoutSkippedFields });
};
const cleanCollection = async collection => {
  if (
    !collection.name ||
    skippedCollections.includes(collection.name) ||
    !collection.instance._c2
  ) {
    console.log(`Skipping ${collection.name}`);
    return;
  }
  console.log(`Cleaning ${collection.name}`);

  const allDocuments = collection.instance.find({}).fetch();
  const cleanDocument = makeCleanDocument(collection);
  await Promise.all(allDocuments.map(cleanDocument));

  console.log(`Cleaned ${allDocuments.length} docs for ${collection.name}`);
};
export const cleanAllData = async () => {
  console.log('Data cleaning Start...');
  const collections = Mongo.Collection.getAll();
  await Promise.all(collections.map(cleanCollection));
  console.log('Data cleaning Complete! :)');
};
