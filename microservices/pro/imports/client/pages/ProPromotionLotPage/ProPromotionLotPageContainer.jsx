import { compose } from 'recompose';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import proPromotionLot from 'core/api/promotionLots/queries/proPromotionLot';
import withMatchParam from 'core/containers/withMatchParam';

export default compose(
  withMatchParam(['promotionLotId', 'promotionId']),
  withSmartQuery({
    query: ({ promotionLotId }) => proPromotionLot.clone({ promotionLotId }),
    queryOptions: { reactive: true, single: true },
    dataName: 'promotionLot',
  }),
);
