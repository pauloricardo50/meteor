import { compose, withProps } from 'recompose';

import { withSmartQuery, promotionOptionUpdate } from 'core/api';
import appPromotionOption from 'core/api/promotionOptions/queries/appPromotionOption';
import withMatchParam from 'core/containers/withMatchParam';
import mergeFilesWithQuery from 'core/api/files/mergeFilesWithQuery';
import propertyFiles from 'core/api/properties/queries/propertyFiles';
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
  mergeFilesWithQuery(
    propertyFiles,
    ({ promotionLot: { properties } }) => ({ propertyId: properties[0]._id }),
    'promotionLot',
  ),
)(AppPromotionLotPage);
