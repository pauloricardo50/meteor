import { compose } from 'recompose';
import proPromotion from 'core/api/promotions/queries/proPromotion';
import promotionFiles from 'core/api/promotions/queries/promotionFiles';
import { withSmartQuery } from 'core/api';
import withMatchParam from 'core/containers/withMatchParam';
import mergeFilesWithQuery from 'core/api/files/mergeFilesWithQuery';

export default compose(
  withMatchParam('promotionId'),
  withSmartQuery({
    query: ({ promotionId }) => proPromotion.clone({ promotionId }),
    queryOptions: { reactive: false, single: true },
    dataName: 'promotion',
  }),
  mergeFilesWithQuery(
    promotionFiles,
    ({ promotion: { _id: promotionId } }) => ({ promotionId }),
    'promotion',
  ),
);
