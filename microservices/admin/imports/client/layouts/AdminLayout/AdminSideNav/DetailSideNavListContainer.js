import { withRouter } from 'react-router-dom';
import { withState, withProps, lifecycle, compose } from 'recompose';

import adminLoans from 'core/api/loans/queries/adminLoans';
import { withSmartQuery } from 'core/api';
import {
  BORROWERS_COLLECTION,
  LOANS_COLLECTION,
  PROPERTIES_COLLECTION,
  USERS_COLLECTION,
  PROMOTIONS_COLLECTION,
} from 'core/api/constants';
import adminPromotions from 'core/api/promotions/queries/adminPromotions';
import { adminContacts } from 'core/api/contacts/queries';
import { CONTACTS_COLLECTION } from 'imports/core/api/constants';
import adminUsers from 'core/api/users/queries/adminUsers';
import adminProperties from 'core/api/properties/queries/adminProperties';
import { adminBorrowers } from 'core/api/borrowers/queries';

const PAGINATION_AMOUNT = 10;

const getQuery = (collectionName) => {
  switch (collectionName) {
  case BORROWERS_COLLECTION:
    return { query: adminBorrowers, body: { name: 1, loans: { name: 1 } } };
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
  case PROPERTIES_COLLECTION:
    return {
      query: adminProperties,
      body: {
        address1: 1,
        name: 1,
        loans: { name: 1 },
        promotion: { name: 1 },
      },
    };
  case USERS_COLLECTION:
    return { query: adminUsers, body: { name: 1, roles: 1 } };
  case PROMOTIONS_COLLECTION:
    return { query: adminPromotions, body: { name: 1, status: 1 } };
  case CONTACTS_COLLECTION:
    return {
      query: adminContacts,
      body: { name: 1, organisations: { name: 1 } },
    };
  default:
    return null;
  }
};

const applyFilters = (filterOptions) => {
  if (Object.keys(filterOptions).length === 0) {
    return {};
  }

  return filterOptions;
};

const setTotalCount = (props) => {
  const { collectionName, updateTotalCount, filterOptions } = props;
  getQuery(collectionName).query.clone({...applyFilters(filterOptions)}).getCount((err, result) => {
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
