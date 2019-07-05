import PropTypes from 'prop-types';
import React from 'react';

import Table from 'core/components/Table';
import TasksTableContainer from './TasksTableContainer';
import TaskModifier from './TaskModifier';
import TaskTableFilters from './TaskTableFilters';
import TasksTablePriority from './TasksTablePriority';

const TasksTable = ({
  children,
  hideIfNoData,
  hideIfNoDataText,
  rows,
  columnOptions,
  showDialog,
  setShowDialog,
  taskToModify,
  initialOrderBy,
  initialOrder,
  assignee,
  status,
  setStatus,
  setAssignee,
  uptoDate,
  setUptoDate,
  withPriority,
}) => {
  const renderTable = !(hideIfNoData && !rows.length);
  const TableComponent = withPriority ? TasksTablePriority : Table;

  return (
    <React.Fragment>
      {children}
      {renderTable && setStatus && (
        <TaskTableFilters
          assignee={assignee}
          status={status}
          setStatus={setStatus}
          setAssignee={setAssignee}
          uptoDate={uptoDate}
          setUptoDate={setUptoDate}
        />
      )}
      {renderTable ? (
        <TableComponent
          columnOptions={columnOptions}
          rows={rows}
          noIntl
          className="tasks-table"
          clickable
          initialOrderBy={initialOrderBy}
          initialOrder={initialOrder}
        />
      ) : (
        <p className="text-center">{hideIfNoDataText}</p>
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
};

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
