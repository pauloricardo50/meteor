import query from 'core/api/loans/queries/adminLoan';
import { withSmartQuery } from 'core/api';

export default withSmartQuery({
  query: ({ match }) => query.clone({ _id: match.params.loanId }),
  queryOptions: { reactive: true, single: true },
  dataName: 'loan',
});
