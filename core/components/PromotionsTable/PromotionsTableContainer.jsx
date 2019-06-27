import React from 'react';
import { compose, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import { createRoute } from '../../utils/routerUtils';
import withSmartQuery from '../../api/containerToolkit/withSmartQuery';
import { proPromotions } from '../../api/promotions/queries';
import { proPromotions as promotionsFragment } from '../../api/fragments';
import { PROMOTIONS_COLLECTION } from '../../api/constants';
import T from '../Translation';
import StatusLabel from '../StatusLabel';

const makeMapPromotion = history => ({
  _id,
  name,
  status,
  createdAt,
  soldPromotionLots,
  bookedPromotionLots,
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
    bookedPromotionLots.length,
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
  { id: 'lots' },
  { id: 'available' },
  { id: 'booked' },
  { id: 'sold' },
  { id: 'loans' },
].map(({ id }) => ({ id, label: <T id={`PromotionsTable.${id}`} /> }));

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
