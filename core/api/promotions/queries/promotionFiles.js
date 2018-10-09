// @flow
import Promotions from '../promotions';
import { PROMOTION_QUERIES } from '../../constants';

export default Promotions.createQuery(PROMOTION_QUERIES.PROMOTION_FILES, {
  $filter({ filters, params: { promotionId } }) {
    filters._id = promotionId;
  },
  documents: 1,
});
