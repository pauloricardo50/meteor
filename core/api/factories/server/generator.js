import { Factory } from 'meteor/dburles:factory';
import { Mongo } from 'meteor/mongo';

import omit from 'lodash/omit';
import pick from 'lodash/pick';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';

import { ACTIVITIES_COLLECTION } from '../../activities/activityConstants';
import { BORROWERS_COLLECTION } from '../../borrowers/borrowerConstants';
import { COMMISSION_RATES_COLLECTION } from '../../commissionRates/commissionRateConstants';
import { CONTACTS_COLLECTION } from '../../contacts/contactsConstants';
import CollectionService from '../../helpers/server/CollectionService';
import { INSURANCE_PRODUCTS_COLLECTION } from '../../insuranceProducts/insuranceProductConstants';
import { INSURANCE_REQUESTS_COLLECTION } from '../../insuranceRequests/insuranceRequestConstants';
import { INSURANCES_COLLECTION } from '../../insurances/insuranceConstants';
import { LENDERS_COLLECTION } from '../../lenders/lenderConstants';
import { LOANS_COLLECTION } from '../../loans/loanConstants';
import { LOTS_COLLECTION } from '../../lots/lotConstants';
import { MORTGAGE_NOTES_COLLECTION } from '../../mortgageNotes/mortgageNoteConstants';
import { NOTIFICATIONS_COLLECTION } from '../../notifications/notificationConstants';
import { OFFERS_COLLECTION } from '../../offers/offerConstants';
import { ORGANISATIONS_COLLECTION } from '../../organisations/organisationConstants';
import { PROMOTION_LOTS_COLLECTION } from '../../promotionLots/promotionLotConstants';
import { PROMOTION_OPTIONS_COLLECTION } from '../../promotionOptions/promotionOptionConstants';
import { PROMOTIONS_COLLECTION } from '../../promotions/promotionConstants';
import { PROPERTIES_COLLECTION } from '../../properties/propertyConstants';
import { TASKS_COLLECTION } from '../../tasks/taskConstants';
import { USERS_COLLECTION } from '../../users/userConstants';

const getSingularFactoryName = collection => {
  switch (collection) {
    case LOANS_COLLECTION:
      return 'loan';
    case BORROWERS_COLLECTION:
      return 'borrower';
    case PROPERTIES_COLLECTION:
      return 'property';
    case USERS_COLLECTION:
      return 'user';
    case TASKS_COLLECTION:
      return 'task';
    case OFFERS_COLLECTION:
      return 'offer';
    case PROMOTIONS_COLLECTION:
      return 'promotion';
    case PROMOTION_OPTIONS_COLLECTION:
      return 'promotionOption';
    case PROMOTION_LOTS_COLLECTION:
      return 'promotionLot';
    case LOTS_COLLECTION:
      return 'lot';
    case MORTGAGE_NOTES_COLLECTION:
      return 'mortgageNote';
    case ORGANISATIONS_COLLECTION:
      return 'organisation';
    case LENDERS_COLLECTION:
      return 'lender';
    case CONTACTS_COLLECTION:
      return 'contact';
    case NOTIFICATIONS_COLLECTION:
      return 'notification';
    case ACTIVITIES_COLLECTION:
      return 'activity';
    case INSURANCE_REQUESTS_COLLECTION:
      return 'insuranceRequest';
    case INSURANCES_COLLECTION:
      return 'insurance';
    case INSURANCE_PRODUCTS_COLLECTION:
      return 'insuranceProduct';
    case COMMISSION_RATES_COLLECTION:
      return 'commissionRate';
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
  if (doc._id && !!Mongo.Collection.get(collection).findOne(doc._id)) {
    // document already exists
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
    const linkKeys = findLinkKeys({ collection });

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
