import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { T } from '../../../core/components/Translation/';
import DropdownMenu from '../../../core/components/DropdownMenu/';
import { changeTaskUser } from '../../../core/api/tasks/methods';

const changeAssignedUser = (user, taskId) => {

  changeTaskUser.call({
    taskId: taskId,
    newUser: user,
  });
}

const getMenuItems = (users, history, taskId, taskUser) => {

  let options = [];
  for (const key in users) {   
      options.push({
        id: users[key]._id,
        show: users[key]._id != taskUser ,
        label: users[key].emails[0].address
      })    
  }

  return options;
};

const AdminActionsAssignedUserDropdown = (props) => {
  const { data, isLoading, error, history, taskId, taskUser, styles } = props;
  
  if (isLoading) {
      return null;
  }
  if (error) {
      return <div>Error: {error.reason}</div>
  }

  return (
    <DropdownMenu
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      iconType="personAdd"
      options={getMenuItems(data, history, taskId, taskUser)
        // Allow the Divider to go through
        .filter(o => !!o.show)
        .map(({
 id: optionId, ...rest
}) => ({
            ...rest,
            id: optionId,
            link: false,
            onClick: () => {changeAssignedUser( optionId, taskId)},
            history, // required for Link to work
          }))}
      style= {styles}
          />
  );
};

// AdminActionsAssignedUserDropdown = {
//   currentUser: PropTypes.objectOf(PropTypes.any).isRequired,
//   history: PropTypes.object.isRequired,
// };

export default AdminActionsAssignedUserDropdown;
