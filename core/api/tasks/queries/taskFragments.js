import { simpleUserFragment } from '../../users/queries/userFragments';
import { baseBorrowerFragment } from '../../borrowers/queries/borrowerFragments';

export const baseTaskFragment = {
  createdAt: 1,
  dueAt: 1,
  status: 1,
  title: 1,
  type: 1,
  updatedAt: 1,
  userId: 1,
  fileKey: 1,
  $options: { sort: { createdAt: -1 } },
};

export const taskFragment = {
  ...baseTaskFragment,
  assignedEmployee: simpleUserFragment,
  borrower: { ...baseBorrowerFragment, user: { assignedEmployeeId: 1 } },
  loan: { name: 1, user: { assignedEmployeeId: 1 } },
  property: { address1: 1, user: { assignedEmployeeId: 1 } },
  user: simpleUserFragment,
};
