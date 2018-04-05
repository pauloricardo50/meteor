import TaskService from '../api/tasks/TaskService';
import { TASK_TYPE } from '../api/tasks/taskConstants';
import { Tasks } from '../api';
import { getRelatedBorrowersIds } from './borrowers';
import { getRelatedPropertiesIds } from './properties';
import { getRelatedLoansIds } from './loans';

const types = Object.values(TASK_TYPE).filter(item => item !== TASK_TYPE.ADD_ASSIGNED_TO);

export const createFakeTask = (loanId, assignedTo) => {
  const type = types[Math.floor(Math.random() * types.length)];

  return TaskService.insert({
    type,
    loanId,
    assignedEmployeeId: assignedTo,
  });
};

export const deleteUsersTasks = (usersIds) => {
  const borrowersIds = getRelatedBorrowersIds(usersIds);
  const propertiesIds = getRelatedPropertiesIds(usersIds);
  const loansIds = getRelatedLoansIds(usersIds);
  Tasks.update(
    { assignedEmployeeId: { $in: usersIds } },
    { $unset: { assignedEmployeeId: '' } },
    { multi: true },
  );
  return Tasks.remove({
    $or: [
      { userId: { $in: usersIds } },
      { propertyId: { $in: propertiesIds } },
      { loanId: { $in: loansIds } },
      { borrowerId: { $in: borrowersIds } },
    ],
  });
};
