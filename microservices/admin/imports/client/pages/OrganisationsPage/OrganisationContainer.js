import { compose, withProps } from 'recompose';
import { organisationUpdate } from 'core/api';
import organisationFiles from 'core/api/organisations/queries/organisationFiles';
import mergeFilesWithQuery from 'imports/core/api/files/mergeFilesWithQuery';

export default compose(
  mergeFilesWithQuery(
    organisationFiles,
    ({ organisation: { _id: organisationId } }) => ({ organisationId }),
    'organisation',
  ),
  withProps(({ organisation: { _id: organisationId } }) => ({
    updateOrganisation: object =>
      organisationUpdate.run({ organisationId, object }),
  })),
);
