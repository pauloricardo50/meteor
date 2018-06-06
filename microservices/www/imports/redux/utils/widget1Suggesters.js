import { compose } from 'recompose';
import {
  makeSelectValue,
  selectAutoValues,
  makeWidget1Selector,
} from '../reducers/widget1';
import {
  SALARY,
  FORTUNE,
  PROPERTY,
  CURRENT_LOAN,
  WANTED_LOAN,
  PURCHASE_TYPE,
} from '../constants/widget1Constants';
import {
  suggestSalary,
  suggestFortune,
  suggestProperty,
  fortuneToProperty,
  propertyToSalary,
  salaryToProperty,
  propertyToFortune,
} from './widget1Functions';

// For each name, there are 3 suggesters, based on which other values are
// currently set to `auto` or not.
// If both other values are set to `auto: false`, use `both` function,
// otherwise use the 2nd or 3rd function
const acquisitionSuggesters = {
  [SALARY]: {
    all: suggestSalary,
    [FORTUNE]: compose(fortuneToProperty, propertyToSalary),
    [PROPERTY]: propertyToSalary,
  },
  [FORTUNE]: {
    all: suggestFortune,
    [SALARY]: compose(salaryToProperty, propertyToFortune),
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
    both: suggestSalary,
    [FORTUNE]: compose(fortuneToProperty, propertyToSalary),
    [PROPERTY]: propertyToSalary,
  },
  [PROPERTY]: {
    both: suggestProperty,
    [SALARY]: salaryToProperty,
    [FORTUNE]: fortuneToProperty,
  },
  [CURRENT_LOAN]: {
    both: suggestProperty,
    [SALARY]: salaryToProperty,
    [FORTUNE]: fortuneToProperty,
  },
  [WANTED_LOAN]: {
    both: suggestProperty,
    [SALARY]: salaryToProperty,
    [FORTUNE]: fortuneToProperty,
  },
};

// Pick the right suggester for `name`
const makeValueSuggester = (
  suggesters,
  name,
  [firstManualKey, secondManualKey],
) => {
  if (secondManualKey) {
    return suggesters[name].all;
  } else if (!firstManualKey) {
    // If all values are auto, just set them all to 0
    return () => 0;
  }
  return suggesters[name][firstManualKey];
};

export const makeSuggestValue = suggesters => (name, state) => {
  // Get the number value for this name
  const value = makeSelectValue(name)(state);
  const purchaseType = makeWidget1Selector('purchaseType')(state);

  // Get an object with all the auto values for every key
  // The auto value for the current name should be true
  const autoValues = selectAutoValues(state);
  const thisValueIsManual = !autoValues[name];

  if (thisValueIsManual) {
    return value;
  }

  // Get an array of the keys that are manual and should be used to compute
  // the next value
  const manualValueKeys = Object.keys(autoValues).filter(key => !autoValues[key]);
  const manualValues = manualValueKeys.map(key => makeSelectValue(key)(state));
  const suggester = makeValueSuggester(
    suggesters[purchaseType],
    name,
    manualValueKeys,
  );
  const suggestedValue = suggester(...manualValues);
  return suggestedValue;
};

export default makeSuggestValue({
  [PURCHASE_TYPE.REFINANCING]: refinancingSuggesters,
  [PURCHASE_TYPE.ACQUISITION]: acquisitionSuggesters,
});
