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
// If all other values are set to `auto: false`, use `all` function,
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

// TODO: !!!
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
    all: () => 0,
    [SALARY]: () => 0,
    [PROPERTY]: () => 0,
  },
};

// Pick the right suggester for `name`
const makeValueSuggester = (
  suggesters,
  name,
  [firstManualKey, secondManualKey],
) => {
  let suggester;
  if (secondManualKey) {
    // Both keys are manual, use `all` suggester
    suggester = suggesters[name].all;
  } else if (!firstManualKey) {
    // If all values are auto, just set them all to 0
    suggester = () => 0;
  } else {
    // Only one value is manual, use it to suggest the other ones
    suggester = suggesters[name][firstManualKey];
  }

  // Make sure we have a fallback suggester
  return suggester || suggesters[name].default;
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
