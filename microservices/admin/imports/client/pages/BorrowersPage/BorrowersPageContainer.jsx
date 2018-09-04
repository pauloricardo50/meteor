import query from 'core/api/borrowers/queries/adminBorrowers';
import { withSmartQuery } from 'core/api';

const BorrowersPageContainer = withSmartQuery({
  query: () => query.clone(),
  queryOptions: { reactive: true },
});

export default BorrowersPageContainer;
