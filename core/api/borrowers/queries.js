import { BORROWER_QUERIES } from './borrowerConstants';
import Borrowers from '.';

export const borrowerSearch = Borrowers.createQuery(
  BORROWER_QUERIES.BORROWER_SEARCH,
  {
    name: 1,
    createdAt: 1,
    updatedAt: 1,
    age: 1,
    $options: { sort: { createdAt: -1 }, limit: 5 },
  },
);
