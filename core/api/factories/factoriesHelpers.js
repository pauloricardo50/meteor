import { Factory } from 'meteor/dburles:factory';
import { Mongo } from 'meteor/mongo';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';

import CollectionService from '../helpers/CollectionService';

const arrayify = maybeArray =>
  (Array.isArray(maybeArray) ? maybeArray : [maybeArray]);

const findCollectionNameByLinkName = ({ collection, linkName }) =>
  Mongo.Collection.get(collection).__links[linkName].linkConfig.collection
    ._name;

const findLinkKeys = ({ collection }) => {
  const links = Object.keys(Mongo.Collection.get(collection).__links);
  return links;
};

const insertDoc = ({ doc, collection, useFactories, factory }) => {
  let docExists = false;

  if (doc._id) {
    docExists = !!Mongo.Collection.get(collection).findOne(doc._id);
  }

  if (docExists) {
    return doc;
  }

  if (useFactories && factory !== null) {
    return Factory.create(factory || collection, doc);
  }
  const _id = Mongo.Collection.get(collection).insert(doc);
  return Mongo.Collection.get(collection).findOne(_id);
};

const generator = (scenario, { useFactories = true } = {}) => {
  const ids = {};
  const docs = {};
  const docsById = {};

  const pushId = ({ id, collection }) => {
    ids[collection] = ids[collection] ? [...ids[collection], id] : [id];
    ids[collection] = uniq(ids[collection]);
  };

  const pushDoc = ({ doc, collection }) => {
    docs[collection] = docs[collection] ? [...docs[collection], doc] : [doc];
    docs[collection] = uniqBy(docs[collection], '_id');

    docsById[collection] = docsById[collection]
      ? { ...docsById[collection], [doc._id]: doc }
      : { [doc._id]: doc };
  };

  const createNestedObject = ({ doc, collection }) => {
    const linkKeys = findLinkKeys({ doc, collection });

    const docToInsert = omit(doc, [...linkKeys, '_factory', '$metadata']);

    const insertedDoc = insertDoc({
      collection,
      doc: docToInsert,
      useFactories,
      factory: doc._factory,
    });
    const { _id: id } = insertedDoc;
    pushId({ id, collection });
    pushDoc({ doc: insertedDoc, collection });

    const linksToInsert = pick(doc, linkKeys);

    Object.keys(linksToInsert).forEach((linkName) => {
      const linkCollection = findCollectionNameByLinkName({
        collection,
        linkName,
      });
      const docs = arrayify(linksToInsert[linkName]);
      docs.forEach((doc) => {
        const linkId = createNestedObject({
          doc,
          collection: linkCollection,
          parentId: id,
        });
        const collectionService = new CollectionService(Mongo.Collection.get(collection));
        collectionService.addLink({
          id,
          linkName,
          linkId,
          metadata: doc.$metadata,
        });
      });
    });

    return id;
  };

  Object.keys(scenario).forEach((collection) => {
    const docs = arrayify(scenario[collection]);
    docs.forEach(doc => createNestedObject({ doc, collection }));
  });

  return { ids, docs, docsById };
};

export default generator;
