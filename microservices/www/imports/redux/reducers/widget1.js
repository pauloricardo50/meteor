import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import { DEFAULT_INTEREST_RATE } from 'core/config/financeConstants';
import { createValueReducer } from './utils';

export const SALARY = 'salary';
export const FORTUNE = 'fortune';
export const PROPERTY = 'property';
export const NAMES = [SALARY, FORTUNE, PROPERTY];
export const FINAL_STEP = 3;

export const setValueAction = name => `${name}_CHANGE`;
export const suggestValueAction = name => `${name}_SUGGEST`;
export const setAutoAction = name => `${name}_AUTO`;
export const increaseSliderMaxAction = name => `${name}_INCREASE_SLIDER_MAX`;

const roundedValue = value => value && Math.round(value);

export const createWidget1ValueReducers = names =>
  names.reduce(
    (acc, { name, initialSliderMax }) => ({
      ...acc,
      [name]: (
        state = { value: 0, auto: false, sliderMax: initialSliderMax },
        action = {},
      ) => {
        switch (action.type) {
        case setValueAction(name):
          if (action.value === '') {
            // Allow empty string if the user edits the textfield
            return { ...state, value: '', auto: false };
          } else if (!action.value) {
            // Set auto to true if the value is changed to 0 (via slider)
            return { ...state, value: 0, auto: true };
          }
          // Set auto to false if this value is set
          return { ...state, auto: false, value: roundedValue(action.value) };
        case suggestValueAction(name):
          // If the value is suggested, don't change auto
          return { ...state, value: roundedValue(action.value) };
        case setAutoAction(name): {
          const nextAuto =
              action.auto !== undefined ? action.auto : !state.auto;
          return { ...state, auto: nextAuto };
        }
        case increaseSliderMaxAction(name):
          return {
            ...state,
            sliderMax: Math.min(state.sliderMax * 2, 100000000),
          };
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
  interestRate: createValueReducer('interestRate', DEFAULT_INTEREST_RATE),
});

export const makeWidget1Selector = name => state => state.widget1[name];
export const makeSelectValue = name =>
  createSelector(
    makeWidget1Selector(name),
    widget1Object => widget1Object.value,
  );
export const selectAutoValues = createSelector(
  NAMES.map(makeWidget1Selector),
  (...args) =>
    NAMES.reduce(
      (accumulator, NAME, index) => ({
        ...accumulator,
        [NAME]: args[index].auto,
      }),
      {},
    ),
);

export default widget1;
