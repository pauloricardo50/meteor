import { Migrations } from 'meteor/percolate:migrations';

import { PROMOTION_LOT_STATUS } from '../../promotionLots/promotionLotConstants';
import PromotionReservationService from '../../promotionReservations/server/PromotionReservationService';
import PromotionService from '../../promotions/server/PromotionService';
import {
  AGREEMENT_STATUSES,
  PROMOTION_RESERVATION_STATUS,
  PROMOTION_RESERVATION_LENDER_STATUS,
  DEPOSIT_STATUSES,
} from '../../promotionReservations/promotionReservationConstants';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';
import PromotionReservations from '../../promotionReservations';

const handlePromotions = async () => {
  await PromotionService.collection
    .rawCollection()
    .update({}, { $set: { agreementDuration: 30 } }, { multi: true });
};

const handleBookedLots = async () => {
  const bookedPromotionLots = PromotionLotService.fetch({
    $filters: { status: PROMOTION_LOT_STATUS.BOOKED },
    attributedTo: {
      _id: 1,
      promotionOptions: { promotionLotLinks: 1, createdAt: 1 },
    },
  });

  return bookedPromotionLots.map(async ({ _id, attributedTo: { promotionOptions = [] } }) => {
    const promotionOption = promotionOptions.find(({ promotionLotLinks }) =>
      promotionLotLinks[0] && promotionLotLinks[0]._id === _id);
    if (promotionOption) {
      const id = await PromotionReservationService.insert({
        promotionOptionId: promotionOption._id,
        promotionReservation: { startDate: promotionOption.createdAt },
        withAgreement: false,
      });

      PromotionReservationService.baseUpdate(id, {
        $set: {
          status: PROMOTION_RESERVATION_STATUS.ACTIVE,
          reservationAgreement: {
            status: AGREEMENT_STATUSES.WAITING,
            date: new Date(),
          },
        },
      });
    }
  });
};

const handleSoldLots = async () => {
  const soldPromotionLots = PromotionLotService.fetch({
    $filters: { status: PROMOTION_LOT_STATUS.SOLD },
    attributedTo: { promotionOptions: { promotionLotLinks: 1, createdAt: 1 } },
  });

  soldPromotionLots.map(async ({ _id, attributedTo: { promotionOptions = [] } }) => {
    const promotionOption = promotionOptions.find(({ promotionLotLinks }) =>
      promotionLotLinks[0] && promotionLotLinks[0]._id === _id);
    if (promotionOption) {
      const id = await PromotionReservationService.insert({
        promotionOptionId: promotionOption._id,
        promotionReservation: { startDate: promotionOption.createdAt },
        withAgreement: false,
      });

      PromotionReservationService.baseUpdate(id, {
        $set: {
          status: PROMOTION_RESERVATION_STATUS.COMPLETED,
          reservationAgreement: {
            status: AGREEMENT_STATUSES.WAITING,
            date: new Date(),
          },
          lender: {
            status: PROMOTION_RESERVATION_LENDER_STATUS.VALIDATED,
            date: new Date(),
          },
          deposit: {
            date: new Date(),
            status: DEPOSIT_STATUSES.PAID,
          },
        },
      });
    }
  });
};

export const up = async () => {
  await handlePromotions();
  await handleBookedLots();
  await handleSoldLots();
};

export const down = async () => {
  await PromotionReservations.rawCollection().remove({});
};

Migrations.add({
  version: 25,
  name: 'Add reservations on all promotions',
  up,
  down,
});
