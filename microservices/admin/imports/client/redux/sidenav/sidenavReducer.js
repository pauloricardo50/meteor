import { defaultFilterOptions } from '../../layouts/AdminLayout/AdminSideNav/DetailSideNavFilters/filterOptions';
import * as sidenavTypes from './sidenavTypes';
import { defaultSortOption } from '../../layouts/AdminLayout/AdminSideNav/DetailSideNavSort/sortOptions';

export const initialState = {
  showDetail: false,
  collectionName: undefined,
  showMoreCount: 0,
  filters: defaultFilterOptions,
  sortOption: defaultSortOption,
};

const stepper = (state = initialState, action) => {
  switch (action.type) {
  case sidenavTypes.SHOW_DETAIL_NAV:
    return {
      ...state,
      showDetail: true,
      collectionName: action.collectionName,
      showMoreCount: 0,
    };
  case sidenavTypes.HIDE_DETAIL_NAV:
    return { ...state, showDetail: false, collectionName: undefined };
  case sidenavTypes.SHOW_MORE:
    return { ...state, showMoreCount: state.showMoreCount + 1 };
  case sidenavTypes.SET_FILTERS:
    return {
      ...state,
      filters: { ...state.filters, [action.collectionName]: action.filters },
    };
  case sidenavTypes.SET_SORT_OPTION:
    return {
      ...state,
      sortOption: {
        ...state.sortOption,
        [action.collectionName]: action.sortOption,
      },
    };
  default:
    return state;
  }
};

export default stepper;
