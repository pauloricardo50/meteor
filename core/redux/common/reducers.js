import { RESET_VALUE, SET_VALUE } from './types';

export const createValueReducer = (valueName, initialState = null) => (
  state = initialState,
  { type, value } = {},
) => {
  switch (type) {
    case SET_VALUE(valueName):
      return value;
    case RESET_VALUE(valueName):
      return initialState;
    default:
      return state;
  }
};
