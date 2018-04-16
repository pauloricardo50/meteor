import { createContainer } from 'core/api';
import { assignAdminToUser, assignAdminToNewUser } from 'core/api/methods';
import AssignAdminDropdown from './AssignAdminDropdown';

const changeAssignedUser = ({ newAdmin, user, currentAdminId }) => {
  if (currentAdminId) {
    // change of a previously assigned employee
    assignAdminToUser.run({
      userId: user._id,
      adminId: newAdmin._id,
    });
  } else {
    // first assignment for that user
    assignAdminToNewUser.run({
      userId: user._id,
      adminId: newAdmin._id,
    });
  }
};

const onAdminSelectHandler = ({ selectedAdmin, relatedDoc, currentAdmin }) =>
  changeAssignedUser({
    newAdmin: selectedAdmin,
    user: relatedDoc,
    currentAdminId: currentAdmin,
  });

const UserAssignDropdownContainer = createContainer(() => ({
  onAdminSelectHandler,
}));

export default UserAssignDropdownContainer(AssignAdminDropdown);
