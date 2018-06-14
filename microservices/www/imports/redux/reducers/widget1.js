import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import { DEFAULT_INTEREST_RATE } from 'core/config/financeConstants';
import { createValueReducer } from './utils';
import {
  SALARY,
  PROPERTY,
  FORTUNE,
  PURCHASE_TYPE,
  CURRENT_LOAN,
  WANTED_LOAN,
  ACQUISITION_FIELDS,
  REFINANCING_FIELDS,
} from '../constants/widget1Constants';

export const setValueAction = name => `${name}_SET`;
export const suggestValueAction = name => `${name}_SUGGEST`;
export const setAutoAction = name => `${name}_AUTO`;
export const increaseSliderMaxAction = name => `${name}_INCREASE_SLIDER_MAX`;
export const setAllowExtremeLoanAction = name => `${name}_ALLOW_EXTREME_LOAN`;

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
        case setAllowExtremeLoanAction(name):
          return { ...state, allowExtremeLoan: true };
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
    { name: CURRENT_LOAN, initialSliderMax: 2000000 },
    { name: WANTED_LOAN, initialSliderMax: 2000000 },
  ]),
  step: createValueReducer('step', 0), // TODO: Set me back to 0 for production
  interestRate: createValueReducer('interestRate', DEFAULT_INTEREST_RATE),
  purchaseType: createValueReducer('purchaseType', PURCHASE_TYPE.ACQUISITION),
  finishedTutorial: createValueReducer('finishedTutorial', false),
  useMaintenance: createValueReducer('useMaintenance', true),
});

export const makeWidget1Selector = name => state => state.widget1[name];

export const makeSelectValue = name =>
  createSelector(
    makeWidget1Selector(name),
    widget1Object => widget1Object.value,
  );

export const selectFields = createSelector(
  makeWidget1Selector('purchaseType'),
  purchaseType =>
    (purchaseType === PURCHASE_TYPE.ACQUISITION
      ? ACQUISITION_FIELDS
      : REFINANCING_FIELDS),
);

export const selectAutoValues = (state) => {
  const fields = selectFields(state);

  return createSelector(fields.map(makeWidget1Selector), (...args) =>
    fields.reduce(
      (accumulator, NAME, index) => ({
        ...accumulator,
        [NAME]: args[index].auto,
      }),
      {},
    ))(state);
};

export default widget1;
