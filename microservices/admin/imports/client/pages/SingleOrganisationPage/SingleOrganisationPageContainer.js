import { compose } from 'recompose';

import { withSmartQuery } from 'core/api';
import { adminOrganisations } from 'core/api/organisations/queries';
import withMatchParam from 'core/containers/withMatchParam';

export default compose(
  withMatchParam('organisationId'),
  withSmartQuery({
    query: adminOrganisations,
    params: ({ organisationId }) => ({ _id: organisationId }),
    queryOptions: { single: true },
    dataName: 'organisation',
  }),
);
