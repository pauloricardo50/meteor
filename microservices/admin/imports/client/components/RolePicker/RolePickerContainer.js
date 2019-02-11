import { withProps } from 'recompose';
import { setRole } from 'core/api';
import SecurityService from 'core/api/security/Security';
import { ROLES } from 'core/api/constants';

export default withProps(({ userId }) => ({
  roles: SecurityService.currentUserHasRole(ROLES.DEV)
    ? Object.values(ROLES)
    : Object.values(ROLES).filter(role => role === ROLES.USER || role === ROLES.PRO),
  onChooseRole: newRole => setRole.run({ userId, role: newRole }),
}));
