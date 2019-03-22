import Security from '../Security';
import { ROLES } from '../../constants';
import UserService from '../../users/server/UserService';

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

  isAllowedToUpdate = (userId, userId2) => {
    if (Security.currentUserIsAdmin()) {
      return;
    }

    if (userId !== userId2) {
      Security.handleUnauthorized('Pas autorisé');
    }
  };

  isAllowedToInviteUsersToOrganisation = ({ userId, organisationId }) => {
    if (Security.currentUserIsAdmin()) {
      return;
    }

    const { organisations = [] } = UserService.fetchOne({
      $filters: { _id: userId },
      organisations: { _id: 1 },
    });

    if (!organisations.some(({ _id }) => _id === organisationId)) {
      Security.handleUnauthorized('Pas autorisé à inviter des utilisateurs à cette organisation');
    }
  };
}

export default new UserSecurity();
