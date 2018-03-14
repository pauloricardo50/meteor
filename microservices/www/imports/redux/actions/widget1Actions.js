import {
  setValueAction,
  resetValueAction,
  setAutoAction,
  setManualAction,
} from '../reducers/widget1';

export const setValue = (name, value) => ({
  type: setValueAction(name),
  value,
});

export const setAuto = name => ({ type: setAutoAction(name) });
