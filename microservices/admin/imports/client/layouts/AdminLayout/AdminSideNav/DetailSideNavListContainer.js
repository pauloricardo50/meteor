import { withRouter } from 'react-router-dom';
import { compose, lifecycle, withProps, withState } from 'recompose';

import { adminLoans } from 'core/api/loans/queries';
import { withSmartQuery } from 'core/api/containerToolkit';
import { adminPromotions } from 'core/api/promotions/queries';
import { adminUsers } from 'core/api/users/queries';
import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import { USERS_COLLECTION } from 'core/api/users/userConstants';
import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';

const PAGINATION_AMOUNT = 10;

const getQuery = collectionName => {
  switch (collectionName) {
    case LOANS_COLLECTION:
      return {
        query: adminLoans,
        body: {
          structure: 1,
          name: 1,
          status: 1,
          user: { name: 1 },
          anonymous: 1,
        },
      };
    case USERS_COLLECTION:
      return { query: adminUsers, body: { name: 1, roles: 1 } };
    case PROMOTIONS_COLLECTION:
      return {
        query: adminPromotions,
        body: { name: 1, status: 1, city: 1, canton: 1 },
      };
    default:
      return null;
  }
};

const applyFilters = filterOptions => {
  if (Object.keys(filterOptions).length === 0) {
    return {};
  }

  return filterOptions;
};

const setTotalCount = props => {
  const { collectionName, updateTotalCount, filterOptions } = props;
  getQuery(collectionName)
    .query.clone({ ...applyFilters(filterOptions) })
    .getCount((err, result) => {
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
    const shouldSetTotalCount =
      collectionName !== prevCollectionName || prevFilters !== filters;

    if (shouldSetTotalCount) {
      setTotalCount(this.props);
    }
  },
});

export const withSideNavQuery = withSmartQuery({
  query: ({ collectionName }) => getQuery(collectionName).query,
  params: ({ showMoreCount, collectionName, sortOption, filterOptions }) => ({
    $limit: getQueryLimit(showMoreCount),
    $skip: 0,
    $body: getQuery(collectionName).body,
    $sort: { [sortOption.field]: sortOption.order },
    ...applyFilters(filterOptions),
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
  withRouter,
);
