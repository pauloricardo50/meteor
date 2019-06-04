import omit from 'lodash/omit';

import Loans from '../loans';
import { LOAN_QUERIES } from '../loanConstants';
import { userLoan } from '../../fragments';

export default Loans.createQuery(
  LOAN_QUERIES.ANONYMOUS_LOAN,
  { ...omit(userLoan(), ['maxPropertyValue']), maxPropertyValueExists: 1 },
  { scoped: true },
);
