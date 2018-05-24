import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import LoanTasksTable from '../LoanTasksTable';

const TasksTab = ({ loan: { borrowerIds, property, _id } }) => (
  <div className="mask1 tasks-tab">
    <h2>
      <T id="collections.tasks" />
    </h2>
    <LoanTasksTable
      showAssignee
      loanId={_id}
      propertyId={property._id}
      borrowerIds={borrowerIds}
    />
  </div>
);

TasksTab.propTypes = {
  loan: PropTypes.object.isRequired,
};

export default TasksTab;
