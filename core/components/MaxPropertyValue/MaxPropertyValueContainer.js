import { withProps, compose, withState } from 'recompose';

import { setMaxPropertyValueWithoutBorrowRatio } from 'core/api/methods';
import Calculator from 'core/utils/Calculator';
import { RESIDENCE_TYPE } from 'core/api/constants';

export const STATE = {
  MISSING_INFOS: 'MISSING_INFOS',
  EMPTY: 'EMPTY',
  DONE: 'DONE',
};

const getState = ({ borrowers, maxPropertyValue }) => {
  if (!Calculator.canCalculateSolvency({ borrowers })) {
    return STATE.MISSING_INFOS;
  }

  if (!maxPropertyValue) {
    return STATE.EMPTY;
  }

  return STATE.DONE;
};

const getInitialCanton = ({ loan }) =>
  loan && loan.maxPropertyValue && loan.maxPropertyValue.canton;

export default compose(
  withState(
    'residenceType',
    'setResidenceType',
    ({ loan: { residenceType } }) =>
      residenceType || RESIDENCE_TYPE.MAIN_RESIDENCE,
  ),
  withState('canton', 'setCanton', getInitialCanton),
  withState('loading', 'setLoading', null),
  withProps(({
    loan: { _id: loanId, borrowers = [], maxPropertyValue },
    setLoading,
    setCanton,
    canton,
  }) => ({
    state: getState({ borrowers, maxPropertyValue }),
    recalculate: () => {
      setLoading(true);
      return setMaxPropertyValueWithoutBorrowRatio
        .run({ canton, loanId })
        .finally(() => setLoading(false));
    },
    onChangeCanton: (_, newCanton) => {
      setCanton(newCanton);
      setLoading(true);
      return setMaxPropertyValueWithoutBorrowRatio
        .run({ canton: newCanton, loanId })
        .finally(() => setLoading(false));
    },
  })),
);
