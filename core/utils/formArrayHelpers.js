//      
import get from 'lodash/get';

import { arrayify, simpleHash } from './general';

// Returns the current value of an autoForm input
const getCurrentValue = (input, doc) => get(doc, input.progressReplacementId || input.id);

                      
                      
                     
                     
               
  

// shouldCountField - A boolean to determine if a field in an array
// should be counted or not
export const shouldCountField = (formField               ) =>
  (formField.condition === undefined || formField.condition === true) &&
  formField.required !== false &&
  !formField.disabled &&
  formField.type !== 'h3';

const conditionalInputIsTriggered = (rootField, doc) =>
  getCurrentValue(rootField.inputs[0], doc) === rootField.conditionalTrueValue;

// getCountedArray - Returns an array of values that are mandatory and should
// be counted to determine a completion percentage of a form
export const getCountedArray = (formArray, doc, shouldCountAllFields) => {
  const arr = [];

  formArray.forEach(i => {
    if (shouldCountAllFields || shouldCountField(i)) {
      if (i.type === 'conditionalInput') {
        if (conditionalInputIsTriggered(i, doc)) {
          // If the conditional input is triggering the next input, add all values
          i.inputs.forEach(input => {
            if (shouldCountField(input)) {
              arr.push(getCurrentValue(input, doc));
            }
          });
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

  if (Array.isArray(currentValue)) {
    return currentValue.length > 0;
  }

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
            (missingConditionalFields, additionalField) => {
              if (
                fieldIsValid(additionalField, doc) ||
                !shouldCountField(additionalField)
              ) {
                return missingConditionalFields;
              }

              return [...missingConditionalFields, additionalField.id];
            },
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

export const getRequiredFieldIds = (formArray, doc) =>
  formArray.reduce((fieldIds, field) => {
    const { type, id, inputs } = field;

    if (!shouldCountField(field)) {
      return fieldIds;
    }

    if (type === 'conditionalInput') {
      const [conditionalField, ...additionalFields] = inputs;
      if (conditionalInputIsTriggered(field, doc)) {
        return [
          ...fieldIds,
          ...additionalFields.reduce((conditionalFields, additionalField) => {
            if (!shouldCountField(additionalField)) {
              return [...conditionalFields];
            }
            return [...conditionalFields, additionalField.id];
          }, []),
        ];
      }

      return [...fieldIds, conditionalField.id];
    }

    return [...fieldIds, id];
  }, []);

/**
 * Returns the hash of a form's values
 *
 * @param {Array} formArray
 * @param {Object} doc
 * @returns {Number} 32-bit integer hash
 */
export const getFormValuesHash = (formArray, doc) => {
  const values = getCountedArray(formArray, doc, true);

  return simpleHash(values);
};

// Sums multiple hashes together from multiple forms
export const getFormValuesHashMultiple = combos =>
  combos.reduce(
    (tot, { formArray, doc }) => tot + getFormValuesHash(formArray, doc),
    0,
  );
