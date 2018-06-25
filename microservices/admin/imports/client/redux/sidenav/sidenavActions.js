import * as sidenavTypes from './sidenavTypes';

export const showDetailNav = collectionName => ({
  type: sidenavTypes.SHOW_DETAIL_NAV,
  collectionName,
});

export const hideDetailNav = () => ({ type: sidenavTypes.HIDE_DETAIL_NAV });

export const showMore = () => ({ type: sidenavTypes.SHOW_MORE });

export const setFilters = (collectionName, filters) => ({
  type: sidenavActions.SET_FILTERS,
  collectionName,
  filters,
});
