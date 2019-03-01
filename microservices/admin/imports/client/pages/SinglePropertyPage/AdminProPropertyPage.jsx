import { ProPropertyPageContext } from 'core/components/ProPropertyPage/ProPropertyPageContext';
import ProPropertyPage from 'core/components/ProPropertyPage/ProPropertyPage';
import withContextProvider from 'core/api/containerToolkit/withContextProvider';

const permissions = {
  canModifyProperty: true,
  canInviteCustomers: true,
  canInviteProUsers: true,
  canManagePermissions: true,
};

export default withContextProvider({
  Context: ProPropertyPageContext,
  value: { permissions },
})(ProPropertyPage);
