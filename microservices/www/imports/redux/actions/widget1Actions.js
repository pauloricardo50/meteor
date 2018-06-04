import {
  setValueAction,
  setAutoAction,
  increaseSliderMaxAction,
  makeWidget1Selector,
  suggestValueAction,
  NAMES,
  FINAL_STEP,
} from '../reducers/widget1';
import suggestValue from '../utils/widget1Suggesters';

export const suggestValues = () => (dispatch, getState) => {
  const state = getState();
  const step = makeWidget1Selector('step')(state);
  let suggestActions = [];

  if (step >= FINAL_STEP) {
    suggestActions = NAMES.map(NAME =>
      dispatch({
        type: suggestValueAction(NAME),
        value: suggestValue(NAME, state),
      }));
  }

  return Promise.all(suggestActions);
};

export const setValue = (name, nextValue) => dispatch =>
  Promise.resolve()
    .then(() => dispatch({ type: setValueAction(name), value: nextValue }))
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
  if (step <= nextStep) {
    const willBeFinalStep = nextStep === FINAL_STEP;
    return Promise.resolve()
      .then(() => dispatch({ type: 'step_SET', value: nextStep }))
      .then(() =>
      // Special exception here, as suggestValues only runs once
      // the widget1 is at the FINAL_STEP. Suggest values should be run
      // if the user enters a value here
        willBeFinalStep && dispatch(suggestValues()));
  }

  return Promise.resolve();
};

export const resetCalculator = () => dispatch =>
  Promise.all(NAMES.map((name) => {
    dispatch({ type: setValueAction(name), value: 0 });
    dispatch({ type: setAutoAction(name), auto: true });
  }));
