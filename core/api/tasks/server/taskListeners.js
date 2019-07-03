import UserService from '../../users/server/UserService';
import ServerEventService from '../../events/server/ServerEventService';
import {
  requestLoanVerification,
  adminCreateUser,
  anonymousCreateUser,
} from '../../methods';
import { LOANS_COLLECTION, USERS_COLLECTION } from '../../constants';
import TaskService from './TaskService';

ServerEventService.addMethodListener(
  requestLoanVerification,
  ({ params: { loanId } }) => {
    console.log('listening!');
    
    TaskService.insert({
      object: {
        title: 'Vérifier dossier',
        docId: loanId,
        collection: LOANS_COLLECTION,
      },
    });
  },
);

ServerEventService.addMethodListener(
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
      }
    }
  },
);
