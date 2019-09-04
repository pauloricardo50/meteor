import { getUserNameAndOrganisation } from 'core/api/helpers/index';
import UserService from '../../users/server/UserService';
import ServerEventService from '../../events/server/ServerEventService';
import {
  requestLoanVerification,
  adminCreateUser,
  anonymousCreateUser,
  proInviteUser,
} from '../../methods';
import { LOANS_COLLECTION, USERS_COLLECTION } from '../../constants';
import TaskService from './TaskService';

ServerEventService.addAfterMethodListener(
  requestLoanVerification,
  ({ params: { loanId } }) => {
    TaskService.insert({
      object: {
        title: 'Vérification du dossier demandée',
        docId: loanId,
        collection: LOANS_COLLECTION,
      },
    });
  },
);

ServerEventService.addAfterMethodListener(
  [adminCreateUser, anonymousCreateUser],
  ({ result: userId }) => {
    if (userId) {
      const user = UserService.fetchOne({
        $filters: { _id: userId },
        assignedEmployeeId: 1,
      });

      if (user && !user.assignedEmployeeId) {
        TaskService.insert({
          object: {
            title: 'Assigner un conseiller',
            docId: userId,
            collection: USERS_COLLECTION,
          },
        });
      } else {
        TaskService.insert({
          object: {
            title: 'Nouveau compte utilisateur: prendre contact',
            docId: userId,
            collection: USERS_COLLECTION,
          },
        });
      }
    }
  },
);

ServerEventService.addAfterMethodListener(
  proInviteUser,
  ({ result: userId, context: { userId: proId } }) => {
    if (userId) {
      const user = UserService.fetchOne({
        $filters: { _id: userId },
        assignedEmployeeId: 1,
        createdAt: 1,
      });
      const pro = UserService.get(proId);

      let isNewUser = true;
      const now = new Date();

      // If a user has been created more than 10 seconds ago, assume it already existed
      if (now.valueOf() - user.createdAt.valueOf() > 10000) {
        isNewUser = false;
      }

      if (user && !user.assignedEmployeeId) {
        TaskService.insert({
          object: {
            title: 'Assigner un conseiller',
            docId: userId,
            collection: USERS_COLLECTION,
          },
        });
      } else if (isNewUser) {
        TaskService.insert({
          object: {
            title: 'Nouveau compte utilisateur: prendre contact',
            docId: userId,
            collection: USERS_COLLECTION,
            description: `Invitation par ${getUserNameAndOrganisation(pro)}`,
          },
        });
      } else {
        TaskService.insert({
          object: {
            title: "Invitation d'un client déjà existant",
            docId: userId,
            collection: USERS_COLLECTION,
            description: `Invitation par ${getUserNameAndOrganisation(pro)}`,
          },
        });
      }
    }
  },
);
