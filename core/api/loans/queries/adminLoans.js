import Loans from '../loans';
import { LOAN_QUERIES } from '../loanConstants';
import { adminLoan } from '../../fragments';

export default Loans.createQuery(
  LOAN_QUERIES.ADMIN_LOANS,
  {
    ...adminLoan({ withSort: true }),
    $options: { sort: { createdAt: -1 } },
  },
  { scoped: true },
);
