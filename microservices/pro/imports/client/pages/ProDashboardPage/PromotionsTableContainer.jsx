import React from 'react';
import { compose, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import T from 'core/components/Translation';
import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { createRoute } from 'core/utils/routerUtils';
import proPromotions from 'core/api/promotions/queries/proPromotions';
import { PROMOTIONS_COLLECTION } from 'core/api/constants';
import StatusLabel from 'core/components/StatusLabel';
import { PRO_PROMOTION_PAGE } from '../../../startup/client/proRoutes';

const makeMapPromotion = history => ({
  _id,
  name,
  status,
  soldPromotionLots,
  bookedPromotionLots,
  availablePromotionLots,
  promotionLots,
  loans,
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
    history.push(createRoute(PRO_PROMOTION_PAGE, { promotionId: _id })),
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

export default compose(
  withSmartQuery({
    query: ({ currentUser: { _id: userId } }) =>
      proPromotions.clone({ userId }),
    queryOptions: { reactive: false },
    dataName: 'promotions',
    renderMissingDoc: false,
  }),
  withRouter,
  mapProps(({ promotions, history }) => ({
    rows: promotions.map(makeMapPromotion(history)),
    columnOptions,
  })),
);
