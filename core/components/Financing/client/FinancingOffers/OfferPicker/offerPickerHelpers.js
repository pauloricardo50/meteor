import FinancingCalculator from '../../FinancingCalculator';
import {
  getAmortization,
  getPropertyExpenses,
} from '../../FinancingResult/financingResultHelpers';

export const getAmortizationForStructureWithOffer = props =>
  getAmortization(props);

export const getInterestsForStructureWithOffer = props =>
  (FinancingCalculator.getInterestsWithTranches(props)
    * props.structure.wantedLoan)
  / 12;

export const getMonthlyForStructureWithOffer = (props) => {
  const amort = getAmortizationForStructureWithOffer(props);
  const interests = getInterestsForStructureWithOffer(props);
  const prop = getPropertyExpenses(props);

  return amort + interests + prop;
};
