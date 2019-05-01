import { Tasks } from '../..';
import { TASK_QUERIES } from '../taskConstants';
import { task } from '../../fragments';

export default Tasks.createQuery(TASK_QUERIES.TASKS, task());
