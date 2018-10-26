import PropTypes from 'prop-types';
import React from 'react';

import Table from 'core/components/Table';
import TasksTableContainer from './TasksTableContainer';

const TasksTable = ({
  children,
  hideIfNoData,
  hideIfNoDataText,
  rows,
  columnOptions,
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
  </React.Fragment>
);

TasksTable.propTypes = {
  children: PropTypes.node,
  data: PropTypes.array.isRequired,
  hideIfNoData: PropTypes.bool,
  hideIfNoDataText: PropTypes.string,
  history: PropTypes.object.isRequired,
  showAssignee: PropTypes.bool,
};

TasksTable.defaultProps = {
  showAssignee: false,
  children: null,
  hideIfNoData: false,
  hideIfNoDataText: "Pas de taches pour l'instant",
};

export default TasksTableContainer(TasksTable);
