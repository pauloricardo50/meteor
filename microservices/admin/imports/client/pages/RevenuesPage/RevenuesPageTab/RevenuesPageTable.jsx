// @flow
import React, { useState } from 'react';

import T from 'core/components/Translation';
import Select from 'core/components/Select';
import { REVENUE_STATUS } from 'core/api/constants';
import RevenuesTable from '../../SingleLoanPage/LoanTabs/RevenuesTab/RevenuesTable';

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
        label="Statut"
        onChange={(_, selected) => setStatus({ $in: selected })}
        multiple
        renderValue={values =>
          values
            .map(value => options.find(({ id }) => id === value).label)
            .map((v, i) => [i !== 0 && ', ', v])
        }
        style={{ display: 'inline-block' }}
      />
      <RevenuesTable
        displayLoan
        filterRevenues={() => ({ status })}
        initialOrderBy={2}
      />
    </>
  );
};

export default RevenuesPageTable;
