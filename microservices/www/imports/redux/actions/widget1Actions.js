import {
  MAX_BORROW_RATIO_PRIMARY_PROPERTY,
  MAX_BORROW_RATIO_WITH_INSURANCE,
} from 'core/config/financeConstants';
import {
  setValueAction,
  makeSelectValue,
  setAllowExtremeLoanAction,
  setAutoAction,
  increaseSliderMaxAction,
  makeWidget1Selector,
  suggestValueAction,
  selectFields,
} from '../reducers/widget1';
import {
  ALL_FIELDS,
  FINAL_STEP,
  PROPERTY,
  CAPPED_FIELDS,
} from '../constants/widget1Constants';
import suggestValue from '../utils/widget1Suggesters';

export const suggestValues = () => (dispatch, getState) => {
  const state = getState();
  const step = makeWidget1Selector('step')(state);
  let suggestActions = [];

  if (step >= FINAL_STEP) {
    suggestActions = selectFields(state).map(NAME =>
      dispatch({
        type: suggestValueAction(NAME),
        value: suggestValue(NAME, state),
      }));
  }

  return Promise.all(suggestActions);
};

export const getPropertyCappedValue = (name, state) => {
  const propertyValue = makeSelectValue(PROPERTY)(state);
  const { allowExtremeLoan } = makeWidget1Selector(name)(state);
  const maxValue = allowExtremeLoan
    ? propertyValue * MAX_BORROW_RATIO_WITH_INSURANCE
    : propertyValue * MAX_BORROW_RATIO_PRIMARY_PROPERTY;

  return Math.floor(maxValue);
};

export const cleanNextValue = (name, nextValue, getState) => {
  if (CAPPED_FIELDS.includes(name)) {
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
        type: setValueAction(name),
        value: cleanNextValue(name, nextValue, getState),
      }))
    .then(() => dispatch(suggestValues()));

export const setAuto = (name, nextAuto) => dispatch =>
  Promise.resolve()
    .then(() => dispatch({ type: setAutoAction(name), auto: nextAuto }))
    .then(() => dispatch(suggestValues()));

export const increaseSliderMax = name => ({
  type: increaseSliderMaxAction(name),
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
    .then(() => dispatch({ type: setValueAction('step'), value: nextStep }))
    .then(() =>
    // Special exception here, as suggestValues only runs once
    // the widget1 is at the FINAL_STEP. Suggest values should be run
    // if the user enters a value here
      willBeFinalStep && dispatch(suggestValues()))
    .then(() => {
      const fields = selectFields(state);
      if (step >= fields.length - 1) {
        dispatch({ type: setValueAction('finishedTutorial'), value: true });
      }
    });
};

export const resetCalculator = () => dispatch =>
  Promise.all(ALL_FIELDS.map((name) => {
    dispatch({ type: setValueAction(name), value: 0 });
    dispatch({ type: setAutoAction(name), auto: true });
  }));

export const setAllowExtremeLoan = name => ({
  type: setAllowExtremeLoanAction(name),
});
