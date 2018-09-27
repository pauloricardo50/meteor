import { withProps } from 'recompose';
import { SecurityService } from '../../api';

export default withProps({
  disabled: !SecurityService.currentUserIsAdmin(),
  isAdmin: SecurityService.currentUserIsAdmin(),
});
