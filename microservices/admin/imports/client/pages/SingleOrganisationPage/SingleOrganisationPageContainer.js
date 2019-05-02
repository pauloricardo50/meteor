import { compose } from 'recompose';

import { withSmartQuery } from 'core/api';
import adminOrganisations from 'core/api/organisations/queries/adminOrganisations';
import withMatchParam from 'core/containers/withMatchParam';

export default compose(
  withMatchParam('organisationId'),
  withSmartQuery({
    query: adminOrganisations,
    params: ({ organisationId }) => ({ _id: organisationId }),
    queryOptions: { reactive: true, single: true },
    dataName: 'organisation',
    smallLoader: true,
  }),
);
