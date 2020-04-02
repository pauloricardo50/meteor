import React from 'react';

import { TASK_PRIORITIES } from 'core/api/tasks/taskConstants';
import Table from 'core/components/Table';

const TasksTablePriority = ({
  columnOptions,
  rows,
  initialOrderBy,
  initialOrder,
}) => {
  const defaultPriority = rows.filter(
    ({ priority }) => priority === TASK_PRIORITIES.DEFAULT,
  );
  const highPriority = rows.filter(
    ({ priority }) => priority === TASK_PRIORITIES.HIGH,
  );
  const showPriorityTable = !!highPriority.length;

  return (
    <>
      {showPriorityTable && <h3>Prioritaire</h3>}
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

      {showPriorityTable && <h3 style={{ marginTop: 40 }}>Défaut</h3>}
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
