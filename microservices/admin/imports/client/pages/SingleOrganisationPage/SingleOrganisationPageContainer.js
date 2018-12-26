import { compose } from 'recompose';

import { withSmartQuery } from 'core/api';
import adminOrganisation from 'core/api/organisations/queries/adminOrganisation';
import withMatchParam from 'core/containers/withMatchParam';
import organisationFiles from 'core/api/organisations/queries/organisationFiles';
import mergeFilesWithQuery from 'core/api/files/mergeFilesWithQuery';

export default compose(
  withMatchParam('organisationId'),
  withSmartQuery({
    query: adminOrganisation,
    queryOptions: { reactive: true, single: true },
    params: ({ organisationId }) => ({ organisationId }),
    dataName: 'organisation',
    smallLoader: true,
  }),
  mergeFilesWithQuery(
    organisationFiles,
    ({ organisationId }) => ({ organisationId }),
    'organisation',
  ),
);
