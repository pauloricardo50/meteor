import { withProps } from 'recompose';
import { SecurityService, setRole } from 'core/api';
import { ROLES } from 'core/api/constants';

export default withProps(({ userId }) => ({
  shouldDisplay: SecurityService.currentUserHasRole(ROLES.DEV),
  onChooseRole: newRole => setRole.run({ userId, role: newRole }),
}));
