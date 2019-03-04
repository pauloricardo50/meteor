import { compose } from 'recompose';

import proProperty from 'core/api/properties/queries/proProperty';
import propertyFiles from 'core/api/properties/queries/propertyFiles';
import { withSmartQuery } from 'core/api/containerToolkit';
import withMatchParam from 'core/containers/withMatchParam';
import mergeFilesWithQuery from 'core/api/files/mergeFilesWithQuery';

import { ProPropertyPageContext } from 'core/components/ProPropertyPage/ProPropertyPageContext';
import ProPropertyPage from 'core/components/ProPropertyPage/ProPropertyPage';
import withContextProvider from 'core/api/containerToolkit/withContextProvider';
import {
  isAllowedToModifyProProperty,
  isAllowedToInviteCustomersToProProperty,
  isAllowedToSeeProPropertyCustomers,
  isAllowedToInviteProUsersToProProperty,
  isAllowedToManageProPropertyPermissions,
} from 'imports/core/api/security/clientSecurityHelpers/index';

const makePermissions = props => ({
  canModifyProperty: isAllowedToModifyProProperty(props),
  canInviteCustomers: isAllowedToInviteCustomersToProProperty(props),
  canInviteProUsers: isAllowedToInviteProUsersToProProperty(props),
  canManagePermissions: isAllowedToManageProPropertyPermissions(props),
  canSeeCustomers: isAllowedToSeeProPropertyCustomers(props),
});

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
    value: props => ({ permissions: makePermissions(props) }),
  }),
)(ProPropertyPage);
