import { connect } from 'react-redux';

import {
  getBorrowRatio,
  getRefinancingBorrowRatio,
  getIncomeRatio,
  getFinmaMonthlyCost,
  validateIncomeRatio,
  validateBorrowRatio,
} from 'core/utils/finance';
import { widget1Selectors, widget1Constants } from '../../../redux/widget1';

export const hideFinmaValues = (borrowRatio, incomeRatio) =>
  !(borrowRatio && incomeRatio) ||
  Math.abs(borrowRatio) === Infinity ||
  Math.abs(incomeRatio) === Infinity;

const getFinmaValues = ({
  salary,
  fortune,
  wantedLoan,
  propertyValue,
  purchaseType,
}) => {
  const { totalMonthly: finmaMonthlyCost } = getFinmaMonthlyCost(
    propertyValue,
    fortune,
    wantedLoan,
  );
  const borrowRatio =
    purchaseType === widget1Constants.PURCHASE_TYPE.ACQUISITION
      ? getBorrowRatio(propertyValue, fortune)
      : getRefinancingBorrowRatio(propertyValue, wantedLoan);
  const incomeRatio = getIncomeRatio(salary, finmaMonthlyCost);
  const borrowRuleStatus = validateBorrowRatio(borrowRatio);
  const incomeRuleStatus = validateIncomeRatio(incomeRatio);

  if (hideFinmaValues(borrowRatio, incomeRatio)) {
    return {
      borrowRule: { value: 0, ...borrowRuleStatus },
      incomeRule: { value: 0, ...incomeRuleStatus },
      finmaMonthlyCost: 0,
    };
  }

  return {
    borrowRule: { value: borrowRatio, ...borrowRuleStatus },
    incomeRule: { value: incomeRatio, ...incomeRuleStatus },
    finmaMonthlyCost,
  };
};

export const mapStateToProps = (state) => {
  const {
    widget1: {
      step,
      finishedTutorial,
      salary: { value: salary },
      fortune: { value: fortune },
      property: { value: propertyValue },
      wantedLoan: { value: wantedLoan },
      purchaseType,
    },
  } = state;
  const finma = getFinmaValues({
    salary,
    fortune,
    propertyValue,
    purchaseType,
    wantedLoan,
  });
  return {
    step,
    finishedTutorial,
    finma,
    salary,
    fortune,
    propertyValue,
    fields: widget1Selectors.selectFields(state),
  };
};

export default connect(mapStateToProps);
