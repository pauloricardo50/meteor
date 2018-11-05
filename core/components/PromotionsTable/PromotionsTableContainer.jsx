import React from 'react';
import { compose, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import { createRoute } from '../../utils/routerUtils';
import withSmartQuery from '../../api/containerToolkit/withSmartQuery';
import proPromotions from '../../api/promotions/queries/proPromotions';
import { PROMOTIONS_COLLECTION } from '../../api/constants';
import T from '../Translation';
import StatusLabel from '../StatusLabel';

const makeMapPromotion = history => ({
  _id,
  name,
  status,
  soldPromotionLots,
  bookedPromotionLots,
  availablePromotionLots,
  promotionLots = [],
  loans = [],
}) => ({
  id: _id,
  columns: [
    name,
    <StatusLabel
      status={status}
      collection={PROMOTIONS_COLLECTION}
      key="status"
    />,
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
  { id: 'name', label: 'dude' },
  { id: 'status' },
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
    params: ({ currentUser: { _id: userId } }) => ({ userId }),
    queryOptions: { reactive: false },
    dataName: 'promotions',
    renderMissingDoc: false,
  }),
  BasePromotionsTableContainer,
);
