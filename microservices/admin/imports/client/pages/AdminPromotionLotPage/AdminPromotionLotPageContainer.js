import { compose } from 'recompose';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { proPromotionLot } from 'core/api/promotionLots/queries';
import withMatchParam from 'core/containers/withMatchParam';

export default compose(
  withMatchParam(['promotionLotId', 'promotionId']),
  withSmartQuery({
    query: proPromotionLot,
    params: ({ promotionLotId }) => ({ promotionLotId }),
    queryOptions: { reactive: false, single: true },
    dataName: 'promotionLot',
  }),
);
