import React, { useState } from 'react';

import Select from 'core/components/Select';

import CollectionTasksDataTable from '../../../components/TasksDataTable/CollectionTasksDataTable';
import InsuranceRequestTaskInserter from './InsuranceRequestTaskInserter';

const getFilters = ({ insuranceRequestId, docId }) => {
  if (docId === 'ALL') {
    return { 'insuranceRequestLink._id': insuranceRequestId };
  }

  if (docId === insuranceRequestId) {
    return {
      'insuranceRequestLink._id': insuranceRequestId,
      insuranceLink: { $exists: false },
    };
  }

  return { 'insuranceLink._id': docId };
};

const InsuranceRequestTasksTable = ({ insuranceRequest, ...rest }) => {
  const [docId, setDocId] = useState('ALL');
  const { _id: insuranceRequestId, insurances = [], name } = insuranceRequest;

  return (
    <CollectionTasksDataTable
      filters={getFilters({ docId, insuranceRequestId })}
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
