import ServerEventService from '../../events/server/ServerEventService';
import { requestLoanVerification } from '../../methods';
import TaskService from './TaskService';
import { TASK_TYPE } from '../taskConstants';
import { LOANS_COLLECTION } from '../../constants';

ServerEventService.addMethodListener(
  requestLoanVerification,
  ({ params: { loanId } }) => {
    const type = TASK_TYPE.VERIFY;
    TaskService.insert({ type, docId: loanId, collection: LOANS_COLLECTION });
  },
);
