import Borrowers from '..';
import { BORROWER_QUERIES } from '../borrowerConstants';

export default Borrowers.createQuery(BORROWER_QUERIES.ADMIN_BORROWERS, {
  $filter({ filters, params }) {
    const { searchQuery } = params;
    if (searchQuery) {
      filters.$or = [
        { firstName: { $regex: searchQuery } },
        { lastName: { $regex: searchQuery } },
      ];
    }
  },
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  firstName: 1,
  lastName: 1,
  createdAt: 1,
  updatedAt: 1,
});
