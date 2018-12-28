import Lenders from '../lenders';
import { lenderFragment } from './lendersFragments';
import { LENDERS_QUERIES } from '../lenderConstants';

// Insert your query here
// Example
export default Lenders.createQuery(LENDERS_QUERIES.LOAN_LENDERS, {
  $filter({ filters, params }) {
    filters['loanLink._id'] = params.loanId;
  },
  ...lenderFragment,
  $options: { sort: { createdAt: -1 } },
});
