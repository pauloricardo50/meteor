import { Meteor } from 'meteor/meteor';

import React from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { compose, mapProps, withProps, withState } from 'recompose';

import withSmartQuery from '../../../../../api/containerToolkit/withSmartQuery';
import {
  LOANS_COLLECTION,
  LOAN_STATUS,
} from '../../../../../api/loans/loanConstants';
import { PROMOTION_OPTIONS_COLLECTION } from '../../../../../api/promotionOptions/promotionOptionConstants';
import { proPromotionOptions } from '../../../../../api/promotionOptions/queries';
import { CollectionIconLink } from '../../../../IconLink';
import StatusLabel from '../../../../StatusLabel';
import T from '../../../../Translation';
import PromotionCustomer from '../../PromotionCustomer';
import PriorityOrder from './PriorityOrder';
import PromotionLotReservation from './PromotionLotReservation';

const getColumns = ({ promotionLot, promotionOption }) => {
  const {
    _id: promotionLotId,
    promotion: { _id: promotionId },
  } = promotionLot;
  const {
    loan,
    createdAt,
    status: promotionOptionStatus,
    _collection: _collection2,
  } = promotionOption;
  const { status, user, promotionOptions = [], promotions, _collection } = loan;

  const promotion = promotions.find(({ _id }) => _id === promotionId);

  const {
    $metadata: { invitedBy },
    users: promotionUsers = [],
  } = promotion;

  return [
    <CollectionIconLink
      key="loan"
      relatedDoc={loan}
      noRoute={Meteor.microservice === 'pro'}
    />,
    {
      raw: status,
      label: (
        <>
          <StatusLabel
            status={status}
            collection={_collection}
            className="mr-8"
          />
          <StatusLabel
            status={promotionOptionStatus}
            collection={_collection2}
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
      $body: {
        bank: 1,
        createdAt: 1,
        reservationDeposit: 1,
        simpleVerification: 1,
        fullVerification: 1,
        priority: 1,
        promotionLots: { name: 1, promotion: { name: 1 } },
        reservationAgreement: 1,
        status: 1,
        updatedAt: 1,
        loan: {
          promotions: {
            users: { name: 1, organisations: { name: 1 } },
            agreementDuration: 1,
          },
          promotionOptions: {
            name: 1,
            promotionLots: {
              attributedTo: { user: { _id: 1 } },
              status: 1,
            },
            loan: { _id: 1 },
          },
          proNote: 1,
          status: 1,
          user: { phoneNumbers: 1, name: 1, email: 1 },
        },
        promotion: { users: { _id: 1 }, agreementDuration: 1 },
      },
    }),
    dataName: 'promotionOptions',
    deps: ({ status }) => [status],
  }),
  withRouter,
  withProps(({ promotionOptions = [], promotionLot }) => ({
    rows: promotionOptions.map(makeMapOption({ promotionLot })),
    columnOptions,
  })),
);
