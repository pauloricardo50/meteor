import React, { useState } from 'react';
import moment from 'moment';

import { proRevenues } from 'core/api/revenues/queries';
import { PRO_COMMISSION_STATUS } from 'core/api/revenues/revenueConstants';
import {
  getProCommissionDate,
  getProCommissionStatus,
} from 'core/api/revenues/revenueHelpers';
import Select from 'core/components/Select';
import Table from 'core/components/Table';
import T, { Money, Percent } from 'core/components/Translation';
import useCurrentUser from 'core/hooks/useCurrentUser';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

const columnOptions = [
  { id: 'loanName' },
  { id: 'customer' },
  { id: 'referredByUser' },
  { id: 'status' },
  { id: 'date' },
  {
    id: 'commissionRate',
    format: v => <Percent value={v} />,
  },
  {
    id: 'commissionValue',
    format: v => <Money value={v} />,
  },
].map(obj => ({
  ...obj,
  label: <T id={`ProRevenuesTable.${obj.id}`} />,
}));

const formatRevenue = revenue => {
  const { loan, insuranceRequest } = revenue;
  const user = loan ? loan.user : insuranceRequest?.user;
  const name = loan
    ? loan.name
    : insuranceRequest?.name
        ?.split('-')
        ?.slice(0, 2)
        ?.join('-');

  return { ...revenue, user, name };
};

const mapRevenueToRow = (
  {
    _id,
    amount,
    organisationLinks,
    status: revenueStatus,
    expectedAt,
    paidAt: revenuePaidAt,
    user,
    name,
  },
  mainOrg,
) => {
  const {
    commissionRate,
    paidAt,
    status: commissionStatus,
  } = organisationLinks.find(
    ({ _id: organisationLinkId }) => organisationLinkId === mainOrg._id,
  );

  const status = getProCommissionStatus(revenueStatus, commissionStatus);

  const date = getProCommissionDate({
    revenueStatus,
    commissionStatus,
    expectedAt,
    revenuePaidAt,
    commissionPaidAt: paidAt,
  });

  const commissionAmount = amount * commissionRate;

  return {
    id: _id,
    commissionAmount,
    columns: [
      name,
      user?.name,
      user?.referredByUser?.name,
      { raw: status, label: <T id={`Forms.status.${status}`} /> },
      {
        raw: date?.getTime(),
        label: moment(date).format('D MMMM YYYY'),
      },
      commissionRate,
      commissionAmount,
    ],
  };
};

const ProRevenuesTable = () => {
  const [proCommissionStatus, setProCommissionStatus] = useState([
    PRO_COMMISSION_STATUS.WAITING_FOR_REVENUE,
    PRO_COMMISSION_STATUS.COMMISSION_TO_PAY,
  ]);
  const currentUser = useCurrentUser();
  const mainOrg = currentUser.organisations.find(
    ({ $metadata }) => $metadata?.isMain,
  );
  const { data: revenues, loading } = useStaticMeteorData(
    {
      query: proRevenues,
      params: { proCommissionStatus },
    },
    [proCommissionStatus],
  );
  // Do this because revenues can be null
  const formattedRevenues = (revenues || []).map(formatRevenue);

  const rows = formattedRevenues.reduce(
    (arr, revenue) => [...arr, mapRevenueToRow(revenue, mainOrg)],
    [],
  );

  const total = rows.reduce(
    (t, { commissionAmount }) => t + commissionAmount,
    0,
  );

  return (
    <div>
      <h2>Liste</h2>

      <Select
        options={Object.values(PRO_COMMISSION_STATUS).map(s => ({
          id: s,
          label: <T id={`Forms.status.${s}`} />,
        }))}
        multiple
        onChange={setProCommissionStatus}
        value={proCommissionStatus}
        label="Statut"
      />
      <Table
        rows={rows}
        columnOptions={columnOptions}
        initialOrderBy="referredByUser"
      />
      {rows.length > 1 && (
        <h2 className="secondary" style={{ textAlign: 'right' }}>
          Total: <Money value={total} />
        </h2>
      )}
    </div>
  );
};

export default ProRevenuesTable;
