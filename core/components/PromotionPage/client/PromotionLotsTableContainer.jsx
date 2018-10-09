import React from 'react';
import { compose, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import T from '../../Translation';
import { createRoute } from '../../../utils/routerUtils';

const makeMapPromotionLot = (history, promotionId) => ({
  _id: promotionLotId,
  name,
  status,
  lots,
  loans,
}) => ({
  id: promotionLotId,
  columns: [name, status, lots.map(lot => lot.name).join(', '), loans.length],
  handleClick: () =>
    history.push(createRoute('/promotions/:promotionId/:promotionLotId', {
      promotionId,
      promotionLotId,
    })),
});

const columnOptions = [
  { id: 'name' },
  { id: 'status' },
  { id: 'lots' },
  { id: 'loans' },
].map(({ id }) => ({ id, label: <T id={`PromotionPage.lots.${id}`} /> }));

export default compose(
  withRouter,
  mapProps(({ promotion: { promotionLots, _id: promotionId }, history }) => ({
    rows: promotionLots.map(makeMapPromotionLot(history, promotionId)),
    columnOptions,
  })),
);
