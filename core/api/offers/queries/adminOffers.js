import Offers from '..';
import { OFFER_QUERIES } from '../offerConstants';
import { fullOffer } from '../../fragments';

export default Offers.createQuery(OFFER_QUERIES.ADMIN_OFFERS, fullOffer());
