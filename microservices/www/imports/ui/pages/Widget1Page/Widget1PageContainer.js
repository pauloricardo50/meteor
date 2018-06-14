import { connect } from 'react-redux';

import {
  getBorrowRatio,
  getRefinancingBorrowRatio,
  getIncomeRatio,
  getFinmaMonthlyCost,
  validateIncomeRatio,
  validateBorrowRatio,
} from 'core/utils/finance';
import { selectFields } from '../../../redux/reducers/widget1';
import { PURCHASE_TYPE } from '../../../redux/constants/widget1Constants';

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
    purchaseType === PURCHASE_TYPE.ACQUISITION
      ? getBorrowRatio(propertyValue, fortune)
      : getRefinancingBorrowRatio(propertyValue, wantedLoan);
  const incomeRatio = getIncomeRatio(salary, finmaMonthlyCost);
  const borrowRuleStatus = validateBorrowRatio(borrowRatio);
  const incomeRuleStatus = validateIncomeRatio(incomeRatio);

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
    fields: selectFields(state),
  };
};

export default connect(mapStateToProps);
