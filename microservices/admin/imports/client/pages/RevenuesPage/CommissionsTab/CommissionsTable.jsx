import React, { useState } from 'react';

import { REVENUE_STATUS, COMMISSION_STATUS } from 'core/api/constants';
import Select from 'core/components/Select';
import T from 'core/components/Translation';
import MongoSelect from 'core/components/Select/MongoSelect';
import CommissionsTableContainer from './CommissionsTableContainer';
import { RevenuesTable } from '../../../components/RevenuesTable/RevenuesTable';

const WrappedRevenuesTable = CommissionsTableContainer(RevenuesTable);

const CommissionsTable = props => {
  const [status, setStatus] = useState(undefined);
  const [commissionStatus, setCommissionStatus] = useState([
    COMMISSION_STATUS.TO_BE_PAID,
  ]);
  const options = Object.values(COMMISSION_STATUS).map(id => ({
    id,
    label: <T id={`Forms.status.${id}`} />,
  }));

  return (
    <>
      <MongoSelect
        label="Statut du revenu"
        value={status}
        onChange={setStatus}
        options={REVENUE_STATUS}
        id="status"
        style={{ display: 'inline-flex', minWidth: 150 }}
        className="mr-8"
      />
      <Select
        label="Statut de la commission"
        value={commissionStatus}
        onChange={setCommissionStatus}
        options={options}
        multiple
        style={{ display: 'inline-flex', minWidth: 200 }}
      />

      <WrappedRevenuesTable
        {...props}
        filterRevenues={() => ({ status })}
        commissionStatus={commissionStatus}
      />
    </>
  );
};

export default CommissionsTable;
