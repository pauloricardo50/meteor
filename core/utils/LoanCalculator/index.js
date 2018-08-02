import { compose } from 'recompose';

import { FinanceCalculator } from '../FinanceCalculator';
import { withLoanCalculator } from './LoanCalculator';
import { withBorrowerCalculator } from './BorrowerCalculator';
import { withOfferCalculator } from './OfferCalculator';
import { withPropertyCalculator } from './PropertyCalculator';

// Put LoanCalculator first, so that it can modify the following calculators
// with middleware
export const Calculator = compose(
  withLoanCalculator,
  withBorrowerCalculator,
  withPropertyCalculator,
  withOfferCalculator,
)(FinanceCalculator);

export default new Calculator();
