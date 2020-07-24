import { fullOffer } from '../fragments';
import { OFFER_QUERIES } from './offerConstants';
import Offers from '.';

export const loanOffers = Offers.createQuery(OFFER_QUERIES.LOAN_OFFERS, {
  ...fullOffer(),
  $options: { sort: { createdAt: -1 } },
});
