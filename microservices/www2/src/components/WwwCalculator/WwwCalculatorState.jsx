import { useReducer } from 'react';

import {
  ACTIONS,
  CURRENT_LOAN,
  FORTUNE,
  PROPERTY,
  SALARY,
  WANTED_LOAN,
} from './wwwCalculatorConstants';

const initialState = {
  [SALARY]: { sliderMax: 500000 },
  [FORTUNE]: { sliderMax: 500000 },
  [PROPERTY]: { sliderMax: 2000000 },
  [CURRENT_LOAN]: { sliderMax: 2000000 },
  [WANTED_LOAN]: { sliderMax: 2000000 },
};

const roundedValue = value => value && Math.round(value);

export const wwwCalculatorReducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.SET_VALUE: {
      const { value, key, at } = payload;
      if (at) {
        return { ...state, [at]: { ...state[at], [key]: value } };
      }
      return { ...state, [key]: value };
    }
    case ACTIONS.SUGGEST_VALUE: {
    }

    default:
      return state;
  }
};

const useCalculatorState = () => useReducer(wwwCalculatorReducer, initialState);
