import PromotionReservationSchema from './schemas/promotionReservationSchema';
import { PROMOTION_RESERVATIONS_COLLECTION } from './promotionReservationConstants';
import { createCollection } from '../helpers/collectionHelpers';

const PromotionReservations = createCollection(PROMOTION_RESERVATIONS_COLLECTION);

PromotionReservations.attachSchema(PromotionReservationSchema);
export default PromotionReservations;
