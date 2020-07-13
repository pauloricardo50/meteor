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
import { setAutoValues, setFieldAt } from './wwwCalculatorSuggestion';

export const initialState = {
  [SALARY]: { sliderMax: 500000, auto: true },
  [FORTUNE]: { sliderMax: 500000, auto: true },
  [PROPERTY]: { sliderMax: 2000000, auto: true },
  [CURRENT_LOAN]: { sliderMax: 2000000, auto: true },
  [WANTED_LOAN]: { sliderMax: 2000000, auto: true },
  purchaseType: PURCHASE_TYPE.ACQUISITION,
  includeMaintenance: true,
};

export const wwwCalculatorReducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.SET: {
      return { ...state, ...payload };
    }
    case ACTIONS.SET_VALUE: {
      const { at, ...rest } = payload;
      const nextState = setFieldAt(state, at, { auto: false, ...rest });

      return setAutoValues(nextState);
    }
    default:
      return state;
  }
};

const WwwCalculatorContext = React.createContext();

export const WwwCalculatorProvider = ({ children }) => {
  const reducerData = useReducer(wwwCalculatorReducer, initialState);
  return (
    <WwwCalculatorContext.Provider value={reducerData}>
      {children}
    </WwwCalculatorContext.Provider>
  );
};

export const useWwwCalculator = () => useContext(WwwCalculatorContext);
