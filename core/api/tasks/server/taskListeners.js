import UserService from '../../users/server/UserService';
import ServerEventService from '../../events/server/ServerEventService';
import {
  requestLoanVerification,
  adminCreateUser,
  anonymousCreateUser,
} from '../../methods';
import { LOANS_COLLECTION, USERS_COLLECTION, TASK_TYPE } from '../../constants';
import TaskService from './TaskService';

ServerEventService.addMethodListener(
  requestLoanVerification,
  ({ params: { loanId } }) => {
    TaskService.insert({
      type: TASK_TYPE.VERIFY,
      docId: loanId,
      collection: LOANS_COLLECTION,
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
          type: TASK_TYPE.ADD_ASSIGNED_TO,
          docId: userId,
          collection: USERS_COLLECTION,
        });
      }
    }
  },
);
