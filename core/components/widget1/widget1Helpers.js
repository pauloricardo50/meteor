import { widget1Constants } from '../../redux/widget1';
import {
  getBorrowRatio,
  getRefinancingBorrowRatio,
  getIncomeRatio,
  getFinmaMonthlyCost,
  validateIncomeRatio,
  validateBorrowRatio,
} from './widget1Math';

export const hideFinmaValues = (borrowRatio, incomeRatio) =>
  !(borrowRatio && incomeRatio) ||
  Math.abs(borrowRatio) === Infinity ||
  Math.abs(incomeRatio) === Infinity;

export const getFinmaValues = ({
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
