// @flow
import React from 'react';

import { TASK_PRIORITIES } from 'core/api/constants';
import Table from 'core/components/Table';

type TasksTablePriorityProps = {};

const TasksTablePriority = ({
  columnOptions,
  rows,
  initialOrderBy,
  initialOrder,
}: TasksTablePriorityProps) => {
  const defaultPriority = rows.filter(({ priority }) => priority === TASK_PRIORITIES.DEFAULT);
  const highPriority = rows.filter(({ priority }) => priority === TASK_PRIORITIES.HIGH);
  const showPriorityTable = !!highPriority.length;

  return (
    <>
      {showPriorityTable && <h4>Prioritaire</h4>}
      {showPriorityTable && (
        <Table
          columnOptions={columnOptions}
          rows={highPriority}
          noIntl
          className="tasks-table"
          clickable
          initialOrderBy={initialOrderBy}
          initialOrder={initialOrder}
        />
      )}

      {showPriorityTable && <h4>Défaut</h4>}
      <Table
        columnOptions={columnOptions}
        rows={defaultPriority}
        noIntl
        className="tasks-table"
        clickable
        initialOrderBy={initialOrderBy}
        initialOrder={initialOrder}
      />
    </>
  );
};

export default TasksTablePriority;
