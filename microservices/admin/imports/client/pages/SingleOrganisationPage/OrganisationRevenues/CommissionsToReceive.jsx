// @flow
import React, { useState } from 'react';

import T from 'core/components/Translation';
import Select from 'core/components/Select';
import { REVENUE_STATUS } from 'core/api/constants';
import { RevenuesTable } from '../../../components/RevenuesTable/RevenuesTable';
import CommissionsToReceiveContainer from './CommissionsToReceiveContainer';

type CommissionsToReceiveProps = {};

const WrappedRevenuesTable = CommissionsToReceiveContainer(RevenuesTable);

const CommissionsToReceive = (props: CommissionsToReceiveProps) => {
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
        onChange={(_, selected) => setStatus({ $in: selected })}
        multiple
        style={{ display: 'inline-block' }}
      />
      <WrappedRevenuesTable
        {...props}
        filterRevenues={() => ({ organisationId, status })}
      />
    </>
  );
};

export default CommissionsToReceive;
