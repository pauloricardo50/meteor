import { compose } from 'recompose';
import proPromotion from 'core/api/promotions/queries/proPromotion';
import { withSmartQuery } from 'core/api';
import withMatchParam from 'imports/core/containers/withMatchParam';

export default compose(
  withMatchParam('promotionId'),
  withSmartQuery({
    query: ({ promotionId }) => proPromotion.clone({ promotionId }),
    queryOptions: { reactive: true, single: true },
    dataName: 'promotion',
  }),
);
