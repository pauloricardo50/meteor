const initialState = { activeStep: -1 };

export const sidenavActions = {
  SHOW_DETAIL_NAV: 'SHOW_DETAIL_NAV',
  HIDE_DETAIL_NAV: 'HIDE_DETAIL_NAV',
};

const stepper = (state = initialState, action) => {
  switch (action.type) {
  case sidenavActions.SHOW_DETAIL_NAV:
    return {
      ...state,
      showDetail: true,
      collectionName: action.collectionName,
    };
  case sidenavActions.HIDE_DETAIL_NAV:
    return { ...state, showDetail: false };
  default:
    return state;
  }
};

export default stepper;
