import borrowersQuery from 'core/api/borrowers/queries/borrowers';
import loansQuery from 'core/api/loans/queries/adminLoans';
import propertiesQuery from 'core/api/properties/queries/properties';
import usersQuery from 'core/api/users/queries/adminUsers';
import searchDatabase from './searchDatabase';

searchDatabase.expose();

searchDatabase.resolve(({ searchQuery }) => {
  const loansArray = loansQuery.clone({ searchQuery }).fetch();
  const propertiesArray = propertiesQuery.clone({ searchQuery }).fetch();
  const borrowersArray = borrowersQuery.clone({ searchQuery }).fetch();
  const usersArray = usersQuery.clone({ searchQuery }).fetch();

  return {
    loans: loansArray,
    properties: propertiesArray,
    borrowers: borrowersArray,
    users: usersArray,
  };
});
