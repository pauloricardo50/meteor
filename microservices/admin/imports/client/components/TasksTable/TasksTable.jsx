import PropTypes from 'prop-types';
import React from 'react';

import Table from 'core/components/Table';
import TasksTableContainer from './TasksTableContainer';
import TaskModifier from './TaskModifier';

const TasksTable = ({
  children,
  hideIfNoData,
  hideIfNoDataText,
  rows,
  columnOptions,
  showDialog,
  setShowDialog,
  taskToModify,
}) => (
  <React.Fragment>
    {children}
    {hideIfNoData && !rows.length ? (
      <p className="text-center">{hideIfNoDataText}</p>
    ) : (
      <Table
        columnOptions={columnOptions}
        rows={rows}
        noIntl
        className="tasks-table"
        clickable
      />
    )}
    {taskToModify && (
      <TaskModifier
        task={taskToModify}
        open={showDialog}
        setOpen={setShowDialog}
      />
    )}
  </React.Fragment>
);

TasksTable.propTypes = {
  children: PropTypes.node,
  hideIfNoData: PropTypes.bool,
  hideIfNoDataText: PropTypes.string,
};

TasksTable.defaultProps = {
  children: null,
  hideIfNoData: false,
  hideIfNoDataText: "Pas de taches pour l'instant",
};

export default TasksTableContainer(TasksTable);
