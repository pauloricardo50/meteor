import React, { useContext } from 'react';
import moment from 'moment';

import Table from 'core/components/Table';
import T, { Percent, Money } from 'core/components/Translation';
import { proRevenues } from 'core/api/revenues/queries';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import {
  REVENUE_STATUS,
  LOANS_COLLECTION,
  COMMISSION_STATUS,
  PRO_COMMISSION_STATUS,
} from 'core/api/constants';
import StatusLabel from 'core/components/StatusLabel';

const columnOptions = [
  { id: 'loanName' },
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

const mapRevenueToRow = (
  {
    _id,
    amount,
    organisationLinks,
    status: revenueStatus,
    loan,
    expectedAt,
    paidAt: revenuePaidAt,
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

  const status =
    revenueStatus === REVENUE_STATUS.EXPECTED
      ? PRO_COMMISSION_STATUS.WAITING_FOR_REVENUE
      : commissionStatus === COMMISSION_STATUS.TO_BE_PAID
      ? PRO_COMMISSION_STATUS.COMMISSION_TO_PAY
      : PRO_COMMISSION_STATUS.COMMISSION_PAID;

  const date =
    revenueStatus === REVENUE_STATUS.EXPECTED
      ? expectedAt
      : commissionStatus === COMMISSION_STATUS.TO_BE_PAID
      ? revenuePaidAt
      : paidAt;

  return {
    id: _id,
    columns: [
      {
        raw: loan.name,
        label: (
          <span>
            {loan.name}&nbsp;
            <StatusLabel status={loan.status} collection={LOANS_COLLECTION} />
          </span>
        ),
      },
      { raw: status, label: <T id={`ProRevenuesTable.status.${status}`} /> },
      {
        raw: date && date.getTime(),
        label: moment(date).format('D MMMM YYYY'),
      },
      commissionRate,
      amount * commissionRate,
    ],
  };
};

const ProRevenuesTable = () => {
  const currentUser = useContext(CurrentUserContext);
  const mainOrg = currentUser.organisations.find(
    ({ $metadata }) => $metadata?.isMain,
  );
  const { data: revenues = [], loading } = useStaticMeteorData({
    query: proRevenues,
    params: {},
  });
  const rows = revenues.reduce(
    (arr, revenue) => [...arr, mapRevenueToRow(revenue, mainOrg)],
    [],
  );

  return (
    <div>
      <h2>Liste</h2>

      <Table rows={rows} columnOptions={columnOptions} initialOrderBy={2} />
    </div>
  );
};

export default ProRevenuesTable;
