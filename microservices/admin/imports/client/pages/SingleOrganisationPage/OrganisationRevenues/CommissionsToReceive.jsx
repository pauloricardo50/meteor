import React, { useState } from 'react';

import { REVENUE_STATUS } from 'core/api/revenues/revenueConstants';
import Select from 'core/components/Select';
import T from 'core/components/Translation';

import { RevenuesTable } from '../../../components/RevenuesTable/RevenuesTable';
import CommissionsToReceiveContainer from './CommissionsToReceiveContainer';

const WrappedRevenuesTable = CommissionsToReceiveContainer(RevenuesTable);

const CommissionsToReceive = props => {
  const { _id: organisationId } = props;
  const [status, setStatus] = useState({ $in: [REVENUE_STATUS.EXPECTED] });
  const options = Object.values(REVENUE_STATUS).map(s => ({
    id: s,
    label: <T id={`Forms.status.${s}`} />,
  }));

  return (
    <>
      <Select
        options={options}
        value={status.$in}
        label="Statut"
        onChange={selected => setStatus({ $in: selected })}
        multiple
        style={{ display: 'inline-block' }}
      />
      <WrappedRevenuesTable
        {...props}
        filterRevenues={() => ({
          organisationLinks: { $elemMatch: { _id: organisationId } },
          status,
        })}
      />
    </>
  );
};

export default CommissionsToReceive;
