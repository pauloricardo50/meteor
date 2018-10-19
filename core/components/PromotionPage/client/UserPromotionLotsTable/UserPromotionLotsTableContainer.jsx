import React from 'react';
import { compose, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import { createRoute } from '../../../../utils/routerUtils';
import { toMoney } from '../../../../utils/conversionFunctions';
import T from '../../../Translation';
import LotChip from '../ProPromotionLotsTable/LotChip';
import PromotionLotSelector from './PromotionLotSelector';
import StatusLabel from '../../../StatusLabel';
import { PROMOTION_LOTS_COLLECTION } from '../../../../api/constants';
import { getLabelSuffix } from '../utils';

const isLotAttributedToMe = ({ promotionOptions, promotionLotId }) => {
  const promotionLots = promotionOptions.filter(option => option.promotionLots[0]._id === promotionLotId);
  return !!(promotionLots[0] && promotionLots[0].attributedToMe);
};

const makeMapPromotionLot = ({
  history,
  promotionId,
  loan: { _id: loanId, promotionOptions },
}) => ({ _id: promotionLotId, name, status, lots, value }) => ({
  id: promotionLotId,
  columns: [
    name,
    {
      raw: status,
      label: (
        <StatusLabel
          suffix={getLabelSuffix({
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
      label: lots.map(lot => <LotChip key={lot._id} lot={lot} />),
    },
    <div key="PromotionLotSelector" onClick={e => e.stopPropagation()}>
      <PromotionLotSelector
        promotionLotId={promotionLotId}
        promotionOptions={promotionOptions}
        loanId={loanId}
        disabled={isLotAttributedToMe({ promotionOptions, promotionLotId })}
      />
    </div>,
  ],

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

const columnOptions = [
  { id: 'name' },
  { id: 'status' },
  { id: 'totalValue' },
  { id: 'lots' },
  { id: 'interested' },
].map(({ id }) => ({ id, label: <T id={`PromotionPage.lots.${id}`} /> }));

export default compose(
  withRouter,
  mapProps(({ promotion: { promotionLots, _id: promotionId }, history, loan }) => ({
    rows: promotionLots.map(makeMapPromotionLot({ history, promotionId, loan })),
    columnOptions,
  })),
);
