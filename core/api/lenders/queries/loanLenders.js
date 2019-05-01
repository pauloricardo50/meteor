import Lenders from '../lenders';
import { lender } from '../../fragments';
import { LENDERS_QUERIES } from '../lenderConstants';

// Insert your query here
// Example
export default Lenders.createQuery(LENDERS_QUERIES.LOAN_LENDERS, {
  ...lender(),
  $options: { sort: { createdAt: -1 } },
});
