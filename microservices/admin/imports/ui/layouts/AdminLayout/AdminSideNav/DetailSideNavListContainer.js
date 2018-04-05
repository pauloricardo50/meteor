import { withRouter } from 'react-router-dom';

import sideNavBorrowers from 'core/api/borrowers/queries/sideNavBorrowers';
import sideNavLoans from 'core/api/loans/queries/sideNavLoans';
import sideNavProperties from 'core/api/properties/queries/sideNavProperties';
import sideNavTasks from 'core/api/tasks/queries/sideNavTasks';
import sideNavUsers from 'core/api/users/queries/sideNavUsers';
import { withQuery, compose } from 'core/api';
import { withState, lifecycle } from 'recompose';
import {
  BORROWERS_COLLECTION,
  LOANS_COLLECTION,
  PROPERTIES_COLLECTION,
  TASKS_COLLECTION,
  USERS_COLLECTION,
} from 'core/api/constants';

const PAGINATION_AMOUNT = 10;

const getQuery = ({ collectionName }) => {
  switch (collectionName) {
  case BORROWERS_COLLECTION:
    return sideNavBorrowers;
  case LOANS_COLLECTION:
    return sideNavLoans;
  case PROPERTIES_COLLECTION:
    return sideNavProperties;
  case TASKS_COLLECTION:
    return sideNavTasks;
  case USERS_COLLECTION:
    return sideNavUsers;
  default:
    return null;
  }
};

const setTotalCount = (props) => {
  const { collectionName, updateTotalCount } = props;
  getQuery({ collectionName }).getCount((err, result) => {
    updateTotalCount(result);
  });
};

export default compose(
  withState('totalCount', 'updateTotalCount', 0),
  lifecycle({
    componentDidMount() {
      setTotalCount(this.props);
    },
    componentDidUpdate({ prevCollectionName, filters: prevFilters }) {
      const { collectionName, filters } = this.props;
      if (collectionName !== prevCollectionName || prevFilters !== filters) {
        setTotalCount(this.props);
      }
    },
  }),
  withQuery(
    ({ collectionName, showMoreCount }) =>
      getQuery({ collectionName }).clone({
        limit: PAGINATION_AMOUNT * (showMoreCount + 1),
        skip: 0,
      }),
    { reactive: true },
  ),
  withRouter,
);
