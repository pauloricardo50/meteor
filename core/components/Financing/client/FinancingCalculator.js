// @flow
import Calc, { FinanceCalculator } from 'core/utils/FinanceCalculator';
import BorrowerCalculator from 'core/utils/Calculator/BorrowerCalculator';
import { makeArgumentMapper } from 'core/utils/MiddlewareManager';
import { getPropertyValue } from './FinancingOwnFunds/ownFundsHelpers.js';

export const getProperty = ({
  structure: { propertyId, promotionOptionId },
  properties,
  promotionOptions,
}) => {
  if (propertyId) {
    return properties.find(({ _id }) => _id === propertyId);
  }
  if (promotionOptionId) {
    return promotionOptions.find(({ _id }) => _id === promotionOptionId);
  }

  return {};
};

export const getOffer = ({ structure: { offerId }, offers }) => {
  if (offerId) {
    return offers.find(({ _id }) => _id === offerId);
  }

  return {};
};

export const getAmortizationRateMapper = (data) => {
  const {
    structure: { wantedLoan, propertyWork },
  } = data;
  return {
    borrowRatio: wantedLoan / (getPropertyValue(data) + propertyWork),
  };
};

const argumentMappings = {
  getIncomeRatio: data => ({
    monthlyIncome: BorrowerCalculator.getTotalIncome(data) / 12,
    monthlyPayment: Calc.getTheoreticalMonthly({
      propAndWork: getPropertyValue(data) + data.structure.propertyWork,
      loanValue: data.structure.wantedLoan,
      amortizationRate: Calc.getAmortizationRateBase(getAmortizationRateMapper(data)),
    }).total,
  }),

  getBorrowRatio: data => ({
    propertyValue: getPropertyValue(data) + data.structure.propertyWork,
    loan: data.structure.wantedLoan,
  }),

  getLoanFromBorrowRatio: (borrowRatio, data) => ({
    propertyValue: getPropertyValue(data) + data.structure.propertyWork,
    borrowRatio,
  }),

  getAmortizationRateBase: getAmortizationRateMapper,

  getInterestsWithTranches: ({
    structure: { loanTranches, offerId },
    offer,
    offers,
  }) => {
    let interestRates;
    if (offer) {
      interestRates = offer;
    } else {
      interestRates = offerId && offers.find(({ _id }) => _id === offerId);
    }

    return { tranches: loanTranches, interestRates };
  },

  getMinCash: data => ({
    propertyValue: getPropertyValue(data),
    propertyWork: data.structure.propertyWork,
    fees: data.structure.notaryFees,
  }),

  getFeesBase: data => ({
    propertyValue: getPropertyValue(data),
    propertyWork: data.structure.propertyWork,
    fees: data.structure.notaryFees,
  }),
};

const argumentMapperMiddleware = makeArgumentMapper(argumentMappings);

export default new FinanceCalculator({
  middlewareObject: argumentMapperMiddleware,
});
