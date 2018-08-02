import { compose } from 'recompose';

import { FinanceCalculator } from '../FinanceCalculator';
import { withLoanCalculator } from './LoanCalculator';
import { withBorrowerCalculator } from './BorrowerCalculator';
import { withOfferCalculator } from './OfferCalculator';
import { withPropertyCalculator } from './PropertyCalculator';
import { withCombinedCalculator } from './CombinedCalculator';
import { withSelector } from './Selector';

// Put CombinedCalculator first, so that it can modify the following calculators
// with middleware
export const Calculator = compose(
  withCombinedCalculator,
  withLoanCalculator,
  withBorrowerCalculator,
  withPropertyCalculator,
  withOfferCalculator,
  withSelector,
)(FinanceCalculator);

export default new Calculator();
