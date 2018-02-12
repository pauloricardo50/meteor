import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { TASK_STATUS } from '../../../core/api/tasks/tasksConstants';
import { T } from '../../../core/components/Translation/';
import DropdownMenu from '../../../core/components/DropdownMenu/';
import { changeTaskStatus } from '../../../core/api/tasks/methods';

const changeStatus = (status, taskId) => {

  changeTaskStatus.call({
    taskId: taskId,
    newStatus: status,
  });
}

const getMenuItems = (currentUser, history, taskId, taskStatus) => {
    
  let options = [];
  for (var property in TASK_STATUS) {
    if (TASK_STATUS.hasOwnProperty(property)) {
      
      options.push({
        id: TASK_STATUS[property],
        show: TASK_STATUS[property] != taskStatus ,
       
      })
    }
  }

  return options;
};

const AdminActionsDropdown = (props) => {
  const { currentUser, history, taskId, taskStatus, styles } = props;

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
      iconType="offlinePin"
      options={getMenuItems(currentUser, history, taskId, taskStatus)
        // Allow the Divider to go through
        .filter(o => !!o.show)
        .map(({
 id: optionId, label, ...rest
}) => ({
            ...rest,
            id: optionId,
            link: false,
            onClick: () => {changeStatus( optionId, taskId)},
            label: label || <T id={`TasksStatusDropdown.${optionId}`} />,
            history, // required for Link to work
          }))}
          style= {styles}
   
    />
  );
};

AdminActionsDropdown.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.object.isRequired,
};

export default AdminActionsDropdown;
