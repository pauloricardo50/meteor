import { withRouter } from 'react-router-dom';
import { withState, withProps, lifecycle, compose } from 'recompose';

import sideNavBorrowers from 'core/api/borrowers/queries/sideNavBorrowers';
import sideNavLoans from 'core/api/loans/queries/sideNavLoans';
import sideNavProperties from 'core/api/properties/queries/sideNavProperties';
import sideNavUsers from 'core/api/users/queries/sideNavUsers';
import { withSmartQuery } from 'core/api';
import withDataFilterAndSort from 'core/api/containerToolkit/withDataFilterAndSort';
import {
  BORROWERS_COLLECTION,
  LOANS_COLLECTION,
  PROPERTIES_COLLECTION,
  USERS_COLLECTION,
  PROMOTIONS_COLLECTION,
} from 'core/api/constants';
import adminPromotions from 'core/api/promotions/queries/adminPromotions';

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
  case PROMOTIONS_COLLECTION:
    return adminPromotions;
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

export const withTotalCountState = withState(
  'totalCount',
  'updateTotalCount',
  0,
);

export const withSetTotalCountLifecycle = lifecycle({
  componentDidMount() {
    setTotalCount(this.props);
  },
  componentDidUpdate({
    collectionName: prevCollectionName,
    filters: prevFilters,
  }) {
    const { collectionName, filters } = this.props;
    const shouldSetTotalCount = collectionName !== prevCollectionName || prevFilters !== filters;

    if (shouldSetTotalCount) {
      setTotalCount(this.props);
    }
  },
});

export const withSideNavQuery = withSmartQuery({
  query: ({ collectionName }) => getQuery({ collectionName }),
  params: ({ showMoreCount }) => ({
    limit: getQueryLimit(showMoreCount),
    skip: 0,
  }),
  queryOptions: { reactive: false },
});

export const withIsEndProp = withProps(({ showMoreCount, totalCount }) => ({
  isEnd: getQueryLimit(showMoreCount) >= totalCount,
}));

export default compose(
  withTotalCountState,
  withSetTotalCountLifecycle,
  withSideNavQuery,
  withIsEndProp,
  withDataFilterAndSort,
  withRouter,
);
