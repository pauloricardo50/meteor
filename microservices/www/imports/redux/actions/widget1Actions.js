import {
  setValueAction,
  setAutoAction,
  increaseSliderMaxAction,
} from '../reducers/widget1';

export const setValue = (name, value) => ({
  type: setValueAction(name),
  value,
});

export const setAuto = name => ({ type: setAutoAction(name) });

export const increaseSliderMax = name => ({
  type: increaseSliderMaxAction(name),
});
