import React, { useState } from 'react';

import { PRO_COMMISSION_STATUS } from 'core/api/revenues/revenueConstants';
import Select from 'core/components/Select';
import Table from 'core/components/Table';
import T, { Money } from 'core/components/Translation';

import {
  formatRevenue,
  mapRevenueIntoCommissions,
  useCommissionsTableData,
} from './commissionsTableHelpers';

const columnOptions = [
  { id: 'organisationName', label: 'A payer' },
  { id: 'proName', label: 'Compte referral' },
  { id: 'status', label: 'Statut' },
  { id: 'date', label: 'Attendu/Encaissé/Payé' },
  { id: 'loan', label: 'Dossier' },
  { id: 'commissionRate', label: 'Taux' },
  { id: 'commissionAmount', label: 'Montant' },
  { id: 'actions', label: 'Actions' },
];

const CommissionsTable = () => {
  const [proCommissionStatus, setProCommissionStatus] = useState([
    PRO_COMMISSION_STATUS.COMMISSION_TO_PAY,
  ]);
  const [orgId, setOrgId] = useState();
  const { orgs, revenues, loading } = useCommissionsTableData(
    proCommissionStatus,
    orgId,
  );

  const formattedRevenues = (revenues || []).map(formatRevenue);

  const rows = formattedRevenues.reduce(
    (arr, revenue) => [...arr, ...mapRevenueIntoCommissions(revenue)],
    [],
  );

  const total = rows.reduce(
    (t, { commissionAmount }) => t + commissionAmount,
    0,
  );

  return (
    <>
      <div className="flex">
        <Select
          options={Object.values(PRO_COMMISSION_STATUS).map(s => ({
            id: s,
            label: <T id={`Forms.status.${s}`} />,
          }))}
          multiple
          onChange={setProCommissionStatus}
          value={proCommissionStatus}
          label="Statut"
          className="mr-8"
        />
        <Select
          options={[
            { id: undefined, label: 'Tous' },
            ...orgs.map(o => ({ id: o._id, label: o.name })),
          ]}
          onChange={setOrgId}
          value={orgId}
          label="A payer"
        />
      </div>

      <Table rows={rows} columnOptions={columnOptions} />
      {rows.length > 1 && (
        <h2 className="secondary" style={{ textAlign: 'right' }}>
          Total: <Money value={total} />
        </h2>
      )}
    </>
  );
};

export default CommissionsTable;
