import PropTypes from 'prop-types';
import React from 'react';

import Table from 'core/components/Table';
import TasksTableContainer from './TasksTableContainer';
import TaskModifier from './TaskModifier';
import TaskTableFilters from './TaskTableFilters';
import TasksTablePriority from './TasksTablePriority';

export const taskTableFragment = {
  assigneeLink: 1,
  assignee: { name: 1, roles: 1 },
  createdAt: 1,
  createdBy: 1,
  description: 1,
  dueAt: 1,
  lender: { organisation: { name: 1 } },
  loan: { name: 1, borrowers: { name: 1 }, user: { name: 1 } },
  organisation: { name: 1 },
  priority: 1,
  promotion: { name: 1 },
  status: 1,
  title: 1,
  user: { name: 1, roles: 1, organisations: { name: 1 } },
  insuranceRequest: { name: 1 },
  isPrivate: 1,
};

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
  additionalFilters,
}) => {
  const renderTable = !(hideIfNoData && !rows.length);
  const TableComponent = withPriority ? TasksTablePriority : Table;

  return (
    <>
      <div className="flex center-align">
        {children}
        {renderTable && setStatus && (
          <TaskTableFilters
            assignee={assignee}
            status={status}
            setStatus={setStatus}
            setAssignee={setAssignee}
            uptoDate={uptoDate}
            setUptoDate={setUptoDate}
            additionalFilters={additionalFilters}
          />
        )}
      </div>
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
    </>
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
