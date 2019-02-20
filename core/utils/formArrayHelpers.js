// @flow
import get from 'lodash/get';

// Returns the current value of an autoForm input
const getCurrentValue = (input, doc) => get(doc, input.id);

type formFieldType = {
  condition?: boolean,
  required?: boolean,
  disabled?: boolean,
  type: string,
};

// shouldCountField - A boolean to determine if a field in an array
// should be counted or not
export const shouldCountField = (formField: formFieldType) =>
  (formField.condition === undefined || formField.condition === true)
  && formField.required !== false
  && !formField.disabled
  && formField.type !== 'h3';

const conditionalInputIsTriggered = (rootField, doc) =>
  getCurrentValue(rootField.inputs[0], doc) === rootField.conditionalTrueValue;

// getCountedArray - Returns an array of values that are mandatory and should
// be counted to determine a completion percentage of a form
export const getCountedArray = (formArray, doc, arr = []) => {
  formArray.forEach((i) => {
    if (shouldCountField(i)) {
      if (i.type === 'conditionalInput') {
        if (conditionalInputIsTriggered(i, doc)) {
          // If the conditional input is triggering the next input, add all values
          i.inputs.forEach(input => arr.push(getCurrentValue(input, doc)));
        } else {
          // If conditional value is not triggering
          arr.push(getCurrentValue(i.inputs[0], doc));
        }
      } else {
        arr.push(getCurrentValue(i, doc));
      }
    }
  });

  return arr;
};

const fieldIsValid = (field, doc) => {
  const currentValue = getCurrentValue(field, doc);
  return currentValue !== undefined;
};

// Returns a list of fields that are missing from the doc, given a form array
// Helps you know which fields still need to be filled
export const getMissingFieldIds = (formArray, doc) =>
  formArray.reduce((missingFieldIds, field) => {
    const { type, id, inputs } = field;
    if (!shouldCountField(field)) {
      return missingFieldIds;
    }

    if (type === 'conditionalInput') {
      const [conditionalField, ...additionalFields] = inputs;
      if (conditionalInputIsTriggered(field, doc)) {
        return [
          ...missingFieldIds,
          ...additionalFields.reduce(
            (missingConditionalFields, additionalField) =>
              (fieldIsValid(additionalField, doc)
                ? missingConditionalFields
                : [...missingConditionalFields, additionalField.id]),
            [],
          ),
        ];
      }

      if (!fieldIsValid(conditionalField, doc)) {
        return [...missingFieldIds, conditionalField.id];
      }

      return missingFieldIds;
    }

    if (!fieldIsValid(field, doc)) {
      return [...missingFieldIds, id];
    }

    return missingFieldIds;
  }, []);
