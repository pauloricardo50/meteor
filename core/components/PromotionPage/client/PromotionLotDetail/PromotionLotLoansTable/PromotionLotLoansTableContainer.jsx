import { Meteor } from 'meteor/meteor';

import React from 'react';
import { compose, withProps, mapProps, withState } from 'recompose';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import withSmartQuery from '../../../../../api/containerToolkit/withSmartQuery';
import { proPromotionOptions } from '../../../../../api/promotionOptions/queries';
import {
  LOANS_COLLECTION,
  PROMOTION_OPTIONS_COLLECTION,
  LOAN_STATUS,
} from '../../../../../api/constants';
import T from '../../../../Translation';
import { CollectionIconLink } from '../../../../IconLink';
import StatusLabel from '../../../../StatusLabel';
import PromotionCustomer from '../../PromotionCustomer';
import PromotionLotReservation from './PromotionLotReservation';
import PriorityOrder from './PriorityOrder';

const getColumns = ({ promotionLot, promotionOption }) => {
  const {
    _id: promotionLotId,
    promotion: { _id: promotionId },
  } = promotionLot;
  const { loan, createdAt, status: promotionOptionStatus } = promotionOption;
  const { status, user, promotionOptions = [], promotions } = loan;

  const promotion = promotions.find(({ _id }) => _id === promotionId);

  const {
    $metadata: { invitedBy },
    users: promotionUsers = [],
  } = promotion;

  return [
    <CollectionIconLink
      key="loan"
      relatedDoc={{ ...loan, collection: LOANS_COLLECTION }}
      noRoute={Meteor.microservice === 'pro'}
    />,
    {
      raw: status,
      label: (
        <>
          <StatusLabel
            status={status}
            collection={LOANS_COLLECTION}
            className="mr-8"
          />
          <StatusLabel
            status={promotionOptionStatus}
            collection={PROMOTION_OPTIONS_COLLECTION}
          />
        </>
      ),
    },
    {
      raw: user.name,
      label: (
        <PromotionCustomer
          user={user}
          invitedBy={invitedBy}
          promotionUsers={promotionUsers}
        />
      ),
    },
    { raw: createdAt.getTime(), label: moment(createdAt).fromNow() },
    {
      raw: promotionOptions.length,
      label: (
        <PriorityOrder
          promotion={promotion}
          promotionOptions={promotionOptions}
          userId={user && user._id}
          currentId={promotionLotId}
        />
      ),
    },
    <PromotionLotReservation
      loan={loan}
      promotion={promotion}
      promotionOption={promotionOption}
      key="promotionLotAttributer"
    />,
  ];
};

const makeMapOption = ({ promotionLot }) => promotionOption => {
  const { _id: promotionOptionId } = promotionOption;

  return {
    id: promotionOptionId,
    columns: getColumns({ promotionLot, promotionOption }),
  };
};

const columnOptions = [
  { id: 'loanName', style: { whiteSpace: 'nowrap' } },
  { id: 'status', label: <T id="Forms.status" /> },
  { id: 'buyer' },
  { id: 'date' },
  { id: 'priorityOrder' },
  { id: 'attribute' },
].map(({ id, label }) => ({
  id,
  label: label || <T id={`PromotionLotLoansTable.${id}`} />,
}));

export default compose(
  mapProps(({ promotionLot }) => ({ promotionLot })),
  withState('status', 'setStatus', {
    $in: Object.values(LOAN_STATUS).filter(
      s => s !== LOAN_STATUS.UNSUCCESSFUL && s !== LOAN_STATUS.TEST,
    ),
  }),
  withSmartQuery({
    query: proPromotionOptions,
    params: ({ promotionLot: { _id: promotionLotId }, status }) => ({
      promotionLotId,
      loanStatus: status,
    }),
    queryOptions: {
      reactive: false,
      shouldRefetch: (
        {
          query: {
            params: { loanStatus: prevLoanStatus },
          },
        },
        {
          query: {
            params: { loanStatus: nextLoanStatus },
          },
        },
      ) => prevLoanStatus !== nextLoanStatus,
    },
    dataName: 'promotionOptions',
  }),
  withRouter,
  withProps(({ promotionOptions = [], promotionLot }) => ({
    rows: promotionOptions.map(makeMapOption({ promotionLot })),
    columnOptions,
  })),
);
