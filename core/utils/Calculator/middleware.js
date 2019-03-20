// @flow

// Map loan onto FinanceCalculator

import { makeArgumentMapper } from '../MiddlewareManager';

const argumentMappings = {};

export const financeCalculatorArgumentMapper = makeArgumentMapper(argumentMappings);

export const borrowerExtractorMiddleware = () => next => (params, ...args) => {
  if (params && params.loan && !params.borrowers) {
    return next({ ...params, borrowers: params.loan.borrowers }, ...args);
  }
  return next(params, ...args);
};
