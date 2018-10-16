import { compose, withProps } from 'recompose';

import { withSmartQuery } from 'core/api';
import appPromotionOption from 'core/api/promotionOptions/queries/appPromotionOption';
import withMatchParam from 'core/containers/withMatchParam';
import { AppPromotionLotPage } from '../AppPromotionLotPage/AppPromotionLotPage';

export default compose(
  withMatchParam('promotionOptionId'),
  withSmartQuery({
    query: ({ promotionOptionId }) =>
      appPromotionOption.clone({ promotionOptionId }),
    queryOptions: { reactive: true, single: true },
    dataName: 'promotionOption',
  }),
  withProps(({ promotionOption: { promotionLots } }) => ({
    promotionLot: promotionLots[0],
  })),
)(AppPromotionLotPage);
