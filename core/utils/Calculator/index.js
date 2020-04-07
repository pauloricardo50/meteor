import { compose } from 'recompose';

import { FinanceCalculator } from '../FinanceCalculator';
import { withBorrowerCalculator } from './BorrowerCalculator';
import { withConfig } from './classUtils';
import { withCombinedCalculator } from './CombinedCalculator';
import { withLenderRulesInitializator } from './LenderRulesInitializator';
import { withLoanCalculator } from './LoanCalculator';
import { financeCalculatorArgumentMapper } from './middleware';
import { withOfferCalculator } from './OfferCalculator';
import { withPromotionCalculator } from './PromotionCalculator';
import { withPropertyCalculator } from './PropertyCalculator';
import { withSelector } from './Selector';
import { withSolvencyCalculator } from './SolvencyCalculator';

const MappedFinanceCalculator = withConfig({
  middlewareObject: financeCalculatorArgumentMapper,
})(FinanceCalculator);

// Put CombinedCalculator first, so that it can modify the following calculators
// with middleware
export const Calculator = compose(
  withLenderRulesInitializator,
  withSolvencyCalculator,
  withCombinedCalculator,
  withPromotionCalculator,
  withLoanCalculator,
  withBorrowerCalculator,
  withPropertyCalculator,
  withOfferCalculator,
  withSelector,
)(MappedFinanceCalculator);

export default new Calculator({});
