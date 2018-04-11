import { createContainer, SecurityService, setRole } from 'core/api';
import { ROLES } from 'core/api/constants';

export default createContainer(({ userId }) => ({
  shouldDisplay: SecurityService.currentUserHasRole(ROLES.DEV),
  onChooseRole: newRole => setRole.run({ userId, role: newRole }),
}));
