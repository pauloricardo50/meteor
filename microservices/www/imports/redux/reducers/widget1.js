import { combineReducers } from 'redux';
import { createValueReducer } from './utils';

export const SALARY = 'salary';
export const FORTUNE = 'fortune';
export const PROPERTY = 'property';

export const setValueAction = name => `${name}.CHANGE`;
export const setAutoAction = name => `${name}.AUTO`;
export const setManualAction = name => `${name}.MANUAL`;
export const increaseSliderMaxAction = name => `${name}.INCREASE_SLIDER_MAX`;

const createWidget1ValueReducers = names =>
  names.reduce(
    (acc, { name, initialSliderMax }) => ({
      ...acc,
      [name]: (
        state = { value: undefined, auto: true, sliderMax: initialSliderMax },
        action,
      ) => {
        switch (action.type) {
        case setValueAction(name):
          return { ...state, value: action.value };
        case setAutoAction(name):
          return { ...state, auto: true };
        case setManualAction(name):
          return { ...state, auto: false };
        case increaseSliderMaxAction(name):
          return { ...state, sliderMax: state.sliderMax + initialSliderMax };
        default:
          return state;
        }
      },
    }),
    {},
  );

const widget1 = combineReducers({
  ...createWidget1ValueReducers([
    { name: SALARY, initialSliderMax: 500000 },
    { name: FORTUNE, initialSliderMax: 500000 },
    { name: PROPERTY, initialSliderMax: 2000000 },
  ]),
  step: createValueReducer('step', 0),
  interestRate: createValueReducer('interestRate', 0.015),
});

export default widget1;
