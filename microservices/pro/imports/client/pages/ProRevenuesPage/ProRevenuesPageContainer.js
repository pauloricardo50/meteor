import { compose } from 'recompose';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import organisationLoans from 'core/api/loans/queries/organisationLoans';

export default compose(withSmartQuery({
  query: organisationLoans,
  queryOptions: { reactive: false },
  dataName: 'loans',
}));
