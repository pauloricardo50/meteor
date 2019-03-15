import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import organisationLoans from 'core/api/loans/queries/organisationLoans';

export default withSmartQuery({
  query: organisationLoans,
  queryOptions: { reactive: false },
  dataName: 'loans',
});
