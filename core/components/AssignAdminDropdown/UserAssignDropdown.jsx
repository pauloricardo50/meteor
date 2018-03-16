import { createContainer } from 'core/api';
import { assignAdminToUser } from 'core/api/methods';
import AssignAdminDropdown from './AssignAdminDropdown';

const UserAssignDropdownContainer = createContainer(() => {
  const changeAssignedUser = ({ newAdmin, user, currentAdminId }) => {
    assignAdminToUser.run({
      userId: user._id,
      adminId: newAdmin._id,
    });
    if (!currentAdminId) {
      // first assignment for that user
      // TODO: assign all tasks & complete task ADD_ASSIGNED_TO
    }
  };

  const additionalProps = {
    onAdminSelectHandler: ({ selectedAdmin, relatedDoc, currentAdmin }) =>
      changeAssignedUser({
        newAdmin: selectedAdmin,
        user: relatedDoc,
        currentAdminId: currentAdmin,
      }),
  };

  return additionalProps;
});

export default UserAssignDropdownContainer(AssignAdminDropdown);
