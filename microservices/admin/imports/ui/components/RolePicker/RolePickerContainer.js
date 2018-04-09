import { createContainer, SecurityService, constants, setRole } from 'core/api';

export default createContainer(({ userId }) => ({
  shouldDisplay: SecurityService.currentUserHasRole(constants.ROLES.DEV),
  onChooseRole: newRole => setRole.run({ userId, role: newRole }),
}));
