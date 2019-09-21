import { compose } from 'recompose';

import { withSmartQuery } from 'core/api';
import { appPromotionLots } from 'core/api/promotionLots/queries';
import withMatchParam from 'core/containers/withMatchParam';

export default compose(
  withMatchParam(['promotionLotId', 'promotionId']),
  withSmartQuery({
    query: appPromotionLots,
    params: ({ promotionLotId }) => ({ _id: promotionLotId }),
    queryOptions: { reactive: true, single: true },
    dataName: 'promotionLot',
  }),
);
