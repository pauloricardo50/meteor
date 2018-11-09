import React from 'react';
import { compose } from 'recompose';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import proPromotionLot from 'core/api/promotionLots/queries/proPromotionLot';
import withMatchParam from 'core/containers/withMatchParam';

export default compose(
  withMatchParam(['promotionLotId', 'promotionId']),
  // The whole page is pretty heavy to load, so refresh the page on URL change
  Component => props => <Component {...props} key={props.promotionLotId} />,
  withSmartQuery({
    query: proPromotionLot,
    params: ({ promotionLotId }) => ({ promotionLotId }),
    queryOptions: { reactive: false, single: true },
    dataName: 'promotionLot',
  }),
);
