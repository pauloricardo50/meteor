import React from 'react';
import { compose, mapProps, branch, renderNothing } from 'recompose';
import { withRouter } from 'react-router-dom';

import { createRoute } from '../../../../utils/routerUtils';
import { toMoney } from '../../../../utils/conversionFunctions';
import T from '../../../Translation';
import LotChip from '../ProPromotionLotsTable/LotChip';
import PromotionLotSelector from './PromotionLotSelector';
import StatusLabel from '../../../StatusLabel';
import {
  PROMOTION_LOTS_COLLECTION,
  PROMOTION_LOT_STATUS,
  PROMOTION_STATUS,
} from '../../../../api/constants';

export const isLotAttributedToMe = ({ promotionOptions, promotionLotId }) => {
  const promotionLots = promotionOptions.filter(option => option.promotionLots[0]._id === promotionLotId);
  return !!(promotionLots[0] && promotionLots[0].attributedToMe);
};

const isAnyLotAttributedToMe = promotionLots =>
  promotionLots.filter(({ attributedTo }) =>
    attributedTo && attributedTo.user._id === Meteor.userId()).length > 0;

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

const columnOptions = ({ isALotAttributedToMe, promotionStatus }) =>
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

export default compose(
  branch(({ promotion }) => {
    const { $metadata } = promotion.loans[0];
    return !($metadata && $metadata.showAllLots);
  }, renderNothing),
  withRouter,
  mapProps(({
    promotion: { promotionLots, _id: promotionId, status: promotionStatus },
    history,
    loan,
  }) => ({
    rows: promotionLots.map(makeMapPromotionLot({
      history,
      promotionId,
      loan,
      isALotAttributedToMe: isAnyLotAttributedToMe(promotionLots),
      promotionStatus,
    })),
    columnOptions: columnOptions({
      isALotAttributedToMe: isAnyLotAttributedToMe(promotionLots),
      promotionStatus,
    }),
  })),
);
