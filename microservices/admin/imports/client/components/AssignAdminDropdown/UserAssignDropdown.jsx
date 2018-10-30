import { withProps } from 'recompose';
import { assignAdminToUser, assignAdminToNewUser } from 'core/api/methods';
import ClientEventService from 'core/api/events/ClientEventService/index';
import { USER_QUERIES } from 'core/api/constants';
import AssignAdminDropdown from './AssignAdminDropdown';

const changeAssignedUser = ({ newAdmin, user, oldAdminId }) => {
  const refresh = () => ClientEventService.emit(USER_QUERIES.ADMIN_USER);
  if (oldAdminId) {
    // change of a previously assigned employee
    assignAdminToUser
      .run({
        userId: user._id,
        adminId: newAdmin._id,
      })
      .then(refresh);
  } else {
    // first assignment for that user
    assignAdminToNewUser
      .run({
        userId: user._id,
        adminId: newAdmin._id,
      })
      .then(refresh);
  }
};

const onAdminSelectHandler = ({ newAdmin, relatedDoc, oldAdmin }) =>
  changeAssignedUser({
    newAdmin,
    user: relatedDoc,
    oldAdminId: oldAdmin,
  });

const UserAssignDropdownContainer = withProps(() => ({
  onAdminSelectHandler,
}));

export default UserAssignDropdownContainer(AssignAdminDropdown);
