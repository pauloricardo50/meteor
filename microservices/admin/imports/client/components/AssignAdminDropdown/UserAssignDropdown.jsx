import { withProps } from 'recompose';
import { assignAdminToUser } from 'core/api/methods';
import AssignAdminDropdown from './AssignAdminDropdown';

const changeAssignedUser = ({ newAdmin, user }) => {
    assignAdminToUser.run({ userId: user._id, adminId: newAdmin._id }) 
};

const onAdminSelectHandler = ({ newAdmin, relatedDoc }) =>
  changeAssignedUser({ newAdmin, user: relatedDoc });

const UserAssignDropdownContainer = withProps(() => ({ onAdminSelectHandler }));

export default UserAssignDropdownContainer(AssignAdminDropdown);
