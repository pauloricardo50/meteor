import { createSelector, createStructuredSelector } from 'reselect';
import {
  PURCHASE_TYPE,
  ACQUISITION_FIELDS,
  REFINANCING_FIELDS,
} from './widget1Constants';

const selectWidget1 = state => state.widget1;

const selectState = state => state;

export const makeWidget1Selector = name =>
  createSelector(selectWidget1, widget1 => widget1[name]);

export const makeSelectValue = name =>
  createSelector(
    makeWidget1Selector(name),
    widget1Object => widget1Object.value,
  );

export const makeSelectAuto = name =>
  createSelector(
    makeWidget1Selector(name),
    widget1Object => widget1Object.auto,
  );

export const selectFields = createSelector(
  makeWidget1Selector('purchaseType'),
  purchaseType =>
    purchaseType === PURCHASE_TYPE.ACQUISITION
      ? ACQUISITION_FIELDS
      : REFINANCING_FIELDS,
);

const pickAutoValues = (state, fields) =>
  createStructuredSelector(
    fields.reduce(
      (acc, name) => ({ ...acc, [name]: makeSelectAuto(name) }),
      {},
    ),
  )(state);

export const selectAutoValues = createSelector(
  [selectState, selectFields],
  pickAutoValues,
);
