import React from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { compose, mapProps } from 'recompose';

import withSmartQuery from '../../api/containerToolkit/withSmartQuery';
import { proPromotions as promotionsFragment } from '../../api/fragments';
import { PROMOTIONS_COLLECTION } from '../../api/promotions/promotionConstants';
import { proPromotions } from '../../api/promotions/queries';
import { createRoute } from '../../utils/routerUtils';
import StatusLabel from '../StatusLabel';
import T from '../Translation';

const makeMapPromotion = history => ({
  _id,
  name,
  status,
  createdAt,
  soldPromotionLots,
  reservedPromotionLots,
  availablePromotionLots,
  promotionLots = [],
  loans = [],
}) => ({
  id: _id,
  columns: [
    name,
    {
      raw: status,
      label: <StatusLabel status={status} collection={PROMOTIONS_COLLECTION} />,
    },
    {
      raw: createdAt && createdAt.getTime(),
      label: moment(createdAt).fromNow(),
    },
    promotionLots.length,
    availablePromotionLots.length,
    reservedPromotionLots.length,
    soldPromotionLots.length,
    loans.length,
  ],
  handleClick: () =>
    history.push(createRoute('/promotions/:promotionId', { promotionId: _id })),
});

const columnOptions = [
  { id: 'name' },
  { id: 'status' },
  { id: 'createdAt' },
  { id: 'lots', format: v => <b>{v}</b> },
  { id: 'available' },
  { id: 'reserved' },
  { id: 'sold' },
  { id: 'loans', format: v => <b>{v}</b> },
].map(i => ({ ...i, label: <T id={`PromotionsTable.${i.id}`} /> }));

export const BasePromotionsTableContainer = compose(
  withRouter,
  mapProps(({ promotions = [], history }) => ({
    rows: promotions.map(makeMapPromotion(history)),
    columnOptions,
  })),
);

export default compose(
  withSmartQuery({
    query: proPromotions,
    queryOptions: { reactive: false },
    params: { $body: promotionsFragment() },
    dataName: 'promotions',
    renderMissingDoc: false,
  }),
  BasePromotionsTableContainer,
);
