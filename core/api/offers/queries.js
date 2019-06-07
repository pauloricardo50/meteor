import Offers from '.';
import { OFFER_QUERIES } from './offerConstants';
import { fullOffer } from '../fragments';

export const adminOffers = Offers.createQuery(
  OFFER_QUERIES.ADMIN_OFFERS,
  fullOffer(),
);

export const loanOffers = Offers.createQuery(OFFER_QUERIES.LOAN_OFFERS, {
  ...fullOffer(),
  $options: { sort: { createdAt: -1 } },
});
