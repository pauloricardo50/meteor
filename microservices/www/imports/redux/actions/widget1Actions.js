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

export const setValue = (name, value) => (dispatch) => {
  dispatch({ type: setValueAction(name), value });
  dispatch(suggestValues());
};

export const setAuto = name => (dispatch) => {
  dispatch({ type: setAutoAction(name) });
  dispatch(suggestValues());
};

export const increaseSliderMax = name => ({
  type: increaseSliderMaxAction(name),
});
