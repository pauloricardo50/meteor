import React, { useState } from 'react';
import { withSmartQuery } from 'core/api/containerToolkit';
import { compose, shouldUpdate, withState, withProps } from 'recompose';
import {
  taskInsert,
  taskUpdate,
  taskChangeStatus,
  taskComplete,
} from 'core/api/methods';
import useSearchParams from 'core/hooks/useSearchParams';
import { TASK_STATUS, TASKS_COLLECTION } from 'core/api/constants';
import Select from 'core/components/Select';
import { CollectionTasksTable } from '../../../components/TasksTable/CollectionTasksTable';
import { taskTableFragment } from '../../../components/TasksTable/TasksTable';
import InsuranceRequestTaskInserter from './InsuranceRequestTaskInserter';

const getFilters = ({ doc, assignee, status, docId }) => {
  const { _id: insuranceRequestId } = doc;

  let filters = { 'assigneeLink._id': assignee, status };

  if (docId === 'ALL') {
    filters = {
      ...filters,
      'insuranceRequestLink._id': insuranceRequestId,
    };
  } else if (docId === insuranceRequestId) {
    filters = {
      ...filters,
      'insuranceRequestLink._id': insuranceRequestId,
      insuranceLink: { $exists: false },
    };
  } else {
    filters = {
      ...filters,
      'insuranceLink._id': docId,
    };
  }

  return filters;
};

export default compose(
  shouldUpdate(() => false),
  withState('status', 'setStatus', { $in: [TASK_STATUS.ACTIVE] }),
  withState('docId', 'setDocId', 'ALL'),
  withSmartQuery({
    query: TASKS_COLLECTION,
    params: ({ doc, assignee, status, docId }) => ({
      $filters: getFilters({ docId, doc, assignee, status }),
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
  withProps(
    ({
      withQueryTaskInsert,
      withTaskInsert,
      doc: insuranceRequest,
      docId,
      setDocId,
    }) => {
      const {
        _id: insuranceRequestId,
        insurances = [],
        name,
      } = insuranceRequest;
      const additionalProps = {
        CustomTaskInserter: InsuranceRequestTaskInserter,
        additionalFilters: (
          <Select
            value={docId}
            label="Relatif à"
            options={[
              { id: 'ALL', label: 'Tous' },
              { id: insuranceRequestId, label: name },
              ...insurances.map(({ _id, name: insuranceName }) => ({
                id: _id,
                label: insuranceName,
              })),
            ]}
            onChange={setDocId}
          />
        ),
      };
      if (!withTaskInsert || !withQueryTaskInsert) {
        return additionalProps;
      }

      const initialSearchParams = useSearchParams();
      const [searchParams, setSearchParams] = useState(initialSearchParams);
      return {
        model: searchParams,
        openOnMount: searchParams.addTask,
        resetForm: () => setSearchParams({}),
        ...additionalProps,
      };
    },
  ),
)(CollectionTasksTable);
