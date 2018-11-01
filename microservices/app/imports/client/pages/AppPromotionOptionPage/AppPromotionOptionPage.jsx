import { compose, withProps } from 'recompose';

import { withSmartQuery, promotionOptionUpdate } from 'core/api';
import appPromotionOption from 'core/api/promotionOptions/queries/appPromotionOption';
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
  withProps(({ promotionOption: { _id: promotionOptionId, promotionLots } }) => ({
    promotionLot: promotionLots[0],
    setCustom: value =>
      promotionOptionUpdate.run({
        promotionOptionId,
        object: { custom: value },
      }),
  })),
)(AppPromotionLotPage);
