import React, { useContext, useReducer } from 'react';

import { ERROR, SUCCESS, WARNING } from 'core/api/constants';

import {
  ACTIONS,
  CURRENT_LOAN,
  FORTUNE,
  PROPERTY,
  PURCHASE_TYPE,
  SALARY,
  WANTED_LOAN,
} from './wwwCalculatorConstants';
import {
  getBorrowRatio,
  getFinmaYearlyCost,
  getIncomeRatio,
  getRefinancingBorrowRatio,
  getYearlyCost,
  validateBorrowRatio,
  validateIncomeRatio,
} from './wwwCalculatorMath';
import { setAutoValues, setFieldAt } from './wwwCalculatorSuggestion';

export const initialState = {
  [SALARY]: { sliderMax: 500000, isAuto: true, value: 0 },
  [FORTUNE]: { sliderMax: 500000, isAuto: true, value: 0 },
  [PROPERTY]: { sliderMax: 2000000, isAuto: true, value: 0 },
  [CURRENT_LOAN]: { sliderMax: 2000000, isAuto: true, value: 0 },
  [WANTED_LOAN]: { sliderMax: 2000000, isAuto: true, value: 0 },
  purchaseType: PURCHASE_TYPE.ACQUISITION,
  includeMaintenance: true,
};

export const wwwCalculatorReducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.SET: {
      return { ...state, ...payload };
    }
    case ACTIONS.SET_VALUE: {
      const { at, ...rest } = payload;
      const nextState = setFieldAt(state, at, { isAuto: false, ...rest });

      return setAutoValues(nextState);
    }
    case ACTIONS.SET_AT: {
      const { at, ...rest } = payload;
      return setFieldAt(state, at, rest);
    }
    default:
      return state;
  }
};

const WwwCalculatorContext = React.createContext();

const STATUSES = [SUCCESS, WARNING, ERROR];

const getBorrowError = status =>
  status === ERROR
    ? 'WwwCalculatorStatus.borrowError'
    : 'WwwCalculatorStatus.borrowWarning';
const getIncomeError = status =>
  status === ERROR
    ? 'WwwCalculatorStatus.incomeError'
    : 'WwwCalculatorStatus.incomeWarning';

const getMessage = (worstStatus, index, borrowStatus, incomeStatus) => {
  if (worstStatus === SUCCESS) {
    return 'WwwCalculatorStatus.success';
  }
  if (index === 0) {
    return getBorrowError(borrowStatus);
  }
  return getIncomeError(incomeStatus);
};

// Get the worst of the 2 statuses, if one is error and the other warning
// It should return error.
// Spread the array because reverse() changes the array in place
const getWorstStatus = (values, orderedValues) => {
  const match = [...orderedValues]
    .reverse()
    .find(value => values.indexOf(value) >= 0);
  return { match, index: values.indexOf(match) };
};

const hideFinmaValues = (borrowRatio, incomeRatio) =>
  !(borrowRatio && incomeRatio) ||
  Math.abs(borrowRatio) === Infinity ||
  Math.abs(incomeRatio) === Infinity;

export const WwwCalculatorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wwwCalculatorReducer, initialState);
  const { purchaseType, property, fortune, wantedLoan, salary } = state;
  const yearlyCost = getYearlyCost(state);
  const borrowRatio =
    purchaseType === PURCHASE_TYPE.ACQUISITION
      ? getBorrowRatio(property.value, fortune.value)
      : getRefinancingBorrowRatio(property.value, wantedLoan.value);
  const incomeRatio = getIncomeRatio(
    salary.value,
    getFinmaYearlyCost(property.value, fortune.value, wantedLoan.value).total,
  );
  const borrowRatioStatus = validateBorrowRatio(borrowRatio);
  const incomeRatioStatus = validateIncomeRatio(incomeRatio);
  const statuses = [borrowRatioStatus.status, incomeRatioStatus.status];
  const { match: worstStatus, index } = getWorstStatus(statuses, STATUSES);
  const statusMessageId = getMessage(
    worstStatus,
    index,
    borrowRatioStatus.status,
    incomeRatioStatus.status,
  );
  const hideFinma = hideFinmaValues(borrowRatio, incomeRatio);

  return (
    <WwwCalculatorContext.Provider
      value={[
        {
          ...state,
          ...yearlyCost,
          borrowRatio,
          incomeRatio,
          borrowRatioStatus,
          incomeRatioStatus,
          statusMessageId: !hideFinma && statusMessageId,
          worstStatus,
          hideFinma,
        },
        dispatch,
      ]}
    >
      {children}
    </WwwCalculatorContext.Provider>
  );
};

export const useWwwCalculator = () => useContext(WwwCalculatorContext);
