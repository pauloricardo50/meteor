import { connect } from 'react-redux';

import {
  getBorrowRatio,
  getIncomeRatio,
  getFinmaMonthlyCost,
  validateIncomeRatio,
  validateBorrowRatio,
} from 'core/utils/finance';
import { selectFields } from '../../../redux/reducers/widget1';

const getFinmaValues = ({ salary, fortune, propertyValue }) => {
  const { totalMonthly: finmaMonthlyCost } = getFinmaMonthlyCost(
    propertyValue,
    fortune,
  );
  const borrowRatio = getBorrowRatio(propertyValue, fortune);
  const incomeRatio = getIncomeRatio(salary, finmaMonthlyCost);
  const borrowRuleStatus = validateBorrowRatio(borrowRatio);
  const incomeRuleStatus = validateIncomeRatio(incomeRatio);

  return {
    borrowRule: { value: borrowRatio, ...borrowRuleStatus },
    incomeRule: { value: incomeRatio, ...incomeRuleStatus },
    finmaMonthlyCost,
  };
};

const mapStateToProps = (state) => {
  const {
    widget1: {
      step,
      finishedTutorial,
      salary: { value: salary },
      fortune: { value: fortune },
      property: { value: propertyValue },
    },
  } = state;
  const finma = getFinmaValues({ salary, fortune, propertyValue });
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
