import { createContainer, SecurityService } from '../../api';

export default createContainer({
  disabled: !SecurityService.currentUserIsAdmin(),
  isAdmin: SecurityService.currentUserIsAdmin(),
});
