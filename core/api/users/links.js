import { Loans, Users } from '../';

Users.addLinks({
  loans: {
    collection: Loans,
    inversedBy: 'user',
  },
});

Users.addLinks({
  assignedEmployee: {
    collection: Users,
    field: 'assignedEmployeeId',
    type: 'one',
  },
});

Users.addLinks({
  assignedEndUsers: {
    collection: Users,
    inversedBy: 'assignedEmployee',
  },
});
