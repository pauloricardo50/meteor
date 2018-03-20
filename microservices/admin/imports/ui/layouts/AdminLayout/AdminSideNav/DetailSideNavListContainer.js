import borrowersQuery from 'core/api/borrowers/queries/borrowersSideNav';
import loansQuery from 'core/api/loans/queries/loansSideNav';
import propertiesQuery from 'core/api/properties/queries/propertiesSideNav';
import tasksQuery from 'core/api/tasks/queries/tasksSideNav';
import usersQuery from 'core/api/users/queries/usersSideNav';
import { withQuery } from 'core/api';

const getQuery = ({ collectionName }) => {
  switch (collectionName) {
  case 'borrowers':
    return borrowersQuery;
  case 'loans':
    return loansQuery;
  case 'properties':
    return propertiesQuery;
  case 'tasks':
    return tasksQuery;
  case 'users':
    return usersQuery;
  default:
    return null;
  }
};

export default withQuery(({ collectionName }) =>
  getQuery({ collectionName }).clone(), { reactive: true });
