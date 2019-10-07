import PromotionReservations from '../promotionReservations';
import CollectionService from '../../helpers/CollectionService';
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';

class PromotionReservationService extends CollectionService {
  constructor() {
    super(PromotionReservations);
  }

  insert({ promotionReservation, promotionOptionId }) {
    const promotionReservationId = this.collection.insert(promotionReservation);

    const {
      promotionLots = [],
      loan = {},
    } = PromotionOptionService.safeFetchOne({
      $filters: { _id: promotionOptionId },
      promotionLots: { _id: 1, promotionCache: { _id: 1 } },
      loan: { _id: 1 },
    });

    const [
      {
        _id: promotionLotId,
        promotionCache: { _id: promotionId },
      },
    ] = promotionLots;
    const { _id: loanId } = loan;

    this.addLink({
      id: promotionReservationId,
      linkName: 'promotionOption',
      linkId: promotionOptionId,
    });
    this.addLink({
      id: promotionReservationId,
      linkName: 'promotion',
      linkId: promotionId,
    });
    this.addLink({
      id: promotionReservationId,
      linkName: 'promotionLot',
      linkId: promotionLotId,
    });
    this.addLink({
      id: promotionReservationId,
      linkName: 'loan',
      linkId: loanId,
    });

    return promotionReservationId;
  }
}

export default new PromotionReservationService();
