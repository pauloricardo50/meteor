import React from 'react';
import PropTypes from 'prop-types';
import TasksTable from '../../../components/TasksTable/TasksTable';

export const TasksTab = (props) => {
  const { loan, isLoading, error } = props;

  return (
    <div className="mask1">
      <TasksTable
        data={loan.tasks}
        error={error}
        isLoading={isLoading}
        showAssignee
      />
    </div>
  );
};

TasksTab.propTypes = {
  loan: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
};

export default TasksTab;
