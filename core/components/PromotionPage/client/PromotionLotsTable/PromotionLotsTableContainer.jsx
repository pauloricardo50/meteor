import { Meteor } from 'meteor/meteor';

import React from 'react';
import { compose, withProps, withStateHandlers } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit/index';
import {
  proPromotionLots,
  appPromotionLots,
} from 'core/api/promotionLots/queries';
import T, { Money } from '../../../Translation';
import LotChip from './LotChip';
import PromotionLotSelector from './PromotionLotSelector';
import StatusLabel from '../../../StatusLabel';
import {
  PROMOTION_LOTS_COLLECTION,
  PROMOTION_LOT_STATUS,
  PROMOTION_STATUS,
} from '../../../../api/constants';
import PromotionCustomer from '../PromotionCustomer';

export const isLotAttributedToMe = ({ promotionOptions, promotionLotId }) => {
  const promotionLots = promotionOptions.filter(option => option.promotionLots[0]._id === promotionLotId);
  return !!(promotionLots[0] && promotionLots[0].attributedToMe);
};

const isAnyLotAttributedToMe = promotionLots =>
  promotionLots.filter(({ attributedTo }) =>
    attributedTo && attributedTo.user._id === Meteor.userId()).length > 0;

const proColumnOptions = [
  { id: 'name' },
  { id: 'status' },
  {
    id: 'totalValue',
    style: { whiteSpace: 'nowrap' },
    align: 'right',
    format: value => (
      <b>
        <Money value={value} />
      </b>
    ),
  },
  { id: 'lots' },
  { id: 'loans' },
  { id: 'attributedTo' },
].map(column => ({
  ...column,
  label: <T id={`PromotionPage.lots.${column.id}`} />,
}));

const appColumnOptions = ({ isALotAttributedToMe, promotionStatus }) =>
  [
    { id: 'name' },
    { id: 'status' },
    {
      id: 'totalValue',
      style: { whiteSpace: 'nowrap' },
      align: 'right',
      format: value => (
        <b>
          <Money value={value} />
        </b>
      ),
    },
    { id: 'lots' },
    !isALotAttributedToMe
      && promotionStatus === PROMOTION_STATUS.OPEN && {
      id: 'interested',
      padding: 'checkbox',
    },
  ]
    .filter(x => x)
    .map(column => ({
      ...column,
      label: <T id={`PromotionPage.lots.${column.id}`} />,
    }));

const makeMapProPromotionLot = ({ promotion }) => (promotionLot) => {
  const {
    _id: promotionLotId,
    name,
    status,
    lots,
    promotionOptions,
    value,
    attributedTo,
  } = promotionLot;

  let invitedBy;
  const { _id: loanId } = attributedTo || {};
  const { loans = [], users: promotionUsers = [] } = promotion;

  if (loanId) {
    const { $metadata = {} } = loans.find(({ _id }) => _id === loanId);
    invitedBy = $metadata.invitedBy;
  }

  return {
    id: promotionLotId,
    promotionLot,
    columns: [
      name,
      {
        raw: status,
        label: (
          <StatusLabel
            status={status}
            collection={PROMOTION_LOTS_COLLECTION}
            key="status"
          />
        ),
      },
      value,
      {
        raw: lots && lots.length,
        label: (
          <div className="lot-chips">
            {lots && lots.map(lot => <LotChip lot={lot} key={lot._id} />)}
          </div>
        ),
      },
      promotionOptions.length,
      attributedTo && (
        <PromotionCustomer
          user={attributedTo.user}
          invitedBy={invitedBy}
          promotionUsers={promotionUsers}
        />
      ),
    ],
  };
};

const makeMapAppPromotionLot = ({
  loan: { _id: loanId, promotionOptions },
  isALotAttributedToMe,
  promotionStatus,
  promotionId,
}) => (promotionLot) => {
  const {
    _id: promotionLotId,
    name,
    status,
    reducedStatus,
    lots,
    value,
  } = promotionLot;

  return {
    id: promotionLotId,
    columns: [
      name,
      {
        raw: status,
        label: (
          <StatusLabel
            status={reducedStatus}
            collection={PROMOTION_LOTS_COLLECTION}
          />
        ),
      },
      reducedStatus === PROMOTION_LOT_STATUS.SOLD ? 0 : value,
      {
        raw: lots && lots.length,
        label: (
          <div className="lot-chips">
            {lots && lots.map(lot => <LotChip lot={lot} key={lot._id} />)}
          </div>
        ),
      },
      !isALotAttributedToMe && promotionStatus === PROMOTION_STATUS.OPEN && (
        <div key="PromotionLotSelector" onClick={e => e.stopPropagation()}>
          <PromotionLotSelector
            promotionLotId={promotionLotId}
            promotionOptions={promotionOptions}
            loanId={loanId}
            disabled={
              isLotAttributedToMe({ promotionOptions, promotionLotId })
              || status !== PROMOTION_LOT_STATUS.AVAILABLE
            }
            promotionId={promotionId}
          />
        </div>
      ),
    ].filter(x => x !== false),
  };
};

export const ProPromotionLotsTableContainer = compose(
  withSmartQuery({
    query: proPromotionLots,
    params: ({ promotion: { _id: promotionId }, status }) => ({
      promotionId,
      status,
    }),
    dataName: 'promotionLots',
  }),
  withProps(({ promotionLots, promotion }) => ({
    rows: promotionLots.map(makeMapProPromotionLot({ promotion })),
    columnOptions: proColumnOptions,
  })),
);

export const AppPromotionLotsTableContainer = compose(
  withSmartQuery({
    query: appPromotionLots,
    params: ({ promotion: { _id: promotionId }, status }) => ({
      promotionId,
      status,
    }),
    dataName: 'promotionLots',
  }),
  withProps(({
    promotionLots,
    promotion: { status: promotionStatus, _id: promotionId },
    loan,
  }) => {
    const isALotAttributedToMe = isAnyLotAttributedToMe(promotionLots);

    return {
      rows: promotionLots.map(makeMapAppPromotionLot({
        loan,
        isALotAttributedToMe,
        promotionStatus,
        promotionId,
      })),
      columnOptions: appColumnOptions({
        isALotAttributedToMe,
        promotionStatus,
      }),
    };
  }),
);
