// @flow
import Promotions from '../promotions';
import { PROMOTION_QUERIES } from '../../constants';
import { createSearchFilters } from '../../helpers/mongoHelpers';
import { searchPromotionsFragment } from './promotionFragments';

export default Promotions.createQuery(PROMOTION_QUERIES.PROMOTION_SEARCH, {
  $filter({ filters, params: { searchQuery } }) {
    Object.assign(filters, createSearchFilters(['name', '_id'], searchQuery));
  },
  ...searchPromotionsFragment,
  $options: { sort: { createdAt: -1 } },
});
