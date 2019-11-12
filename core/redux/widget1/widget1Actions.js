import {
  MAX_BORROW_RATIO_PRIMARY_PROPERTY,
  MAX_BORROW_RATIO_WITH_PLEDGE,
} from 'core/config/financeConstants';
import * as types from './widget1Types';
import {
  makeWidget1Selector,
  selectFields,
  makeSelectValue,
} from './widget1Selectors';
import {
  ALL_FIELDS,
  FINAL_STEP,
  PROPERTY,
  CAPPED_FIELDS,
  CURRENT_LOAN,
  PURCHASE_TYPE,
} from './widget1Constants';
import suggestValue from './widget1Suggestion';
import { commonTypes } from '../common';

export const suggestValues = () => (dispatch, getState) => {
  const state = getState();
  const step = makeWidget1Selector('step')(state);
  let suggestActions = [];

  if (step >= FINAL_STEP) {
    suggestActions = selectFields(state).map(NAME =>
      dispatch({
        type: types.SUGGEST_VALUE(NAME),
        value: suggestValue(NAME, state),
      }),
    );
  }

  return Promise.all(suggestActions);
};

export const getPropertyCappedValue = (name, state) => {
  const propertyValue = makeSelectValue(PROPERTY)(state);
  const { allowExtremeLoan } = makeWidget1Selector(name)(state);
  const maxValue = allowExtremeLoan
    ? propertyValue * MAX_BORROW_RATIO_WITH_PLEDGE
    : propertyValue * MAX_BORROW_RATIO_PRIMARY_PROPERTY;

  return Math.floor(maxValue);
};

const shouldCapValue = (name, nextValue) =>
  CAPPED_FIELDS.includes(name) && nextValue !== '';

export const cleanNextValue = (name, nextValue, getState) => {
  if (shouldCapValue(name, nextValue)) {
    const state = getState();
    const maxValue = getPropertyCappedValue(name, state);

    return Math.min(nextValue, maxValue);
  }

  return nextValue;
};

export const setValue = (name, nextValue) => (dispatch, getState) =>
  Promise.resolve()
    .then(() =>
      dispatch({
        type: types.SET_VALUE(name),
        value: cleanNextValue(name, nextValue, getState),
      }),
    )
    .then(() => dispatch(suggestValues()));

export const setAuto = (name, nextAuto) => dispatch =>
  Promise.resolve()
    .then(() => dispatch({ type: types.SET_AUTO(name), auto: nextAuto }))
    .then(() => dispatch(suggestValues()));

export const increaseSliderMax = name => ({
  type: types.INCREASE_SLIDER_MAX(name),
});

export const setStep = nextStep => (dispatch, getState) => {
  const state = getState();
  const step = makeWidget1Selector('step')(state);

  // Only set the step if we're not going down
  if (step > nextStep) {
    return Promise.resolve();
  }

  const willBeFinalStep = nextStep === FINAL_STEP;
  return Promise.resolve()
    .then(() =>
      dispatch({ type: commonTypes.SET_VALUE('step'), value: nextStep }),
    )
    .then(
      () =>
        // Special exception here, as suggestValues only runs once
        // the widget1 is at the FINAL_STEP. Suggest values should be run
        // if the user enters a value here
        willBeFinalStep && dispatch(suggestValues()),
    )
    .then(() => {
      const fields = selectFields(state);
      if (step >= fields.length - 1) {
        dispatch({
          type: commonTypes.SET_VALUE('finishedTutorial'),
          value: true,
        });
      }
    });
};

export const resetCalculator = () => (dispatch, getState) => {
  const state = getState();
  const purchaseType = makeWidget1Selector('purchaseType')(state);

  return Promise.all(
    ALL_FIELDS.map(name => {
      dispatch({ type: types.SET_VALUE(name), value: 0 });
      dispatch({ type: types.SET_AUTO(name), auto: true });
    }),
  ).then(() => {
    if (purchaseType === PURCHASE_TYPE.REFINANCING) {
      // Keep property and current loan to false during refinancing
      dispatch({ type: types.SET_AUTO(PROPERTY), auto: false });
      dispatch({ type: types.SET_AUTO(CURRENT_LOAN), auto: false });
    }
  });
};

export const setAllowExtremeLoan = name => ({
  type: types.SET_ALLOW_EXTREME_LOAN(name),
});
