// @flow
import React, { useState } from 'react';

import T from 'core/components/Translation';
import Select from 'core/components/Select';
import { REVENUE_STATUS, REVENUE_TYPES } from 'core/api/constants';
import MongoSelect from 'core/components/Select/MongoSelect';
import employees from 'core/arrays/epotekEmployees';
import RevenuesTable from '../../../components/RevenuesTable';

type RevenuesPageTableProps = {};

const RevenuesPageTable = (props: RevenuesPageTableProps) => {
  const [type, setType] = useState();
  const [assignee, setAssignee] = useState(null);
  const [status, setStatus] = useState({ $in: [REVENUE_STATUS.EXPECTED] });
  const options = Object.values(REVENUE_STATUS).map(s => ({
    id: s,
    label: <T id={`Forms.status.${s}`} />,
  }));

  return (
    <>
      <div className="flex">
        <Select
          options={options}
          value={status.$in}
          label="Statut du revenu"
          onChange={selected => setStatus({ $in: selected })}
          multiple
          style={{ display: 'inline-flex', minWidth: 150 }}
          className="mr-8"
        />
        <MongoSelect
          value={type}
          onChange={setType}
          options={REVENUE_TYPES}
          id="type"
          label={<T id="Forms.type" />}
          className="mr-8"
        />
        <Select
          value={assignee}
          onChange={setAssignee}
          options={[
            { id: null, label: 'Tous' },
            ...employees
              .filter(({ _id }) => !!_id)
              .map(({ _id, name }) => ({ id: _id, label: name })),
          ]}
          label="Conseiller"
          displayEmpty
        />
      </div>
      <RevenuesTable
        displayLoan
        displayActions
        filterRevenues={() => ({ status, type })}
        initialOrderBy={2}
        postFilter={revenues =>
          assignee
            ? revenues.filter(({ loan }) => {
                if (
                  loan &&
                  loan.userCache &&
                  loan.userCache.assignedEmployeeCache
                ) {
                  return loan.userCache.assignedEmployeeCache._id === assignee;
                }

                return false;
              })
            : revenues
        }
      />
    </>
  );
};

export default RevenuesPageTable;
