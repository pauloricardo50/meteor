import { compose } from 'recompose';

import proProperty from 'core/api/properties/queries/proProperty';
import propertyFiles from 'core/api/properties/queries/propertyFiles';
import { withSmartQuery } from 'core/api/containerToolkit';
import withMatchParam from 'core/containers/withMatchParam';
import mergeFilesWithQuery from 'core/api/files/mergeFilesWithQuery';

export default compose(
  withMatchParam('propertyId'),
  withSmartQuery({
    query: proProperty,
    params: ({ propertyId }) => ({ propertyId }),
    queryOptions: { single: true, reactive: false },
    dataName: 'property',
  }),
  mergeFilesWithQuery(
    propertyFiles,
    ({ property: { _id: propertyId } }) => ({ propertyId }),
    'property',
  ),
);
