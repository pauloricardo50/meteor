import { withProps } from 'recompose';
import { SecurityService, setRole } from 'core/api';
import { ROLES, USER_QUERIES } from 'core/api/constants';
import ClientEventService from 'core/api/events/ClientEventService/index';

export default withProps(({ userId }) => ({
  roles: SecurityService.currentUserHasRole(ROLES.DEV)
    ? Object.values(ROLES)
    : Object.values(ROLES).filter(role => role === ROLES.USER || role === ROLES.PRO),
  onChooseRole: newRole =>
    setRole
      .run({ userId, role: newRole })
      .then(() => ClientEventService.emit(USER_QUERIES.ADMIN_USER)),
}));
