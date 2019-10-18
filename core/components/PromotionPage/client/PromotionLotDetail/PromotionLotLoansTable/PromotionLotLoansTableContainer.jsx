import { Meteor } from 'meteor/meteor';

import React from 'react';
import { compose, withProps, mapProps } from 'recompose';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import withSmartQuery from '../../../../../api/containerToolkit/withSmartQuery';
import { proPromotionOptions } from '../../../../../api/promotionOptions/queries';
import {
  LOANS_COLLECTION,
  PROMOTION_OPTIONS_COLLECTION,
} from '../../../../../api/constants';
import T from '../../../../Translation';
import { CollectionIconLink } from '../../../../IconLink';
import LoanProgress from '../../../../LoanProgress';
import LoanProgressHeader from '../../../../LoanProgress/LoanProgressHeader';
import StatusLabel from '../../../../StatusLabel';
import PromotionCustomer from '../../PromotionCustomer';
import PromotionLotReservation from './PromotionLotReservation';
import PriorityOrder from './PriorityOrder';

const getColumns = ({ promotionLot, promotionOption }) => {
  const {
    _id: promotionLotId,
    promotion: { _id: promotionId },
  } = promotionLot;
  const {
    loan,
    custom,
    createdAt,
    status: promotionOptionStatus,
  } = promotionOption;
  const {
    status,
    user,
    loanProgress,
    promotionOptions = [],
    promotions,
  } = loan;

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
      raw: loanProgress.info + loanProgress.documents,
      label: <LoanProgress loanProgress={loanProgress} />,
    },
    custom,
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

const makeMapOption = ({ promotionLot }) => (promotionOption) => {
  const { _id: promotionOptionId } = promotionOption;

  return {
    id: promotionOptionId,
    columns: getColumns({ promotionLot, promotionOption }),
  };
};

const columnOptions = [
  { id: 'loanName', style: { whiteSpace: 'nowrap' } },
  { id: 'status', label: <T id="Forms.status" /> },
  { id: 'customer' },
  { id: 'date' },
  { id: 'loanProgress', label: <LoanProgressHeader /> },
  { id: 'custom' },
  { id: 'priorityOrder' },
  { id: 'attribute' },
].map(({ id, label }) => ({
  id,
  label: label || <T id={`PromotionLotLoansTable.${id}`} />,
}));

export default compose(
  mapProps(({ promotionOptions = [], promotionLot }) => ({
    promotionOptionIds: promotionOptions.map(({ _id }) => _id),
    promotionLot,
  })),
  withSmartQuery({
    query: proPromotionOptions,
    params: ({ promotionOptionIds }) => ({ promotionOptionIds }),
    queryOptions: { reactive: false, shouldRefetch: () => false },
    dataName: 'promotionOptions',
  }),
  withRouter,
  withProps(({ promotionOptions = [], promotionLot }) => ({
    rows: promotionOptions.map(makeMapOption({ promotionLot })),
    columnOptions,
  })),
);
