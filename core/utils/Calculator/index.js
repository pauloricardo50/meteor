import { compose } from 'recompose';

import MiddlewareManager from '../MiddlewareManager';
import { FinanceCalculator } from '../FinanceCalculator';
import { withLoanCalculator } from './LoanCalculator';
import { withBorrowerCalculator } from './BorrowerCalculator';
import { withOfferCalculator } from './OfferCalculator';
import { withPropertyCalculator } from './PropertyCalculator';
import { withCombinedCalculator } from './CombinedCalculator';
import { withSelector } from './Selector';
import { withConfig } from './classUtils';
import {
  financeCalculatorArgumentMapper,
  borrowerExtractorMiddleware,
} from './middleware';

const MappedFinanceCalculator = withConfig({
  middlewareObject: financeCalculatorArgumentMapper,
})(FinanceCalculator);

// Put CombinedCalculator first, so that it can modify the following calculators
// with middleware
export const Calculator = compose(
  withCombinedCalculator,
  withLoanCalculator,
  withBorrowerCalculator || (x => x), // Avoid obscure wallaby circular dependency
  withPropertyCalculator,
  withOfferCalculator,
  withSelector,
)(MappedFinanceCalculator);

class CalculatorWithMiddleWare extends Calculator {
  constructor() {
    super();
    const middlewareManager = new MiddlewareManager(this);
    middlewareManager.applyToAllMethods(borrowerExtractorMiddleware);
  }
}

export default new CalculatorWithMiddleWare({
  // borrowerMiddleware: borrowerExtractorMiddleware,
});
