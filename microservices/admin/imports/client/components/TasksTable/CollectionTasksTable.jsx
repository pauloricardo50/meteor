import React, { useState } from 'react';
import { withSmartQuery } from 'core/api';
import { compose, shouldUpdate, withState, withProps } from 'recompose';
import {
  taskInsert,
  taskUpdate,
  taskChangeStatus,
  taskComplete,
} from 'core/api/methods';
import {
  TASK_STATUS,
  TASKS_COLLECTION,
  USERS_COLLECTION,
  LOANS_COLLECTION,
  ORGANISATIONS_COLLECTION,
  PROMOTIONS_COLLECTION,
} from 'core/api/constants';
import useSearchParams from 'core/hooks/useSearchParams';
import TasksTable, { taskTableFragment } from './TasksTable';
import {
  LENDERS_COLLECTION,
  CONTACTS_COLLECTION,
} from '../../../core/api/constants';
import CollectionTaskInserter from './CollectionTaskInserter';

const getFilters = ({ collection, doc, assignee, status }) => {
  const { _id: docId } = doc;

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
    default:
      break;
  }

  return filters;
};

const CollectionTasksTable = ({
  doc,
  tasks,
  model,
  openOnMount,
  resetForm,
  withTaskInsert,
  refetch,
  collection,
  ...rest
}) => (
  <div>
    {withTaskInsert && (
      <div className="flex">
        <h3>Tâches</h3>
        <CollectionTaskInserter
          doc={doc}
          refetch={refetch}
          model={model}
          openOnMount={openOnMount}
          resetForm={resetForm}
          collection={collection}
        />
      </div>
    )}
    <TasksTable tasks={tasks} relatedTo={false} {...rest} />
  </div>
);

export default compose(
  shouldUpdate(() => false),
  withState('status', 'setStatus', { $in: [TASK_STATUS.ACTIVE] }),
  withSmartQuery({
    query: TASKS_COLLECTION,
    params: ({ doc, assignee, status, collection }) => ({
      $filters: getFilters({ collection, doc, assignee, status }),
      ...taskTableFragment,
    }),
    queryOptions: { reactive: false },
    dataName: 'tasks',
    refetchOnMethodCall: [
      taskInsert,
      taskUpdate,
      taskChangeStatus,
      taskComplete,
    ],
  }),
  withProps(({ withQueryTaskInsert, withTaskInsert }) => {
    if (!withTaskInsert || !withQueryTaskInsert) {
      return {};
    }

    const initialSearchParams = useSearchParams();
    const [searchParams, setSearchParams] = useState(initialSearchParams);
    return {
      model: searchParams,
      openOnMount: searchParams.addTask,
      resetForm: () => setSearchParams({}),
    };
  }),
)(CollectionTasksTable);
