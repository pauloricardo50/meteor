import { Match } from 'meteor/check';

import { borrowerSearch } from '../../borrowers/queries';
import { loanSearch } from '../../loans/queries';
import { propertySearch } from '../../properties/queries';
import { userSearch } from '../../users/queries';
import { searchDatabase } from '../queries';
import { promotionSearch } from '../../promotions/queries';
import { contactSearch } from '../../contacts/queries';
import { organisationSearch } from '../../organisations/queries';
import QueryCacher from '../../helpers/server/QueryCacher';
import { exposeQuery } from '../queryHelpers';

exposeQuery(
  searchDatabase,
  {
    validateParams: { searchQuery: Match.Maybe(String) },
  },
  {},
);

searchDatabase.resolve(({ searchQuery }) => {
  const loans = loanSearch.clone({ searchQuery }).fetch();
  const properties = propertySearch.clone({ searchQuery }).fetch();
  const borrowers = borrowerSearch.clone({ searchQuery }).fetch();
  const users = userSearch.clone({ searchQuery }).fetch();
  const promotions = promotionSearch.clone({ searchQuery }).fetch();
  const contacts = contactSearch.clone({ searchQuery }).fetch();
  const organisations = organisationSearch.clone({ searchQuery }).fetch();

  return {
    searchQuery,
    users,
    loans,
    contacts,
    organisations,
    properties,
    promotions,
    borrowers,
  };
});

const cacher = new QueryCacher({ ttl: 20 * 1000 });

searchDatabase.cacheResults(cacher);
