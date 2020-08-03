import React, { useState } from 'react';

import Select from 'core/components/Select';

import CollectionTasksDataTable from '../../../components/TasksDataTable/CollectionTasksDataTable';
import InsuranceRequestTaskInserter from './InsuranceRequestTaskInserter';

const getFilters = ({ insuranceRequest, assignee, status, docId }) => {
  const { _id: insuranceRequestId } = insuranceRequest;

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

const InsuranceRequestTasksTable = ({ insuranceRequest, ...rest }) => {
  const [docId, setDocId] = useState('ALL');
  const { _id: insuranceRequestId, insurances = [], name } = insuranceRequest;

  return (
    <CollectionTasksDataTable
      filters={getFilters({ docId, insuranceRequest })}
      TaskInserter={props => (
        <InsuranceRequestTaskInserter
          {...props}
          insuranceRequest={insuranceRequest}
        />
      )}
      additionalFilters={
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
      }
      noInitialFilter
      {...rest}
    />
  );
};

export default InsuranceRequestTasksTable;
