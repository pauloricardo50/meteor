import Borrowers from '..';
import { BORROWER_QUERIES } from '../borrowerConstants';
import { adminBorrowerFragment } from './borrowerFragments';

export default Borrowers.createQuery(BORROWER_QUERIES.BORROWER, {
  $filter({ filters, params }) {
    filters._id = params._id;
  },
  ...adminBorrowerFragment,
});
