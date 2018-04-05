import borrowersQuery from 'core/api/borrowers/queries/borrowers';
import loansQuery from 'core/api/loans/queries/adminLoans';
import propertiesQuery from 'core/api/properties/queries/properties';
import usersQuery from '../../api/users/queries/adminUsers';
import searchDatabase from './searchDatabase';

searchDatabase.expose();

searchDatabase.resolve(({ searchQuery }) => {
  const loans = loansQuery.clone({ searchQuery }).fetch();
  const properties = propertiesQuery.clone({ searchQuery }).fetch();
  const borrowers = borrowersQuery.clone({ searchQuery }).fetch();
  const users = usersQuery.clone({ searchQuery }).fetch();

  return {
    users,
    loans,
    borrowers,
    properties,
  };
});
