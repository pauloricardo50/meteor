import { Users } from '../..';
import { USER_QUERIES } from '../userConstants';
import { formatLoanWithStructure } from '../../../utils/loanFunctions';

export default Users.createQuery(USER_QUERIES.ADMIN_USER, {
  $filter({ filters, params }) {
    filters._id = params._id;
  },
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  $postFilter(users) {
    return users.map(({ loans, ...user }) => ({
      ...user,
      loans: loans.map(formatLoanWithStructure),
    }));
  },
  roles: 1,
  emails: 1,
  createdAt: 1,
  loans: {
    name: 1,
    logic: { step: 1 },
    createdAt: 1,
    updatedAt: 1,
    general: { insuranceFortuneUsed: 1, fortuneUsed: 1 },
    properties: {
      value: 1,
      address1: 1,
    },
    borrowers: {
      firstName: 1,
      lastName: 1,
    },
    structures: {
      propertyId: 1,
    },
    selectedStructure: 1,
  },
  assignedEmployee: {
    emails: 1,
    firstName: 1,
    lastName: 1,
  },
  firstName: 1,
  lastName: 1,
  username: 1,
  phone: 1,
});
