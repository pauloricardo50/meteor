// @flow
import {
  getPropertyArray,
  getPropertyLoanArray,
} from '../arrays/PropertyFormArray';
import { getPercent } from './general';
import { getCountedArray } from './formArrayHelpers';

// propertyPercent - Determines the completion rate of the property forms
export const propertyPercent = (loan, borrowers, property) => {
  const formArray1 = getPropertyArray({ loan, borrowers, property });
  const formArray2 = getPropertyLoanArray({
    loan,
    borrowers,
    property,
  });

  let a = getCountedArray(formArray1, property);
  a = [...a, getCountedArray(formArray2, loan)];

  return getPercent(a);
};
