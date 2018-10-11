import React from 'react';
import { compose, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import { createRoute } from '../../../../utils/routerUtils';
import withMatchParam from '../../../../containers/withMatchParam';
import { toMoney } from '../../../../utils/conversionFunctions';
import T from '../../../Translation';
import LotChip from './LotChip';

const makeMapPromotionLot = ({ history, promotionId, loanId }) => ({
  _id: promotionLotId,
  name,
  status,
  lots,
  value,
}) => ({
  id: promotionLotId,
  columns: [
    name,
    { raw: status, label: <T id={`Forms.status.${status}`} key="status" /> },
    { raw: value, label: toMoney(value) },
    {
      raw: lots && lots.length,
      label: lots.map(lot => <LotChip key={lot._id} lot={lot} />),
    },
  ],

  handleClick: () =>
    history.push(createRoute('/loans/:loanId/promotions/:promotionId/:promotionLotId', {
      loanId,
      promotionId,
      promotionLotId,
    })),
});

const columnOptions = [
  { id: 'name' },
  { id: 'status' },
  { id: 'totalValue' },
  { id: 'lots' },
].map(({ id }) => ({ id, label: <T id={`PromotionPage.lots.${id}`} /> }));

export default compose(
  withMatchParam('loanId'),
  withRouter,
  mapProps(({ promotion: { promotionLots, _id: promotionId }, history, loanId }) => ({
    rows: promotionLots.map(makeMapPromotionLot({ history, promotionId, loanId })),
    columnOptions,
  })),
);
