import { Tasks } from '../../';
import { TASK_QUERIES } from '../taskConstants';

export default Tasks.createQuery(TASK_QUERIES.SIDENAV_TASKS, {
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  $paginate: true,
  // Links example
  // assignedUser: {
  //   emails: 1,
  //   roles: 1,
  //   username: 1,
  // },
  // user: {
  //   emails: 1,
  //   username: 1,
  // },
  // Field example
  // userId: 1,
});
