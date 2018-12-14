import { compose } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit/index';
import query from 'core/api/organisations/queries/adminOrganisation';
import withMatchParam from 'core/containers/withMatchParam';
import organisationFiles from 'core/api/organisations/queries/organisationFiles';
import mergeFilesWithQuery from 'imports/core/api/files/mergeFilesWithQuery';

export default compose(
  withMatchParam('organisationId'),
  withSmartQuery({
    query,
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
