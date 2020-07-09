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

export const setAutoValues = state => {
  const { purchaseType } = state;
  const fields =
    purchaseType === PURCHASE_TYPE.ACQUISITION
      ? ACQUISITION_FIELDS
      : REFINANCING_FIELDS;
};
