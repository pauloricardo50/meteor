// @flow
import Promotions from '../promotions';
import { PROMOTION_QUERIES } from '../../constants';
import { createSearchFilters } from '../../helpers/mongoHelpers';
import { searchPromotions } from '../../fragments';

export default Promotions.createQuery(PROMOTION_QUERIES.PROMOTION_SEARCH, {
  $filter({ filters, params: { searchQuery } }) {
    Object.assign(filters, createSearchFilters(['name', '_id'], searchQuery));
  },
  ...searchPromotions(),
  $options: { sort: { createdAt: -1 }, limit: 5 },
});
