import { compose } from 'core/api/containerToolkit';
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

const makeValueSuggester = (name, [firstManualKey, secondManualKey]) => {
  if (secondManualKey) {
    return suggesters[name].both;
  }
  return suggesters[name][firstManualKey];
};

const suggestValue = (name, state) => {
  // Get the number value for this name
  const value = makeSelectValue(name)(state);

  // Get an object with all the auto values for every key
  // The auto value for the current name should be true
  const autoValues = selectAutoValues(state);
  if (!autoValues[name]) {
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
