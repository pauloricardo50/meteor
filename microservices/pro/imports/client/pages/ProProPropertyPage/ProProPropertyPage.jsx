import { compose } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import withContextProvider from 'core/api/containerToolkit/withContextProvider';
import { proOrganisation } from 'core/api/organisations/queries';
import { proProperties } from 'core/api/properties/queries';
import {
  isAllowedToInviteCustomersToProProperty,
  isAllowedToInviteProUsersToProProperty,
  isAllowedToManageProPropertyPermissions,
  isAllowedToModifyProProperty,
  isAllowedToSeeProPropertyCustomers,
} from 'core/api/security/clientSecurityHelpers/';
import ProPropertyPage from 'core/components/ProPropertyPage/ProPropertyPage';
import { ProPropertyPageContext } from 'core/components/ProPropertyPage/ProPropertyPageContext';
import withMatchParam from 'core/containers/withMatchParam';

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
    query: proProperties,
    params: ({ propertyId }) => ({ _id: propertyId }),
    queryOptions: { single: true, reactive: false },
    dataName: 'property',
  }),
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
