import { withSmartQuery } from 'core/api';
import { adminLoans as query } from 'core/api/loans/queries';
import { adminLoans } from 'core/api/fragments';

export default withSmartQuery({
  query,
  params: { $body: adminLoans({ withSort: true }) },
  queryOptions: { reactive: false },
  dataName: 'loans',
});
