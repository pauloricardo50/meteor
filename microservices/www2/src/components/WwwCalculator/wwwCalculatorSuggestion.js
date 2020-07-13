import { compose } from 'recompose';

import {
  ACQUISITION_FIELDS,
  CURRENT_LOAN,
  FORTUNE,
  PROPERTY,
  PURCHASE_TYPE,
  REFINANCING_FIELDS,
  SALARY,
  WANTED_LOAN,
} from './wwwCalculatorConstants';
import {
  fortuneToProperty,
  propertyToFortune,
  propertyToSalary,
  salaryToProperty,
  suggestFortune,
  suggestProperty,
  suggestSalary,
  suggestWantedLoan,
} from './wwwCalculatorMath';

const acquisitionSuggesters = {
  [SALARY]: {
    all: suggestSalary,
    [FORTUNE]: compose(
      propertyToSalary,
      property => ({ property }),
      fortuneToProperty,
    ),
    [PROPERTY]: propertyToSalary,
  },
  [FORTUNE]: {
    all: suggestFortune,
    [SALARY]: compose(
      propertyToFortune,
      property => ({ property }),
      salaryToProperty,
    ),
    [PROPERTY]: propertyToFortune,
  },
  [PROPERTY]: {
    all: suggestProperty,
    [SALARY]: salaryToProperty,
    [FORTUNE]: fortuneToProperty,
  },
};

const refinancingSuggesters = {
  [SALARY]: {
    all: () => 0,
    [WANTED_LOAN]: () => 0,
    [PROPERTY]: () => 0,
  },
  [PROPERTY]: {
    default: () => 0,
  },
  [CURRENT_LOAN]: {
    default: () => 0,
  },
  [WANTED_LOAN]: {
    default: suggestWantedLoan,
  },
};

export const setFieldAt = (state, at, payload) => ({
  ...state,
  [at]: { ...state[at], ...payload },
});

const getSuggesterForField = (suggestersForField, nonAutoFields) => {
  let suggester;
  if (nonAutoFields.length >= 2) {
    suggester = suggestersForField.all;
  } else if (nonAutoFields.length === 0) {
    suggester = () => 0;
  } else {
    suggester = suggestersForField[nonAutoFields[0]];
  }

  return suggester || suggestersForField.default;
};

export const setAutoValues = state => {
  const fields =
    state.purchaseType === PURCHASE_TYPE.ACQUISITION
      ? ACQUISITION_FIELDS
      : REFINANCING_FIELDS;

  const autoFields = fields.filter(field => state[field]?.auto);

  if (autoFields.length === 0) {
    return state;
  }

  const suggesters =
    state.purchaseType === PURCHASE_TYPE.ACQUISITION
      ? acquisitionSuggesters
      : refinancingSuggesters;
  const nonAutoFields = fields.filter(field => !state[field]?.auto);
  const values = fields.reduce(
    (obj, field) => ({ ...obj, [field]: state[field].value }),
    {},
  );

  const nextState = autoFields.reduce((s, field) => {
    const suggestersForField = suggesters[field];
    const suggester = getSuggesterForField(suggestersForField, nonAutoFields);
    const autoValue = Math.round(suggester(values));

    return setFieldAt(s, field, { value: autoValue });
  }, state);

  return nextState;
};
