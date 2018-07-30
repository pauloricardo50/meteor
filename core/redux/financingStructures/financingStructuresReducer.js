// @flow
import { REHYDRATE_DATA, UPDATE_STRUCTURE } from './financingStructuresTypes';

const initialState = { isLoaded: false };

const financingStructuresReducer = (state = initialState, action) => {
  switch (action.type) {
  case REHYDRATE_DATA: {
    const { dataName, data } = action.payload;
    return { ...state, [dataName]: data, isLoaded: true };
  }
  case UPDATE_STRUCTURE: {
    const { structureId, structure } = action.payload;
    return {
      ...state,
      structures: {
        ...state.structures,
        [structureId]: { ...state.structures[structureId], ...structure },
      },
    };
  }
  default:
    return state;
  }
};

export default financingStructuresReducer;
