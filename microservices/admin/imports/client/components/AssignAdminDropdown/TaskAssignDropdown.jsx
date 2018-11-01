import { withProps } from 'recompose';
import { setAssigneeOfTask } from 'core/api/methods';
import AssignAdminDropdown from './AssignAdminDropdown';

export default withProps({
  onAdminSelectHandler: ({ newAdmin, relatedDoc: task }) =>
    setAssigneeOfTask.run({ taskId: task._id, newAssigneeId: newAdmin._id }),
})(AssignAdminDropdown);
