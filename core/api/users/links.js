import { Users, Loans, Offers } from '../';

Users.addLinks({
  loans: {
    collection: Loans,
    inversedBy: 'user',
  },
  offers: {
    collection: Offers,
    inversedBy: 'user',
  },
  assignedEmployee: {
    collection: Users,
    field: 'assignedEmployeeId',
    type: 'one',
  },
  assignedEndUsers: {
    collection: Users,
    inversedBy: 'assignedEmployee',
  },
});
