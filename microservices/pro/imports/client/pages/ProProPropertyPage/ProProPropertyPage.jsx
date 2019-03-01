import { compose } from 'recompose';

import proProperty from 'core/api/properties/queries/proProperty';
import propertyFiles from 'core/api/properties/queries/propertyFiles';
import { withSmartQuery } from 'core/api/containerToolkit';
import withMatchParam from 'core/containers/withMatchParam';
import mergeFilesWithQuery from 'core/api/files/mergeFilesWithQuery';

import { ProPropertyPageContext } from 'core/components/ProPropertyPage/ProPropertyPageContext';
import ProPropertyPage from 'core/components/ProPropertyPage/ProPropertyPage';
import withContextProvider from 'core/api/containerToolkit/withContextProvider';

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
  withContextProvider({
    Context: ProPropertyPageContext,
    value: ({ currentUser: { _id: userId }, property: { users = [] } }) => {
      const user = users.find(({ _id }) => _id === userId);
      const permissions = user && user.$metadata.permissions;
      return {
        permissions,
      };
    },
  }),
)(ProPropertyPage);
