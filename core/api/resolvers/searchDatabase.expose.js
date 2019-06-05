import { Match } from 'meteor/check';

import borrowerSearch from '../borrowers/queries/borrowerSearch';
import loanSearch from '../loans/queries/loanSearch';
import propertySearch from '../properties/queries/propertySearch';
import userSearch from '../users/queries/userSearch';
import promotionSearch from '../promotions/queries/promotionSearch';
import contactSearch from '../contacts/queries/contactSearch';
import organisationSearch from '../organisations/queries/organisationSearch';
import QueryCacher from '../helpers/server/QueryCacher';
import { COLLECTIONS } from '../constants';
import searchDatabase from './searchDatabase';

searchDatabase.expose({
  validateParams: {
    searchQuery: Match.Maybe(String),
    collection: Match.Maybe(String),
  },
});

const collectionSearches = {
  [COLLECTIONS.USERS_COLLECTION]: searchQuery =>
    userSearch.clone({ searchQuery }).fetch(),
  [COLLECTIONS.LOANS_COLLECTION]: searchQuery =>
    loanSearch.clone({ searchQuery }).fetch(),
  [COLLECTIONS.CONTACTS_COLLECTION]: searchQuery =>
    contactSearch.clone({ searchQuery }).fetch(),
  [COLLECTIONS.ORGANISATIONS_COLLECTION]: searchQuery =>
    organisationSearch.clone({ searchQuery }).fetch(),
  [COLLECTIONS.PROMOTIONS_COLLECTION]: searchQuery =>
    promotionSearch.clone({ searchQuery }).fetch(),
  [COLLECTIONS.PROPERTIES_COLLECTION]: searchQuery =>
    propertySearch.clone({ searchQuery }).fetch(),
  [COLLECTIONS.BORROWERS_COLLECTION]: searchQuery =>
    borrowerSearch.clone({ searchQuery }).fetch(),
};

searchDatabase.resolve(({ searchQuery, collection }) => {
  if (collection) {
    return collectionSearches[collection](searchQuery);
  }

  return {
    ...Object.keys(collectionSearches).reduce(
      (obj, collectionName) => ({
        ...obj,
        [collectionName]: collectionSearches[collectionName](searchQuery),
      }),
      {},
    ),
    searchQuery,
  };
});

const cacher = new QueryCacher({ ttl: 20 * 1000 });

searchDatabase.cacheResults(cacher);
