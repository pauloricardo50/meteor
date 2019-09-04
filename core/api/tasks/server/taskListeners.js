import { getUserNameAndOrganisation } from '../../helpers';
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

const newUserTask = ({ userId, ...params }) =>
  TaskService.insert({
    object: {
      title: 'Assigner un conseiller',
      docId: userId,
      collection: USERS_COLLECTION,
      ...params,
    },
  });

ServerEventService.addAfterMethodListener(
  [adminCreateUser, anonymousCreateUser],
  ({ result: userId }) => {
    if (userId) {
      const user = UserService.fetchOne({
        $filters: { _id: userId },
        assignedEmployeeId: 1,
      });

      newUserTask({ userId });
    }
  },
);

ServerEventService.addAfterMethodListener(
  proInviteUser,
  async ({ result: userId, context: { userId: proId } }) => {
    if (userId) {
      if (typeof userId.then === 'function') {
        // The result of the meteor method can be a promise
        userId = await userId;
      }

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

      if (isNewUser) {
        newUserTask({
          userId,
          description: `Invitation par ${getUserNameAndOrganisation({
            user: pro,
          })}`,
        });
      } else {
        TaskService.insert({
          object: {
            title: "Invitation d'un client déjà existant",
            docId: userId,
            collection: USERS_COLLECTION,
            description: `Invitation par ${getUserNameAndOrganisation({
              user: pro,
            })}`,
          },
        });
      }
    }
  },
);
