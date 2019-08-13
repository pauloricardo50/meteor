import { Meteor } from 'meteor/meteor';

import React from 'react';
import { compose, withState, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import { withSmartQuery } from 'core/api/containerToolkit/index';
import {
  proPromotionLots,
  appPromotionLots,
} from 'core/api/promotionLots/queries';
import { createRoute } from '../../../../utils/routerUtils';
import T from '../../../Translation';
import { toMoney } from '../../../../utils/conversionFunctions';
import LotChip from './LotChip';
import PromotionLotSelector from './PromotionLotSelector';
import StatusLabel from '../../../StatusLabel';
import {
  PROMOTION_LOTS_COLLECTION,
  PROMOTION_LOT_STATUS,
  PROMOTION_STATUS,
} from '../../../../api/constants';

const isLotAttributedToMe = ({ promotionOptions, promotionLotId }) => {
  const promotionLots = promotionOptions.filter(option => option.promotionLots[0]._id === promotionLotId);
  return !!(promotionLots[0] && promotionLots[0].attributedToMe);
};

const isAnyLotAttributedToMe = promotionLots =>
  promotionLots.filter(({ attributedTo }) =>
    attributedTo && attributedTo.user._id === Meteor.userId()).length > 0;

const proColumnOptions = [
  { id: 'name' },
  { id: 'status' },
  { id: 'totalValue', style: { whiteSpace: 'nowrap' } },
  { id: 'lots' },
  { id: 'loans' },
  { id: 'attributedTo' },
].map(({ id }) => ({ id, label: <T id={`PromotionPage.lots.${id}`} /> }));

const appColumnOptions = ({ isALotAttributedToMe, promotionStatus }) =>
  [
    { id: 'name' },
    { id: 'status' },
    { id: 'totalValue', style: { whiteSpace: 'nowrap' } },
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

const makeMapProPromotionLot = ({ history, promotionId }) => ({
  _id: promotionLotId,
  name,
  status,
  lots,
  promotionOptions,
  value,
  attributedTo,
}) => ({
  id: promotionLotId,
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
    { raw: value, label: toMoney(value) },
    {
      raw: lots && lots.length,
      label: (
        <div className="lot-chips">
          {lots && lots.map(lot => <LotChip lot={lot} key={lot._id} />)}
        </div>
      ),
    },
    promotionOptions.length,
    attributedTo && attributedTo.user.name,
  ],
});

const makeMapPromotionLot = ({
  history,
  promotionId,
  loan: { _id: loanId, promotionOptions },
  isALotAttributedToMe,
  promotionStatus,
}) => ({ _id: promotionLotId, name, status, reducedStatus, lots, value }) => ({
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
    {
      raw: reducedStatus === PROMOTION_LOT_STATUS.SOLD ? 0 : value,
      label:
        reducedStatus === PROMOTION_LOT_STATUS.SOLD ? null : toMoney(value),
    },
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
        />
      </div>
    ),
  ].filter(x => x),

  handleClick: () =>
    history.push(createRoute(
      '/loans/:loanId/promotions/:promotionId/promotionLots/:promotionLotId',
      {
        loanId,
        promotionId,
        promotionLotId,
      },
    )),
});

const addState = withState('status', 'setStatus', undefined);

export const ProPromotionLotsTableContainer = compose(
  addState,
  withRouter,
  withSmartQuery({
    query: proPromotionLots,
    params: ({ promotion: { _id: promotionId }, status }) => ({
      promotionId,
      status,
    }),
    dataName: 'promotionLots',
  }),
  withProps(({ promotionLots, promotion: { _id: promotionId }, history }) => ({
    rows: promotionLots.map(makeMapProPromotionLot({ history, promotionId })),
    columnOptions: proColumnOptions,
  })),
);

export const AppPromotionLotsTableContainer = compose(
  addState,
  withRouter,
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
    promotion: { _id: promotionId, status: promotionStatus },
    history,
    loan,
  }) => {
    const isALotAttributedToMe = isAnyLotAttributedToMe(promotionLots);

    return {
      rows: promotionLots.map(makeMapPromotionLot({
        history,
        promotionId,
        loan,
        isALotAttributedToMe,
        promotionStatus,
      })),
      columnOptions: appColumnOptions({
        isALotAttributedToMe,
        promotionStatus,
      }),
    };
  }),
);
