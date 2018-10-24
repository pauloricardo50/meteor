import React from 'react';
import { compose, mapProps } from 'recompose';
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
} from '../../../../api/constants';
import { getLabelOtherProps } from '../utils';

const isLotAttributedToMe = ({ promotionOptions, promotionLotId }) => {
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
}) => ({ _id: promotionLotId, name, status, lots, value }) => ({
  id: promotionLotId,
  columns: [
    name,
    {
      raw: status,
      label: (
        <StatusLabel
          {...getLabelOtherProps({
            attributedToMe: isLotAttributedToMe({
              promotionOptions,
              promotionLotId,
            }),
            status,
          })}
          status={status}
          collection={PROMOTION_LOTS_COLLECTION}
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
    !isALotAttributedToMe && (
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

const columnOptions = isALotAttributedToMe =>
  [
    { id: 'name' },
    { id: 'status' },
    { id: 'totalValue' },
    { id: 'lots' },
    !isALotAttributedToMe && { id: 'interested' },
  ]
    .filter(x => x)
    .map(({ id }) => ({ id, label: <T id={`PromotionPage.lots.${id}`} /> }));

export default compose(
  withRouter,
  mapProps(({ promotion: { promotionLots, _id: promotionId }, history, loan }) => ({
    rows: promotionLots.map(makeMapPromotionLot({
      history,
      promotionId,
      loan,
      isALotAttributedToMe: isAnyLotAttributedToMe(promotionLots),
    })),
    columnOptions: columnOptions(isAnyLotAttributedToMe(promotionLots)),
  })),
);
