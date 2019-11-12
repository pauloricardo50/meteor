import { Factory } from 'meteor/dburles:factory';
import { Mongo } from 'meteor/mongo';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';

import CollectionService from '../helpers/CollectionService';
import { COLLECTIONS } from '../constants';
import { NOTIFICATIONS_COLLECTION } from '../notifications/notificationConstants';
import { ACTIVITIES_COLLECTION } from '../activities/activityConstants';

const getSingularFactoryName = collection => {
  switch (collection) {
    case COLLECTIONS.LOANS_COLLECTION:
      return 'loan';
    case COLLECTIONS.BORROWERS_COLLECTION:
      return 'borrower';
    case COLLECTIONS.PROPERTIES_COLLECTION:
      return 'property';
    case COLLECTIONS.USERS_COLLECTION:
      return 'user';
    case COLLECTIONS.TASKS_COLLECTION:
      return 'task';
    case COLLECTIONS.OFFERS_COLLECTION:
      return 'offer';
    case COLLECTIONS.PROMOTIONS_COLLECTION:
      return 'promotion';
    case COLLECTIONS.PROMOTION_OPTIONS_COLLECTION:
      return 'promotionOption';
    case COLLECTIONS.PROMOTION_LOTS_COLLECTION:
      return 'promotionLot';
    case COLLECTIONS.LOTS_COLLECTION:
      return 'lot';
    case COLLECTIONS.MORTGAGE_NOTES_COLLECTION:
      return 'mortgageNote';
    case COLLECTIONS.ORGANISATIONS_COLLECTION:
      return 'organisation';
    case COLLECTIONS.LENDERS_COLLECTION:
      return 'lender';
    case COLLECTIONS.CONTACTS_COLLECTION:
      return 'contact';
    case NOTIFICATIONS_COLLECTION:
      return 'notification';
    case ACTIVITIES_COLLECTION:
      return 'activity';
    default:
      throw new Error(
        `No singular factory name found for ${collection}, add it in the generator`,
      );
  }
};

const arrayify = maybeArray =>
  Array.isArray(maybeArray) ? maybeArray : [maybeArray];

const findCollectionNameByLinkName = ({ collection, linkName }) =>
  Mongo.Collection.get(collection).__links[linkName].linkConfig.collection
    ._name;

const findLinkKeys = ({ collection }) => {
  const { __links: linkNames = {} } = Mongo.Collection.get(collection);
  const links = Object.keys(linkNames);
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
    if (factory) {
      return Factory.create(factory, doc);
    }

    try {
      return Factory.create(collection, doc);
    } catch (error) {
      if (
        error.message &&
        error.message === `Factory: There is no factory named ${collection}`
      ) {
        return Factory.create(getSingularFactoryName(collection), doc);
      }
      throw error;
    }
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

    Object.keys(linksToInsert).forEach(linkName => {
      const linkCollection = findCollectionNameByLinkName({
        collection,
        linkName,
      });
      const linkedDocs = arrayify(linksToInsert[linkName]);
      linkedDocs.forEach(linkedDoc => {
        const linkId = createNestedObject({
          doc: linkedDoc,
          collection: linkCollection,
          parentId: id,
        });
        const collectionService = new CollectionService(
          Mongo.Collection.get(collection),
        );
        collectionService.addLink({
          id,
          linkName,
          linkId,
          metadata: linkedDoc.$metadata,
        });
      });
    });

    return id;
  };

  Object.keys(scenario).forEach(collection => {
    const docsInCollection = arrayify(scenario[collection]);
    docsInCollection.forEach(doc => createNestedObject({ doc, collection }));
  });

  return { ids, docs, docsById };
};

export default generator;
