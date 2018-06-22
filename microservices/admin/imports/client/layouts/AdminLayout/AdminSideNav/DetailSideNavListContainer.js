import { withRouter } from 'react-router-dom';

import sideNavBorrowers from 'core/api/borrowers/queries/sideNavBorrowers';
import sideNavLoans from 'core/api/loans/queries/sideNavLoans';
import sideNavProperties from 'core/api/properties/queries/sideNavProperties';
import sideNavUsers from 'core/api/users/queries/sideNavUsers';
import { withQuery, compose } from 'core/api';
import withFilterAndSortData from 'core/api/containerToolkit/withFilterAndSortData';
import { withState, withProps, lifecycle } from 'recompose';
import {
  BORROWERS_COLLECTION,
  LOANS_COLLECTION,
  PROPERTIES_COLLECTION,
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

const getQueryLimit = showMoreCount => PAGINATION_AMOUNT * (showMoreCount + 1);

export default compose(
  withState('totalCount', 'updateTotalCount', 0),
  lifecycle({
    componentDidMount() {
      setTotalCount(this.props);
    },
    componentDidUpdate({ prevCollectionName, filters: prevFilters }) {
      const { collectionName, filters } = this.props;
      const shouldSetTotalCount =
        collectionName !== prevCollectionName || prevFilters !== filters;

      if (shouldSetTotalCount) {
        setTotalCount(this.props);
      }
    },
  }),
  withQuery(
    ({ collectionName, showMoreCount }) =>
      getQuery({ collectionName }).clone({
        limit: getQueryLimit(showMoreCount),
        skip: 0,
      }),
    { reactive: true },
  ),
  withProps(({ showMoreCount, totalCount }) => ({
    isEnd: getQueryLimit(showMoreCount) >= totalCount,
  })),
  withFilterAndSortData(),
  withRouter,
);
