import Offers from '..';
import { OFFER_QUERIES } from '../offerConstants';
import { fullOfferFragment } from './offerFragments';

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
  ...fullOfferFragment,
});
