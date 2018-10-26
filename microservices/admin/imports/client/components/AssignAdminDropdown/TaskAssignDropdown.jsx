import { withProps } from 'recompose';
import { setAssigneeOfTask } from 'core/api/methods';
import ClientEventService from 'core/api/events/ClientEventService/index';
import { TASK_QUERIES } from 'core/api/constants';
import AssignAdminDropdown from './AssignAdminDropdown';

export default withProps({
  onAdminSelectHandler: ({ newAdmin, relatedDoc: task }) =>
    setAssigneeOfTask
      .run({ taskId: task._id, newAssigneeId: newAdmin._id })
      .then(() => {
        ClientEventService.emit(TASK_QUERIES.TASKS);
        ClientEventService.emit(TASK_QUERIES.TASKS_FOR_DOC);
      }),
})(AssignAdminDropdown);
