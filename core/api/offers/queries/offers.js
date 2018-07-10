import Offers from '..';
import { OFFER_QUERIES } from '../offerConstants';

export default Offers.createQuery(OFFER_QUERIES.OFFERS, {
  $filter({ filters, params: { loanId } }) {
    if (loanId) {
      filters.loanId = loanId;
    }
  },
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  standardOffer: 1,
  counterpartOffer: 1,
});
