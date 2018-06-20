import * as sidenavTypes from './sidenavTypes';

const initialState = {
  showDetail: false,
  collectionName: undefined,
  showMoreCount: 0,
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
  default:
    return state;
  }
};

export default stepper;
