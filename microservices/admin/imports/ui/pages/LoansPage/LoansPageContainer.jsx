import { withSmartQuery } from 'core/api';
import query from 'core/api/loans/queries/adminLoans';

export default withSmartQuery({
  query: () => query.clone(),
  queryOptions: { reactive: true },
});
