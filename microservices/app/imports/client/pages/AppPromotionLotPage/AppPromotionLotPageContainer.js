import { compose } from 'recompose';

import { withSmartQuery } from 'core/api';
import appPromotionLot from 'core/api/promotionLots/queries/appPromotionLot';
import withMatchParam from 'core/containers/withMatchParam';
import mergeFilesWithQuery from 'core/api/files/mergeFilesWithQuery';
import propertyFiles from 'core/api/properties/queries/propertyFiles';

export default compose(
  withMatchParam(['promotionLotId', 'promotionId']),
  withSmartQuery({
    query: appPromotionLot,
    params: ({ promotionLotId }) => ({ promotionLotId }),
    queryOptions: { reactive: true, single: true },
    dataName: 'promotionLot',
  }),
  mergeFilesWithQuery(
    propertyFiles,
    ({ promotionLot: { properties } }) => ({ propertyId: properties[0]._id }),
    'promotionLot',
  ),
);
