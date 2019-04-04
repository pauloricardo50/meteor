import { Match } from 'meteor/check';

import borrowerSearch from '../borrowers/queries/borrowerSearch';
import loanSearch from '../loans/queries/loanSearch';
import propertySearch from '../properties/queries/propertySearch';
import userSearch from '../users/queries/userSearch';
import searchDatabase from './searchDatabase';
import promotionSearch from '../promotions/queries/promotionSearch';
import contactSearch from '../contacts/queries/contactSearch';
import organisationSearch from '../organisations/queries/organisationSearch';
import QueryCacher from '../helpers/server/QueryCacher';

searchDatabase.expose({
  validateParams: { searchQuery: Match.Maybe(String) },
});

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
