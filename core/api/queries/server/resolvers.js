import { borrowerSearch } from '../../borrowers/queries';
import { loanSearch } from '../../loans/queries';
import { propertySearch } from '../../properties/queries';
import { userSearch } from '../../users/queries';
import { promotionSearch } from '../../promotions/queries';
import { contactSearch } from '../../contacts/queries';
import { organisationSearch } from '../../organisations/queries';
import { COLLECTIONS } from '../../constants';

const collectionSearches = {
  [COLLECTIONS.USERS_COLLECTION]: searchQuery =>
    userSearch.clone({ searchQuery, $body: { name: 1, roles: 1 } }).fetch(),
  [COLLECTIONS.LOANS_COLLECTION]: searchQuery =>
    loanSearch
      .clone({ searchQuery, $body: { name: 1, status: 1, category: 1 } })
      .fetch(),
  [COLLECTIONS.CONTACTS_COLLECTION]: searchQuery =>
    contactSearch
      .clone({ searchQuery, $body: { name: 1, organisations: { name: 1 } } })
      .fetch(),
  [COLLECTIONS.ORGANISATIONS_COLLECTION]: searchQuery =>
    organisationSearch
      .clone({ searchQuery, $body: { name: 1, type: 1 } })
      .fetch(),
  [COLLECTIONS.PROMOTIONS_COLLECTION]: searchQuery =>
    promotionSearch
      .clone({ searchQuery, $body: { name: 1, status: 1 } })
      .fetch(),
  [COLLECTIONS.PROPERTIES_COLLECTION]: searchQuery =>
    propertySearch
      .clone({
        searchQuery,
        $body: { address1: 1, name: 1, status: 1, category: 1 },
      })
      .fetch(),
  [COLLECTIONS.BORROWERS_COLLECTION]: searchQuery =>
    borrowerSearch.clone({ searchQuery, $body: { name: 1, age: 1 } }).fetch(),
};

export const searchDatabaseResolver = ({ searchQuery, collection }) => {
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
};
