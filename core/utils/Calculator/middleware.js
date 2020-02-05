//

// Map loan onto FinanceCalculator

import { makeArgumentMapper } from '../MiddlewareManager';
import memoizeOne from '../memoizeOne';
import { arrayify } from '../general';

const argumentMappings = {};

export const financeCalculatorArgumentMapper = makeArgumentMapper(
  argumentMappings,
);

export const borrowerExtractorMiddleware = () => next => (params, ...args) => {
  const { borrowers, loan: { borrowers: loanBorrowers } = {} } = params || {};

  const finalBorrowers = borrowers || loanBorrowers;

  return next(
    typeof params === 'object' && !Array.isArray(params)
      ? { ...params, borrowers: arrayify(finalBorrowers) }
      : params,
    ...args,
  );
};

export const memoizeMiddleware = () => next => {
  const memoFunc = memoizeOne(next);
  return memoFunc;
};
