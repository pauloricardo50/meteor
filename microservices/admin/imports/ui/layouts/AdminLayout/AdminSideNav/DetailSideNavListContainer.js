import { withRouter } from 'react-router-dom';

import borrowersQuery from 'core/api/borrowers/queries/sideNavBorrowers';
import loansQuery from 'core/api/loans/queries/sideNavLoans';
import propertiesQuery from 'core/api/properties/queries/sideNavProperties';
import tasksQuery from 'core/api/tasks/queries/sideNavTasks';
import usersQuery from 'core/api/users/queries/sideNavUsers';
import { withQuery, compose } from 'core/api';
import {
  BORROWERS_COLLECTION,
  LOANS_COLLECTION,
  PROPERTIES_COLLECTION,
  TASKS_COLLECTION,
  USERS_COLLECTION,
} from 'core/api/constants';

const getQuery = ({ collectionName }) => {
  switch (collectionName) {
  case BORROWERS_COLLECTION:
    return borrowersQuery;
  case LOANS_COLLECTION:
    return loansQuery;
  case PROPERTIES_COLLECTION:
    return propertiesQuery;
  case TASKS_COLLECTION:
    return tasksQuery;
  case USERS_COLLECTION:
    return usersQuery;
  default:
    return null;
  }
};

export default compose(
  withQuery(({ collectionName }) => getQuery({ collectionName }).clone(), {
    reactive: true,
  }),
  withRouter,
);
