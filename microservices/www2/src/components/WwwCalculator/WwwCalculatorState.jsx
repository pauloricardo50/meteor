import React, { useContext, useReducer } from 'react';

import {
  ACTIONS,
  CURRENT_LOAN,
  FORTUNE,
  PROPERTY,
  PURCHASE_TYPE,
  SALARY,
  WANTED_LOAN,
} from './wwwCalculatorConstants';

const initialState = {
  [SALARY]: { sliderMax: 500000 },
  [FORTUNE]: { sliderMax: 500000 },
  [PROPERTY]: { sliderMax: 2000000 },
  [CURRENT_LOAN]: { sliderMax: 2000000 },
  [WANTED_LOAN]: { sliderMax: 2000000 },
  purchaseType: PURCHASE_TYPE.ACQUISITION,
};

const roundedValue = value => value && Math.round(value);

export const wwwCalculatorReducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.SET_VALUE: {
      const { at, ...rest } = payload;
      if (at) {
        return { ...state, [at]: { ...state[at], ...rest } };
      }
      return { ...state, ...rest };
    }
    case ACTIONS.SUGGEST_VALUE: {
      return state;
    }

    default:
      return state;
  }
};

export const useCalculatorState = () =>
  useReducer(wwwCalculatorReducer, initialState);

export const WwwCalculatorContext = React.createContext();

export const WwwCalculatorProvider = ({ children }) => {
  const reducerData = useReducer(wwwCalculatorReducer, initialState);
  return (
    <WwwCalculatorContext.Provider value={reducerData}>
      {children}
    </WwwCalculatorContext.Provider>
  );
};

export const useWwwCalculator = () => useContext(WwwCalculatorContext);
