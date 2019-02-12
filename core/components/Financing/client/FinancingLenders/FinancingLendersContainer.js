import { withSmartQuery } from '../../../../api';
import userOrganisations from '../../../../api/organisations/queries/userOrganisations';

export default withSmartQuery({
  query: userOrganisations,
  queryOptions: { reactive: false, single: false, shouldRefetch: () => false },
  dataName: 'organisations',
  refetchOnMethodCall: false,
});
