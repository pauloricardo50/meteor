import { combineReducers } from 'redux';
import { createValueReducer } from './utils';

export const SALARY = 'salary';
export const FORTUNE = 'fortune';
export const PROPERTY = 'property';

export const setValueAction = name => `${name}.CHANGE`;
export const resetValueAction = name => `${name}.RESET`;
export const setAutoAction = name => `${name}.AUTO`;
export const setManualAction = name => `${name}.MANUAL`;

const createWidget1ValueReducers = names =>
  names.reduce(
    (acc, name) => ({
      ...acc,
      [name]: (state = { value: undefined, auto: true }, action) => {
        switch (action.type) {
        case setValueAction(name):
          return { ...state, value: action.value };
        case resetValueAction(name):
          return { ...state, value: 0 };
        case setAutoAction(name):
          return { ...state, auto: true };
        case setManualAction(name):
          return { ...state, auto: false };
        default:
          return state;
        }
      },
    }),
    {},
  );

const widget1 = combineReducers({
  ...createWidget1ValueReducers([SALARY, FORTUNE, PROPERTY]),
  step: createValueReducer('step', 3),
  interestRate: createValueReducer('step', 0.015),
});

export default widget1;
