import PromotionReservations from '../promotionReservations';
import CollectionService from '../../helpers/CollectionService';

class PromotionReservationService extends CollectionService {
  constructor() {
    super(PromotionReservations);
  }
}

export default new PromotionReservationService();
