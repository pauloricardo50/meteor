import React from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { compose, mapProps } from 'recompose';

import withSmartQuery from '../../api/containerToolkit/withSmartQuery';
import { proPromotions as promotionsFragment } from '../../api/fragments';
import { proPromotions } from '../../api/promotions/queries';
import { createRoute } from '../../utils/routerUtils';
import StatusLabel from '../StatusLabel';
import TestBadge from '../TestBadge';
import T from '../Translation';

const makeMapPromotion = history => ({
  _collection,
  _id,
  name,
  status,
  createdAt,
  soldPromotionLots,
  reservedPromotionLots,
  availablePromotionLots,
  promotionLots = [],
  loanCount,
  isTest,
}) => ({
  id: _id,
  columns: [
    name,
    {
      raw: status,
      label: (
        <div>
          <StatusLabel status={status} collection={_collection} />
          {isTest && <TestBadge />}
        </div>
      ),
    },
    {
      raw: createdAt && createdAt.getTime(),
      label: moment(createdAt).fromNow(),
    },
    promotionLots.length,
    availablePromotionLots.length,
    reservedPromotionLots.length,
    soldPromotionLots.length,
    loanCount,
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
    params: {
      $body: {
        availablePromotionLots: 1,
        createdAt: 1,
        isTest: 1,
        loanCount: 1,
        name: 1,
        promotionLotLinks: 1,
        promotionLots: { _id: 1 },
        reservedPromotionLots: 1,
        soldPromotionLots: 1,
        status: 1,
      },
    },
    dataName: 'promotions',
    renderMissingDoc: false,
  }),
  BasePromotionsTableContainer,
);
