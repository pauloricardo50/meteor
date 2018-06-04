import { compose } from 'recompose';
import {
  SALARY,
  FORTUNE,
  PROPERTY,
  makeSelectValue,
  selectAutoValues,
} from '../reducers/widget1';
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
const suggesters = {
  [SALARY]: {
    both: suggestSalary,
    [FORTUNE]: compose(fortuneToProperty, propertyToSalary),
    [PROPERTY]: propertyToSalary,
  },
  [FORTUNE]: {
    both: suggestFortune,
    [SALARY]: compose(salaryToProperty, propertyToFortune),
    [PROPERTY]: propertyToFortune,
  },
  [PROPERTY]: {
    both: suggestProperty,
    [SALARY]: salaryToProperty,
    [FORTUNE]: fortuneToProperty,
  },
};

// Pick the right suggester for `name`
const makeValueSuggester = (name, [firstManualKey, secondManualKey]) => {
  if (secondManualKey) {
    return suggesters[name].both;
  } else if (!firstManualKey) {
    // If all values are auto, just set them all to 0
    return () => 0;
  }
  return suggesters[name][firstManualKey];
};

const suggestValue = (name, state) => {
  // Get the number value for this name
  const value = makeSelectValue(name)(state);

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
  const suggester = makeValueSuggester(name, manualValueKeys);
  const suggestedValue = suggester(...manualValues);
  return suggestedValue;
};

export default suggestValue;
