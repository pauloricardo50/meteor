import Offers from '..';
import { OFFER_QUERIES } from '../offerConstants';
import { fullOffer } from '../../fragments';

export default Offers.createQuery(OFFER_QUERIES.OFFERS, {
  $filter({ filters, params: { loanId } }) {
    if (loanId) {
      filters.loanId = loanId;
    }
  },
  ...fullOffer(),
  $options: { sort: { createdAt: -1 } },
});
