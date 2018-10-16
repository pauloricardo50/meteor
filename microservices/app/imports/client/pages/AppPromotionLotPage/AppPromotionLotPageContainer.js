import { compose, withProps } from 'recompose';

import { withSmartQuery } from 'core/api';
import appPromotionLot from 'core/api/promotionLots/queries/appPromotionLot';
import withMatchParam from 'core/containers/withMatchParam';

export default compose(
  withMatchParam('promotionLotId'),
  withSmartQuery({
    query: ({ promotionLotId }) => appPromotionLot.clone({ promotionLotId }),
    queryOptions: { reactive: true, single: true },
    dataName: 'promotionLot',
  }),
);
