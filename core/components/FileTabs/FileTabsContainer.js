import { withProps } from 'recompose';

import SecurityService from '../../api/security/Security';

export default withProps({
  isAdmin: SecurityService.currentUserIsAdmin(),
});
