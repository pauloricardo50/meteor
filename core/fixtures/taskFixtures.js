import TaskService from '../api/tasks/TaskService';
import { TASK_TYPE } from '../api/tasks/taskConstants';
import { Tasks } from '../api';
import { getRelatedBorrowerIds } from './borrowerFixtures';
import { getRelatedPropertyIds } from './propertyFixtures';
import { getRelatedLoansIds } from './loanFixtures';

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
  const borrowerIds = getRelatedBorrowerIds(usersIds);
  const propertyIds = getRelatedPropertyIds(usersIds);
  const loansIds = getRelatedLoansIds(usersIds);
  Tasks.update(
    { assignedEmployeeId: { $in: usersIds } },
    { $unset: { assignedEmployeeId: '' } },
    { multi: true },
  );
  return Tasks.remove({
    $or: [
      { userId: { $in: usersIds } },
      { propertyId: { $in: propertyIds } },
      { loanId: { $in: loansIds } },
      { borrowerId: { $in: borrowerIds } },
    ],
  });
};
