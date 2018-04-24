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

  if (step >= FINAL_STEP) {
    NAMES.forEach(NAME =>
      dispatch({
        type: suggestValueAction(NAME),
        value: suggestValue(NAME, state),
      }));
  }
};

export const setValue = (name, nextValue) => (dispatch) => {
  dispatch({ type: setValueAction(name), value: nextValue });
  dispatch(suggestValues());
};

export const setAuto = (name, nextAuto) => (dispatch) => {
  dispatch({ type: setAutoAction(name), auto: nextAuto });
  dispatch(suggestValues());
};

export const increaseSliderMax = name => ({
  type: increaseSliderMaxAction(name),
});

export const setStep = nextStep => (dispatch, getState) => {
  const state = getState();
  const step = makeWidget1Selector('step')(state);

  // Only set the step if we're not going down
  if (step <= nextStep) {
    dispatch({ type: 'step_SET', value: nextStep });
    const willBeFinalStep = nextStep === FINAL_STEP;
    if (willBeFinalStep) {
      // Special exception here, as suggestValues only runs once
      // the widget1 is at the FINAL_STEP. Suggest values should be run
      // if the user enters a value here
      dispatch(suggestValues());
    }
  }
};

export const resetCalculator = () => (dispatch) => {
  NAMES.forEach((name) => {
    dispatch({ type: setValueAction(name), value: undefined });
    dispatch({ type: setAutoAction(name), auto: true });
  });
};
