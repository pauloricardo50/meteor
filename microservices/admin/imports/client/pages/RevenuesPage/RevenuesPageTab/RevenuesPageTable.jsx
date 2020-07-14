import React, { useState } from 'react';

import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import {
  REVENUE_STATUS,
  REVENUE_TYPES,
} from 'core/api/revenues/revenueConstants';
import employees from 'core/arrays/epotekEmployees';
import Select from 'core/components/Select';
import MongoSelect from 'core/components/Select/MongoSelect';
import T from 'core/components/Translation';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

import RevenuesTable from '../../../components/RevenuesTable';
import { revenuesFilter } from './revenuePageHelpers';

const RevenuesPageTable = () => {
  const [type, setType] = useState();
  const [assignee, setAssignee] = useState(null);
  const [referrer, setReferrer] = useState(null);
  const [status, setStatus] = useState({ $in: [REVENUE_STATUS.EXPECTED] });
  const options = Object.values(REVENUE_STATUS).map(s => ({
    id: s,
    label: <T id={`Forms.status.${s}`} />,
  }));

  const {
    data: referringOrganisations,
    loading: orgLoading,
  } = useStaticMeteorData({
    query: ORGANISATIONS_COLLECTION,
    params: { $filters: { referredUsersCount: { $gte: 1 } }, name: 1 },
  });

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
          className="mr-8"
          style={{ minWidth: 160 }}
        />
        {!orgLoading && (
          <Select
            value={referrer}
            onChange={setReferrer}
            options={[
              { id: null, label: 'Tous' },
              ...referringOrganisations
                .filter(({ _id }) => !!_id)
                .map(({ _id, name }) => ({ id: _id, label: name })),
            ]}
            label="Organisation référante"
            displayEmpty
            style={{ minWidth: 240 }}
            className="mr-8"
          />
        )}
      </div>
      <RevenuesTable
        filterRevenues={{ status, type }}
        initialOrderBy="date"
        deps={[status, type]}
        postFilter={revenues =>
          revenuesFilter({ assignee, referrer, revenues })
        }
      />
    </>
  );
};

export default RevenuesPageTable;
