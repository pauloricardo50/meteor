import { OWN_FUNDS_ROUNDING_AMOUNT } from '../../../../config/financeConstants';

export const getLabel = (value) => {
  if (value > OWN_FUNDS_ROUNDING_AMOUNT) {
    return 'Financing.requiredOwnFunds.low';
  }
  if (value < -OWN_FUNDS_ROUNDING_AMOUNT) {
    return 'Financing.requiredOwnFunds.high';
  }

  return 'Financing.requiredOwnFunds.valid';
};
