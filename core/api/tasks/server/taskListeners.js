import UserService from '../../users/server/UserService';
import ServerEventService from '../../events/server/ServerEventService';
import {
  requestLoanVerification,
  adminCreateUser,
  anonymousCreateUser,
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
            title: 'Nouvel utilisateur: prendre contact',
            docId: userId,
            collection: USERS_COLLECTION,
          },
        });
      }
    }
  },
);
