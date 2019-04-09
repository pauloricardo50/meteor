import Offers from '..';
import { OFFER_QUERIES } from '../offerConstants';
import { fullOffer } from '../../fragments';

export default Offers.createQuery(OFFER_QUERIES.LOAN_OFFERS, {
  $filter({ filters, params: { loanId } }) {
    if (loanId) {
      filters['lenderCache.loanLink._id'] = loanId;
    }
  },
  ...fullOffer(),
  $options: { sort: { createdAt: -1 } },
});
