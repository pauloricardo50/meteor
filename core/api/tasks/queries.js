import Tasks from '.';
import { TASK_QUERIES } from './taskConstants';
import { task } from '../fragments';

export const tasks = Tasks.createQuery(TASK_QUERIES.TASKS, task());
