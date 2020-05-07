import { withProps } from 'recompose';

import SecurityService from 'core/api/security/Security';
import { setRole } from 'core/api/users/methodDefinitions';
import { ASSIGNABLE_ROLES, ROLES } from 'core/api/users/roles/roleConstants';

export default withProps(({ userId }) => ({
  roles: SecurityService.currentUserHasRole(ROLES.DEV)
    ? Object.values(ASSIGNABLE_ROLES)
    : Object.values(ASSIGNABLE_ROLES).filter(role => role !== ROLES.DEV),
  onChooseRole: newRole => setRole.run({ userId, role: newRole }),
}));
