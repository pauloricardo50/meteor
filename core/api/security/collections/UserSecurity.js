import Security from '../Security';
import { ROLES } from '../../constants';

class UserSecurity {
  isAllowedToInsertByRole = ({ role }) => {
    if (!role || !Object.values(ROLES).includes(role)) {
      Security.handleUnauthorized('You can only create accounts with one of the accepted roles.');
    } else if (!Security.currentUserIsAdmin()) {
      Security.handleUnauthorized("You don't have enough privileges to create an account");
    } else if (role === ROLES.DEV || role === ROLES.ADMIN) {
      Security.checkCurrentUserIsDev();
    }
  };
}

export default new UserSecurity();
