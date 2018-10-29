import React from 'react';
import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import { createRoute } from '../../../../utils/routerUtils';
import { toMoney } from '../../../../utils/conversionFunctions';
import { insertPromotionProperty, lotInsert } from '../../../../api';
import {
  PROMOTION_LOTS_COLLECTION,
  PROMOTION_QUERIES,
} from '../../../../api/constants';
import T from '../../../Translation';
import StatusLabel from '../../../StatusLabel';
import LotChip from './LotChip';
import ClientEventService from '../../../../api/events/ClientEventService';

const makeMapPromotionLot = ({ history, promotionId }) => ({
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

  handleClick: () =>
    history.push(createRoute('/promotions/:promotionId/promotionLots/:promotionLotId', {
      promotionId,
      promotionLotId,
    })),
});

const columnOptions = [
  { id: 'name' },
  { id: 'status' },
  { id: 'totalValue' },
  { id: 'lots' },
  { id: 'loans' },
  { id: 'attributedTo' },
].map(({ id }) => ({ id, label: <T id={`PromotionPage.lots.${id}`} /> }));

export default compose(
  withRouter,
  withProps(({ promotion: { promotionLots = [], _id: promotionId }, history }) => {
    const refresh = () =>
      ClientEventService.emit(PROMOTION_QUERIES.PRO_PROMOTION);
    return {
      rows: promotionLots.map(makeMapPromotionLot({ history, promotionId })),
      columnOptions,
      addProperty: property =>
        insertPromotionProperty.run({ promotionId, property }).then(refresh),
      addLot: lot => lotInsert.run({ promotionId, lot }).then(refresh),
    };
  }),
);
