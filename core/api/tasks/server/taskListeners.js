import ServerEventService from '../../events/server/ServerEventService';
import { requestLoanVerification } from '../../methods';
import TaskService from '../TaskService';
import { TASK_TYPE } from '../taskConstants';

ServerEventService.addMethodListener(requestLoanVerification, ({ loanId }) => {
  const type = TASK_TYPE.VERIFY;
  TaskService.insert({ type, loanId });
});
