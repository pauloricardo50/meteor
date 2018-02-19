import { Loans } from '../../';
import { QUERY } from '../loanConstants';

export default Loans.createQuery(QUERY.ADMIN_LOANS, {
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  name: 1,
  logic: 1,
  general: 1,
  createdAt: 1,
  updatedAt: 1,
  propertyLink: {
    value: 1,
  },
});
