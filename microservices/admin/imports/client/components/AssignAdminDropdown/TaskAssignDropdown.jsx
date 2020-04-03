import { withProps } from 'recompose';

import { setAssigneeOfTask } from 'core/api/tasks/methodDefinitions';

import AssignAdminDropdown from './AssignAdminDropdown';

export default withProps({
  onAdminSelectHandler: ({ newAdmin, relatedDoc: task }) =>
    setAssigneeOfTask.run({ taskId: task._id, newAssigneeId: newAdmin._id }),
})(AssignAdminDropdown);
