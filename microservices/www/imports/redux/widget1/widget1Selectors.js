import { createSelector } from 'reselect';
import {
  PURCHASE_TYPE,
  ACQUISITION_FIELDS,
  REFINANCING_FIELDS,
} from './widget1Constants';

const selectWidget1 = state => state.widget1;

export const makeWidget1Selector = name =>
  createSelector(selectWidget1, widget1 => widget1[name]);

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
