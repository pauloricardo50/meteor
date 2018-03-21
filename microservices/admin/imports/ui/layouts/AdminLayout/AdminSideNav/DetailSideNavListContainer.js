import borrowersQuery from 'core/api/borrowers/queries/sideNavBorrowers';
import loansQuery from 'core/api/loans/queries/sideNavLoans';
import propertiesQuery from 'core/api/properties/queries/sideNavProperties';
import tasksQuery from 'core/api/tasks/queries/sideNavTasks';
import usersQuery from 'core/api/users/queries/sideNavUsers';
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
