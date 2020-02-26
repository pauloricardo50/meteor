import React, { useState } from 'react';

import { REVENUE_STATUS } from 'core/api/constants';
import Select from 'core/components/Select';
import T from 'core/components/Translation';
import RevenuesTable from '../../../components/RevenuesTable';

const RevenuesToPay = ({ _id: organisationId }) => {
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
      <RevenuesTable
        filterRevenues={() => ({
          sourceOrganisationId: organisationId,
          status,
        })}
      />
    </>
  );
};

export default RevenuesToPay;
