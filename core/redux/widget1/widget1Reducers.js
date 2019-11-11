import { combineReducers } from 'redux';
import { DEFAULT_INTEREST_RATE } from 'core/config/financeConstants';
import { createValueReducer } from '../common/reducers';
import {
  SALARY,
  PROPERTY,
  FORTUNE,
  PURCHASE_TYPE,
  CURRENT_LOAN,
  WANTED_LOAN,
} from './widget1Constants';
import {
  SET_VALUE,
  SUGGEST_VALUE,
  SET_AUTO,
  INCREASE_SLIDER_MAX,
  SET_ALLOW_EXTREME_LOAN,
} from './widget1Types';

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
          case SET_VALUE(name):
            if (action.value === '') {
              // Allow empty string if the user edits the textfield
              return { ...state, value: '', auto: false };
            }
            if (!action.value && name !== CURRENT_LOAN) {
              // Set auto to true if the value is changed to 0
              // (via slider or by typing 0)
              // Exception for current_loan which is the only value that
              // can explicitly be set to 0
              return { ...state, value: 0, auto: true };
            }
            // Set auto to false if this value is set
            return { ...state, auto: false, value: roundedValue(action.value) };
          case SUGGEST_VALUE(name):
            // If the value is suggested, don't change auto
            return { ...state, value: roundedValue(action.value) };
          case SET_AUTO(name): {
            const nextAuto =
              action.auto !== undefined ? action.auto : !state.auto;
            return { ...state, auto: nextAuto };
          }
          case INCREASE_SLIDER_MAX(name):
            return {
              ...state,
              sliderMax: Math.min(state.sliderMax * 2, 100000000),
            };
          case SET_ALLOW_EXTREME_LOAN(name):
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

export default widget1;
