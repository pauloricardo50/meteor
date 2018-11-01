import { withSmartQuery } from 'core/api';
import query from 'core/api/loans/queries/adminLoans';

export default withSmartQuery({
  query,
  queryOptions: { reactive: false },
  dataName: 'loans',
});
