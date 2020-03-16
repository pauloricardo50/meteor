import { compose, withProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { appPromotionOption } from 'core/api/promotionOptions/queries';
import withMatchParam from 'core/containers/withMatchParam';
import { AppPromotionLotPage } from '../AppPromotionLotPage/AppPromotionLotPage';

export default compose(
  withMatchParam(['promotionOptionId', 'promotionId']),
  withSmartQuery({
    query: appPromotionOption,
    params: ({ promotionOptionId }) => ({ promotionOptionId }),
    queryOptions: { reactive: true, single: true },
    dataName: 'promotionOption',
  }),
  withProps(({ promotionOption: { promotionLots } }) => ({
    promotionLot: promotionLots[0],
  })),
)(AppPromotionLotPage);
