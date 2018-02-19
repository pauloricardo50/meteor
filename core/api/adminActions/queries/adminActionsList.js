import { AdminActions } from '../../';

export default AdminActions.createQuery('adminActionsList', {
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  status: 1,
  createdAt: 1,
  type: 1,
  loanLink: 1,
  staffLink: 1,
});
