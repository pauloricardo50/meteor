import { Mongo } from 'meteor/mongo';

import PromotionReservationSchema from './schemas/promotionReservationSchema';
import { PROMOTION_RESERVATIONS_COLLECTION } from './promotionReservationConstants';

const PromotionReservations = new Mongo.Collection(PROMOTION_RESERVATIONS_COLLECTION);

PromotionReservations.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

PromotionReservations.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

PromotionReservations.attachSchema(PromotionReservationSchema);
export default PromotionReservations;
