import { Meteor } from 'meteor/meteor';
import { TASK_STATUS } from '../constants';

const nextDueTaskReducer = ({ tasksCache: tasks = [] }) => {
  const activeTasks = tasks.filter(
    ({
      status: taskStatus,
      isPrivate = false,
      assigneeLink: { _id: assigneeId } = {},
    }) => {
      if (taskStatus !== TASK_STATUS.ACTIVE) {
        return false;
      }

      if (isPrivate && assigneeId) {
        return assigneeId === Meteor.userId();
      }

      return true;
    },
  );
  const tasksWithoutDate = activeTasks
    .filter(({ dueAt }) => !dueAt)
    .sort(({ createdAt: A }, { createdAt: B }) => A - B);

  if (tasksWithoutDate.length > 0) {
    const [task] = tasksWithoutDate;
    return { ...task, dueAt: task.createdAt, noDueDate: true };
  }

  const sortedTasks = activeTasks.sort(({ dueAt: A }, { dueAt: B }) => A - B);

  if (sortedTasks.length > 0) {
    return sortedTasks[0];
  }
};

export default nextDueTaskReducer;
