import { connect } from 'react-redux';

import {
  getBorrowRatio,
  getIncomeRatio,
  getFinmaMonthlyCost,
  validateIncomeRatio,
  validateBorrowRatio,
} from 'core/utils/finance';

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

export default connect(({
  widget1: {
    step,
    salary: { value: salary },
    fortune: { value: fortune },
    property: { value: propertyValue },
    interestRate,
  },
}) => {
  const finma = getFinmaValues({ salary, fortune, propertyValue });
  return { step, finma };
});
