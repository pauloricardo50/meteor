import {
  PromotionsTable,
  BasePromotionsTableContainer,
} from 'core/components/PromotionsTable';
import { compose } from 'recompose';
import { withSmartQuery } from 'imports/core/api/containerToolkit/index';
import { adminPromotions } from 'core/api/promotions/queries';

export default compose(
  withSmartQuery({
    query: adminPromotions,
    dataName: 'promotions',
    queryOptions: { reactive: false },
    renderMissingDoc: false,
  }),
  BasePromotionsTableContainer,
)(PromotionsTable);
