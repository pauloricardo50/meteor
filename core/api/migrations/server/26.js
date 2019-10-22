import { Migrations } from 'meteor/percolate:migrations';

import PromotionOptions from 'core/api/promotionOptions';
import { PROMOTION_LOT_STATUS } from '../../promotionLots/promotionLotConstants';
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
import PromotionService from '../../promotions/server/PromotionService';
import {
  AGREEMENT_STATUSES,
  PROMOTION_OPTION_STATUS,
  PROMOTION_OPTION_BANK_STATUS,
  DEPOSIT_STATUSES,
} from '../../promotionOptions/promotionOptionConstants';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';

const handlePromotions = async () => {
  await PromotionService.collection
    .rawCollection()
    .update({}, { $set: { agreementDuration: 30 } }, { multi: true });
};

const handlePromotionOptions = async () => {
  const promotionOptions = PromotionOptionService.fetch({ loan: { _id: 1 } });

  return Promise.all(promotionOptions.map(async ({ _id: promotionOptionId, loan: { _id: loanId } }) => {
    await PromotionOptionService.setInitialMortgageCertification({
      promotionOptionId,
      loanId,
    });

    await PromotionOptionService.baseUpdate(promotionOptionId, {
      $set: {
        status: PROMOTION_OPTION_STATUS.INTERESTED,
        adminNote: { date: new Date() },
        bank: { date: new Date() },
        deposit: { date: new Date() },
        reservationAgreement: { date: new Date() },
      },
      $unset: {
        proNote: true,
        solvency: true,
      },
    });
  }));
};

const handleBookedLots = async () => {
  const bookedPromotionLots = PromotionLotService.fetch({
    $filters: { status: PROMOTION_LOT_STATUS.BOOKED },
    attributedTo: {
      _id: 1,
      promotionOptions: {
        promotionLotLinks: 1,
        createdAt: 1,
        loan: { promotionLinks: { _id: 1 } },
      },
    },
  });

  return Promise.all(bookedPromotionLots.map(async ({ _id, attributedTo: { promotionOptions = [] } }) => {
    const promotionOption = promotionOptions.find(({ promotionLotLinks }) =>
      promotionLotLinks[0] && promotionLotLinks[0]._id === _id);
    if (promotionOption) {
      const id = await PromotionOptionService.activateReservation({
        promotionOptionId: promotionOption._id,
        startDate: new Date(),
        withAgreement: false,
      });

      const {
        loan: { _id: loanId },
      } = promotionOption;

      PromotionOptionService.setInitialMortgageCertification({
        promotionOptionId: promotionOption._id,
        loanId,
      });

      PromotionOptionService.baseUpdate(id, {
        $set: {
          status: PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
          reservationAgreement: {
            status: AGREEMENT_STATUSES.WAITING,
            date: new Date(),
          },
        },
      });
    }
  }));
};

const handleSoldLots = async () => {
  const soldPromotionLots = PromotionLotService.fetch({
    $filters: { status: PROMOTION_LOT_STATUS.SOLD },
    loan: { promotionLinks: { _id: 1 } },
    attributedTo: {
      promotionOptions: {
        promotionLotLinks: 1,
        createdAt: 1,
        loan: { promotionLinks: { _id: 1 } },
      },
    },
  });

  return Promise.all(soldPromotionLots.map(async ({ _id, attributedTo: { promotionOptions = [] } }) => {
    const promotionOption = promotionOptions.find(({ promotionLotLinks }) =>
      promotionLotLinks[0] && promotionLotLinks[0]._id === _id);
    if (promotionOption) {
      const id = await PromotionOptionService.activateReservation({
        promotionOptionId: promotionOption._id,
        startDate: new Date(),
        withAgreement: false,
      });

      const {
        loan: { _id: loanId },
      } = promotionOption;

      PromotionOptionService.baseUpdate(promotionOption._id, {
        $set: {
          status: PROMOTION_OPTION_STATUS.SOLD,
          reservationAgreement: {
            status: AGREEMENT_STATUSES.WAITING,
            date: new Date(),
          },
          bank: {
            status: PROMOTION_OPTION_BANK_STATUS.VALIDATED,
            date: new Date(),
          },
          deposit: {
            date: new Date(),
            status: DEPOSIT_STATUSES.PAID,
          },
        },
      });

      PromotionOptionService.setInitialMortgageCertification({
        promotionOptionId: promotionOption._id,
        loanId,
      });
    }
  }));
};

export const up = async () => {
  await handlePromotions();
  await handlePromotionOptions();
  await handleBookedLots();
  await handleSoldLots();
};

export const down = async () => {
  const promotionOptions = PromotionOptionService.fetch({
    mortgageCertification: { status: 1 },
  });

  return Promise.all(promotionOptions.map((promotionOption) => {
    const { mortgageCertification: { status } = {} } = promotionOption;
    return PromotionOptions.rawCollection().update(
      {},
      {
        $unset: {
          status: true,
          reservationAgreement: true,
          bank: true,
          deposit: true,
        },
        $set: { solvency: status },
      },
      { multi: true },
    );
  }));
};

Migrations.add({
  version: 26,
  name: 'Add reservations on all promotions',
  up,
  down,
});
