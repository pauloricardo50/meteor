import { withProps, compose, withState } from 'recompose';

import { getMaxPropertyValueWithoutBorrowRatio } from 'core/api/methods';
import Calculator from 'core/utils/Calculator';
import { RESIDENCE_TYPE } from 'core/api/constants';

export const STATE = {
  MISSING_INFOS: 'MISSING_INFOS',
  EMPTY: 'EMPTY',
  DONE: 'DONE',
};

const canCalculateSolvency = ({ borrowers }) => {
  if (!borrowers.length) {
    return false;
  }

  if (Calculator.getTotalFunds({ borrowers }) === 0) {
    return false;
  }

  if (Calculator.getSalary({ borrowers }) === 0) {
    return false;
  }

  return true;
};

const getState = ({ borrowers, maxSolvency }) => {
  if (!canCalculateSolvency({ borrowers })) {
    return STATE.MISSING_INFOS;
  }

  if (!maxSolvency) {
    return STATE.EMPTY;
  }

  return STATE.DONE;
};

export default compose(
  withState(
    'residenceType',
    'setResidenceType',
    ({ loan: { residenceType } }) =>
      residenceType || RESIDENCE_TYPE.MAIN_RESIDENCE,
  ),
  withProps(({ loan: { _id: loanId, borrowers = [], maxSolvency } }) => ({
    state: getState({ borrowers, maxSolvency }),
    calculateSolvency: ({ canton }) =>
      getMaxPropertyValueWithoutBorrowRatio.run({ canton, loanId }),
  })),
);
