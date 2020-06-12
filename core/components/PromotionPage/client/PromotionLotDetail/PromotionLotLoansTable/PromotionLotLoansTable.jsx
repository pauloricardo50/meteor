import { Meteor } from 'meteor/meteor';

import React, { useState } from 'react';

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

const PromotionLotLoansTable = ({ promotionLotId }) => {
  const [status, setStatus] = useState({
    $in: Object.values(LOAN_STATUS).filter(
      s => s !== LOAN_STATUS.UNSUCCESSFUL && s !== LOAN_STATUS.TEST,
    ),
  });

  return (
    <>
      <MongoSelect
        value={status}
        onChange={setStatus}
        options={LOAN_STATUS}
        id="status"
        label={<T id="PromotionLotLoansTable.loanStatus" />}
        style={{ minWidth: 250 }}
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
              invitedBy: 1,
              fullVerification: 1,
              loan: {
                status: 1,
                promotionOptions: { name: 1, priorityOrder: 1 },
                user: { name: 1, email: 1, phoneNumber: 1 },
              },
              priorityOrder: 1,
              status: 1,
            },
          },
        }}
        queryDeps={[status]}
        initialSort="status"
        columns={[
          {
            accessor: 'loan._id',
            Header: <T id="PromotionLotLoansTable.loanName" />,
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
            Header: <T id="PromotionLotLoansTable.status" />,
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
                <StatusLabel
                  status={value}
                  collection={PROMOTION_OPTIONS_COLLECTION}
                />
              </>
            ),
          },
          {
            accessor: 'buyer',
            Header: <T id="PromotionLotLoansTable.buyer" />,
            disableSortBy: true,
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
            Header: <T id="PromotionLotLoansTable.date" />,
            Cell: ({ value }) => (
              <IntlDate value={value} type="relative" style="long" />
            ),
          },
          {
            accessor: 'loanCache.0.promotionLinks.0.priorityOrder',
            Header: <T id="PromotionLotLoansTable.priorityOrder" />,
            // Cell: ({
            //   row: {
            //     original: {
            //       loan: { promotionOptions },
            //     },
            //   },
            // }) => (
            //   <PriorityOrder
            //     promotionOptions={promotionOptions}
            //     // userId={user?._id}
            //     // currentId={promotionLotId}
            //   />
            // ),
          },
          {
            accessor: 'attribute',
            Header: <T id="PromotionLotLoansTable.attribute" />,
            disableSortBy: true,
            // Cell: ({}) => (
            //   <PromotionLotReservation
            //     loan={loan}
            //     promotion={promotion}
            //     promotionOption={promotionOption}
            //     key="promotionLotAttributer"
            //   />
            // ),
          },
        ]}
      />
    </>
  );
};
export default PromotionLotLoansTable;
