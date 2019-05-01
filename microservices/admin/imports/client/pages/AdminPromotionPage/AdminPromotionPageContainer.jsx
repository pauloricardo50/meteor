import React from 'react';
import { compose } from 'recompose';
import proPromotion from 'core/api/promotions/queries/proPromotion';
import { withSmartQuery } from 'core/api';
import withMatchParam from 'core/containers/withMatchParam';

export default compose(
  withMatchParam('promotionId'),
  Component => props => <Component {...props} key={props.promotionId} />,
  withSmartQuery({
    query: proPromotion,
    params: ({ promotionId }) => ({ _id: promotionId }),
    queryOptions: { reactive: false, single: true },
    dataName: 'promotion',
  }),
);
