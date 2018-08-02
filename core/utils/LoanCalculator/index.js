import { compose } from 'recompose';

import FinanceCalculator from '../FinanceCalculator';
import { withLoanCalculator } from './LoanCalculator';
import { withBorrowerCalculator } from './BorrowerCalculator';
import { withOfferCalculator } from './OfferCalculator';
import { withPropertyCalculator } from './PropertyCalculator';

export const Calculator = compose(
  withLoanCalculator, // Put LoanCalculator first
  withBorrowerCalculator,
  withPropertyCalculator,
  withOfferCalculator,
)(FinanceCalculator);

export default new Calculator();
