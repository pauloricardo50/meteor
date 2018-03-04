import React from 'react';
import PropTypes from 'prop-types';
import TasksTable from '../TasksPage/TasksTable';

export const TasksTab = (props) => {
  const { loan, isLoading, error } = props;

  return (
    <TasksTable
      data={loan.tasks}
      error={error}
      isLoading={isLoading}
      showAssignee
    />
  );
};

TasksTab.propTypes = {
  loan: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
};

export default TasksTab;
