import Calculator from '../../../../../utils/Calculator';
import FinancingCalculator from '../../FinancingCalculator';
import { getPropertyExpenses } from '../../FinancingResult/financingResultHelpers';

export const getAmortizationForStructureWithOffer = ({
  loan,
  structureId,
  offer,
}) =>
  Calculator.getAmortization({
    loan,
    structureId,
    offerOverride: offer,
  });

export const getInterestsForStructureWithOffer = props =>
  (FinancingCalculator.getInterestsWithTranches(props) *
    props.structure.wantedLoan) /
  12;

export const getMonthlyForStructureWithOffer = props => {
  const amort = getAmortizationForStructureWithOffer(props);
  const interests = getInterestsForStructureWithOffer(props);
  const prop = getPropertyExpenses(props);

  return amort + interests + prop;
};
