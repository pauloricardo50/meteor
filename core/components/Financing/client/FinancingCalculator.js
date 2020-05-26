import Calculator from '../../../utils/Calculator';
import { FinanceCalculator } from '../../../utils/FinanceCalculator';
import { makeArgumentMapper } from '../../../utils/MiddlewareManager/index';

export const getInterestRates = ({ structureId, loan, offer }) => {
  const { offerId } = Calculator.selectStructure({
    loan,
    structureId,
  });
  let interestRates;
  if (offer) {
    interestRates = offer;
  } else if (offerId) {
    interestRates = Calculator.selectOffer({
      loan,
      structureId,
    });
  } else {
    interestRates = loan.currentInterestRates;
  }

  return interestRates;
};

const argumentMappings = {
  getInterestsWithTranches: data => {
    const { loan, structureId } = data;
    const { loanTranches } = Calculator.selectStructure({
      loan,
      structureId,
    });

    return { tranches: loanTranches, interestRates: getInterestRates(data) };
  },
};

const argumentMapperMiddleware = makeArgumentMapper(argumentMappings);

export default new FinanceCalculator({
  middlewareObject: argumentMapperMiddleware,
});
