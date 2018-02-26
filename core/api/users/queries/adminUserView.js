import { Users } from '../../';
import { QUERY } from '../userConstants';

export default Users.createQuery(QUERY.ADMIN_USER, {
  $filter({ filters, options, params }) {
    filters._id = params._id;
  },
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  emails: 1,
  createdAt: 1,
  loans: {
    logic: { step: 1 },
    createdAt: 1,
    updatedAt: 1,
    general: { insuranceFortuneUsed: 1, fortuneUsed: 1 },
    property: {
      value: 1,
      address1: 1,
    },
    borrowers: {
      firstName: 1,
      lastName: 1,
    },
  },
});
