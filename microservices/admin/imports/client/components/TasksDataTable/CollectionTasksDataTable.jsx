import React, { useState } from 'react';

import { CONTACTS_COLLECTION } from 'core/api/contacts/contactsConstants';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/insuranceRequests/insuranceRequestConstants';
import { LENDERS_COLLECTION } from 'core/api/lenders/lenderConstants';
import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import { TASK_STATUS } from 'core/api/tasks/taskConstants';
import { USERS_COLLECTION } from 'core/api/users/userConstants';
import useCurrentUser from 'core/hooks/useCurrentUser';

import TaskAdder from '../TaskForm/TaskAdder';
import TasksDataTable from './TasksDataTable';
import TasksTableFilters from './TasksTableFilters';

const getFilters = ({ docId, collection, assignee, status }) => {
  let filters = { 'assigneeLink._id': assignee, status };

  switch (collection) {
    case USERS_COLLECTION:
      filters = { ...filters, 'userLink._id': docId };
      break;
    case LOANS_COLLECTION:
      filters = { ...filters, 'loanLink._id': docId };
      break;
    case PROMOTIONS_COLLECTION:
      filters = { ...filters, 'promotionLink._id': docId };
      break;
    case ORGANISATIONS_COLLECTION:
      filters = { ...filters, 'organisationLink._id': docId };
      break;
    case LENDERS_COLLECTION:
      filters = { ...filters, 'lenderLink._id': docId };
      break;
    case CONTACTS_COLLECTION:
      filters = { ...filters, 'contactLink._id': docId };
      break;
    case INSURANCE_REQUESTS_COLLECTION:
      filters = { ...filters, 'insuranceRequestLink._id': docId };
      break;
    default:
      break;
  }

  return filters;
};

const CollectionTasksDataTable = ({
  docId,
  collection,
  className,
  TaskInserter = TaskAdder,
  filters = {},
  additionalFilters,
  noInitialFilter,
}) => {
  const currentUser = useCurrentUser();
  const [assignee, setAssignee] = useState(
    noInitialFilter ? undefined : { $in: [currentUser._id, undefined] },
  );
  const [status, setStatus] = useState({ $in: [TASK_STATUS.ACTIVE] });

  return (
    <div className={className}>
      <div className="flex sb center-align">
        <div className="flex center-align">
          <h3 className="m-0 mr-8">Tâches</h3>

          <TasksTableFilters
            assignee={assignee}
            status={status}
            setStatus={setStatus}
            setAssignee={setAssignee}
            additionalFilters={additionalFilters}
          />
        </div>
        <TaskInserter docId={docId} collection={collection} watchSearchParams />
      </div>

      <TasksDataTable
        filters={{
          ...getFilters({ docId, collection, assignee, status }),
          ...filters,
        }}
        showRelatedTo={false}
      />
    </div>
  );
};

export default CollectionTasksDataTable;
