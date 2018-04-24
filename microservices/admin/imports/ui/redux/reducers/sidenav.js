const initialState = {
  showDetail: false,
  collectionName: undefined,
  showMoreCount: 0,
};

export const sidenavActions = {
  SHOW_DETAIL_NAV: 'SHOW_DETAIL_NAV',
  HIDE_DETAIL_NAV: 'HIDE_DETAIL_NAV',
  SHOW_MORE: 'SHOW_MORE',
};

const stepper = (state = initialState, action) => {
  switch (action.type) {
  case sidenavActions.SHOW_DETAIL_NAV:
    return {
      ...state,
      showDetail: true,
      collectionName: action.collectionName,
      showMoreCount: 0,
    };
  case sidenavActions.HIDE_DETAIL_NAV:
    return { ...state, showDetail: false, collectionName: undefined };
  case sidenavActions.SHOW_MORE:
    return { ...state, showMoreCount: state.showMoreCount + 1 };
  default:
    return state;
  }
};

export default stepper;
