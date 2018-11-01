import { withProps } from 'recompose';
import { SecurityService, setRole } from 'core/api';
import { ROLES, USER_QUERIES } from 'core/api/constants';
import ClientEventService from 'core/api/events/ClientEventService/index';

export default withProps(({ userId }) => ({
  shouldDisplay: SecurityService.currentUserHasRole(ROLES.DEV),
  onChooseRole: newRole =>
    setRole
      .run({ userId, role: newRole })
      .then(() => ClientEventService.emit(USER_QUERIES.ADMIN_USER)),
}));
