import { compose, withProps } from 'recompose';
import { organizationUpdate } from 'core/api';
import organizationFiles from 'core/api/organizations/queries/organizationFiles';
import mergeFilesWithQuery from 'imports/core/api/files/mergeFilesWithQuery';

export default compose(
  mergeFilesWithQuery(
    organizationFiles,
    ({ organization: { _id: organizationId } }) => ({ organizationId }),
    'organization',
  ),
  withProps(({ organization: { _id: organizationId } }) => ({
    updateOrganization: object =>
      organizationUpdate.run({ organizationId, object }),
  })),
);
