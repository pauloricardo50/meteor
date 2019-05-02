import { withSmartQuery } from 'core/api';
import query from 'core/api/loans/queries/adminLoans';
import { adminLoans } from 'core/api/fragments';

export default withSmartQuery({
  query,
  params: { $body: adminLoans({ withSort: true }) },
  queryOptions: { reactive: false },
  dataName: 'loans',
});
