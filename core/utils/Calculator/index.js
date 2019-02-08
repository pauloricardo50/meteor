import { compose } from 'recompose';

import { FinanceCalculator } from '../FinanceCalculator';
import { withLoanCalculator } from './LoanCalculator';
import { withBorrowerCalculator } from './BorrowerCalculator';
import { withOfferCalculator } from './OfferCalculator';
import { withPropertyCalculator } from './PropertyCalculator';
import { withPromotionCalculator } from './PromotionCalculator';
import { withCombinedCalculator } from './CombinedCalculator';
import { withSelector } from './Selector';
import { withLenderRulesInitializator } from './LenderRulesInitializator';
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
  withLenderRulesInitializator,
  withCombinedCalculator,
  withPromotionCalculator,
  withLoanCalculator,
  withBorrowerCalculator,
  withPropertyCalculator,
  withOfferCalculator,
  withSelector,
)(MappedFinanceCalculator);

export default new Calculator({
  borrowerMiddleware: borrowerExtractorMiddleware,
});
