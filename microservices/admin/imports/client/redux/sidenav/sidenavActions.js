import * as sidenavTypes from './sidenavTypes';

export const showDetailNav = collectionName => ({
  type: sidenavTypes.SHOW_DETAIL_NAV,
  collectionName,
});

export const hideDetailNav = () => ({ type: sidenavTypes.HIDE_DETAIL_NAV });

export const showMore = () => ({ type: sidenavTypes.SHOW_MORE });

export const setFilters = (collectionName, filters) => ({
  type: sidenavTypes.SET_FILTERS,
  collectionName,
  filters,
});

export const setSortOption = (collectionName, sortOption) => ({
  type: sidenavTypes.SET_SORT_OPTION,
  collectionName,
  sortOption,
});
