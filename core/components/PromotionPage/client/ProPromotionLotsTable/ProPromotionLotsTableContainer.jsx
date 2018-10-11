import React from 'react';
import { compose, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import { createRoute } from '../../../../utils/routerUtils';
import { insertPromotionProperty, lotInsert } from '../../../../api';
import { toMoney } from '../../../../utils/conversionFunctions';
import T from '../../../Translation';
import LotChip from './LotChip';

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
    { raw: status, label: <T id={`Forms.status.${status}`} key="status" /> },
    { raw: value, label: toMoney(value) },
    {
      raw: lots && lots.length,
      label: lots && lots.map(lot => <LotChip key={lot._id} lot={lot} />),
    },
    promotionOptions.length,
    attributedTo && attributedTo.user.name,
  ],

  handleClick: () =>
    history.push(createRoute('/promotions/:promotionId/:promotionLotId', {
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
  mapProps(({ promotion: { promotionLots = [], _id: promotionId }, history }) => ({
    rows: promotionLots.map(makeMapPromotionLot({ history, promotionId })),
    columnOptions,
    addProperty: property =>
      insertPromotionProperty.run({ promotionId, property }),
    addLot: lot => lotInsert.run({ promotionId, lot }),
  })),
);
