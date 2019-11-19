// @flow
import React, { useState } from 'react';

import T from 'core/components/Translation';
import Select from 'core/components/Select';
import { REVENUE_STATUS } from 'core/api/constants';
import RevenuesTable from '../../../components/RevenuesTable';

type RevenuesPageTableProps = {};

const RevenuesPageTable = (props: RevenuesPageTableProps) => {
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
        label="Statut du revenu"
        onChange={selected => setStatus({ $in: selected })}
        multiple
        style={{ display: 'inline-flex', minWidth: 150 }}
      />
      <RevenuesTable
        displayLoan
        displayActions
        filterRevenues={() => ({ status })}
        initialOrderBy={2}
      />
    </>
  );
};

export default RevenuesPageTable;
