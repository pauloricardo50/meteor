import { withProps } from 'recompose';
import { SecurityService } from '../../api';

export default withProps({
  isAdmin: SecurityService.currentUserIsAdmin(),
});
