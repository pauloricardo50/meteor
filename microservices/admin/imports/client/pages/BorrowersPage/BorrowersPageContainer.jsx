import query from 'core/api/borrowers/queries/adminBorrowers';
import { withSmartQuery } from 'core/api';

const BorrowersPageContainer = withSmartQuery({
  query,
  queryOptions: { reactive: true },
});

export default BorrowersPageContainer;
