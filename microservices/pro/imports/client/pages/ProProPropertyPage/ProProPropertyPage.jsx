import { compose } from 'recompose';

import proProperty from 'core/api/properties/queries/proProperty';
import proOrganisation from 'core/api/organisations/queries/proOrganisation';
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
  isPro: true,
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
  withSmartQuery({
    query: proOrganisation,
    params: ({ currentUser: { organisations = [] } }) => ({
      organisationId: organisations[0]._id,
      $body: { name: 1, address1: 1, users: { name: 1 } },
    }),
    queryOptions: { reactive: false, single: true },
    dataName: 'organisation',
  }),
  withContextProvider({
    Context: ProPropertyPageContext,
    value: ({ organisation, ...props }) => ({
      permissions: makePermissions(props),
      organisation,
    }),
  }),
)(ProPropertyPage);
