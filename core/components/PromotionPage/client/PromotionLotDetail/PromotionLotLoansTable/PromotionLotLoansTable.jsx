import { Meteor } from 'meteor/meteor';

import React, { useMemo, useState } from 'react';

import {
  LOANS_COLLECTION,
  LOAN_STATUS,
} from '../../../../../api/loans/loanConstants';
import { PROMOTION_OPTIONS_COLLECTION } from '../../../../../api/promotionOptions/promotionOptionConstants';
import { proPromotionOptions } from '../../../../../api/promotionOptions/queries';
import DataTable from '../../../../DataTable';
import { CollectionIconLink } from '../../../../IconLink';
import MongoSelect from '../../../../Select/MongoSelect';
import StatusLabel from '../../../../StatusLabel';
import T, { IntlDate } from '../../../../Translation';
import PromotionCustomer from '../../PromotionCustomer';
import PriorityOrder from './PriorityOrder';
import PromotionLotReservation from './PromotionLotReservation/PromotionLotReservation';

const columns = promotionLotId => [
  {
    accessor: 'loan._id',
    Header: <T defaultMessage="Dossier" />,
    style: { whiteSpace: 'nowrap' },
    disableSortBy: true,
    Cell: ({
      row: {
        original: { loan },
      },
    }) => (
      <CollectionIconLink
        key="loan"
        relatedDoc={loan}
        noRoute={Meteor.microservice === 'pro'}
      />
    ),
  },
  {
    accessor: 'status',
    Header: <T defaultMessage="Niveau d'intérêt" />,
    Cell: ({
      value,
      row: {
        original: {
          loan: { status: loanStatus },
        },
      },
    }) => (
      <>
        <StatusLabel
          status={loanStatus}
          collection={LOANS_COLLECTION}
          className="mr-4"
        />
        <StatusLabel status={value} collection={PROMOTION_OPTIONS_COLLECTION} />
      </>
    ),
  },
  {
    accessor: 'loanCache.0.userCache.lastName',
    Header: <T defaultMessage="Acquéreur" />,
    // disableSortBy: true,
    Cell: ({
      row: {
        original: {
          invitedBy,
          loan: { user },
        },
      },
    }) => <PromotionCustomer user={user} invitedBy={invitedBy} />,
  },
  {
    accessor: 'createdAt',
    Header: <T defaultMessage="Date du choix" />,
    Cell: ({ value }) => (
      <IntlDate value={value} type="relative" style="long" />
    ),
  },
  {
    accessor: 'loanCache.0.promotionLinks.0.priorityOrder',
    Header: <T defaultMessage="Priorité" />,
    Cell: ({
      row: {
        original: {
          loan: { _id: loanId, promotionOptions },
        },
      },
    }) => (
      <PriorityOrder
        promotionOptions={promotionOptions}
        loanId={loanId}
        currentPromotionLotId={promotionLotId}
      />
    ),
  },
  {
    accessor: 'attribute',
    Header: <T defaultMessage="Attribution" />,
    disableSortBy: true,
    Cell: ({ row: { original: promotionOption } }) => (
      <PromotionLotReservation promotionOption={promotionOption} />
    ),
  },
];

const PromotionLotLoansTable = ({ promotionLotId }) => {
  const [status, setStatus] = useState({
    $in: Object.values(LOAN_STATUS).filter(
      s => s !== LOAN_STATUS.UNSUCCESSFUL && s !== LOAN_STATUS.TEST,
    ),
  });

  const memoColumns = useMemo(() => columns(promotionLotId), []);

  return (
    <>
      <MongoSelect
        value={status}
        onChange={setStatus}
        options={LOAN_STATUS}
        id="status"
        label={<T id="PromotionLotLoansTable.loanStatus" />}
        style={{ minWidth: 250, marginBottom: 16 }}
      />

      <DataTable
        queryConfig={{
          query: proPromotionOptions,
          params: {
            promotionLotId,
            loanStatus: status,
            $body: {
              bank: 1,
              createdAt: 1,
              fullVerification: 1,
              invitedBy: 1,
              loan: {
                promotionOptions: {
                  name: 1,
                  priorityOrder: 1,
                  promotionLots: { attributedToLink: 1 },
                },
                proNote: 1,
                status: 1,
                user: { name: 1, email: 1, phoneNumber: 1 },
              },
              priorityOrder: 1,
              promotionLots: { status: 1, name: 1 },
              reservationAgreement: 1,
              reservationDeposit: 1,
              simpleVerification: 1,
              status: 1,
            },
          },
        }}
        queryDeps={[status]}
        initialSort="status"
        columns={memoColumns}
      />
    </>
  );
};

export default PromotionLotLoansTable;
