import { Migrations } from 'meteor/percolate:migrations';

import PromotionOptions from 'core/api/promotionOptions';
import { PROMOTION_LOT_STATUS } from '../../promotionLots/promotionLotConstants';
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
import PromotionService from '../../promotions/server/PromotionService';
import {
  PROMOTION_OPTION_AGREEMENT_STATUS,
  PROMOTION_OPTION_STATUS,
  PROMOTION_OPTION_BANK_STATUS,
  PROMOTION_OPTION_DEPOSIT_STATUS,
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
    await PromotionOptionService.setInitialSimpleVerification({
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
        fullVerification: { date: new Date() },
      },
      $unset: {
        proNote: true,
        solvency: true,
      },
    });
  }));
};

const handleReservedLots = async () => {
  const reservedPromotionLots = PromotionLotService.fetch({
    $filters: { status: PROMOTION_LOT_STATUS.RESERVED },
    attributedTo: {
      _id: 1,
      promotionOptions: {
        promotionLotLinks: 1,
        createdAt: 1,
        loan: { promotionLinks: { _id: 1 } },
      },
    },
  });

  return Promise.all(reservedPromotionLots.map(async ({ _id, attributedTo: { promotionOptions = [] } }) => {
    const promotionOption = promotionOptions.find(({ promotionLotLinks }) =>
      promotionLotLinks[0] && promotionLotLinks[0]._id === _id);
    if (promotionOption) {
      const id = await PromotionOptionService.activateReservation({
        promotionOptionId: promotionOption._id,
      });

      const {
        loan: { _id: loanId },
      } = promotionOption;

      PromotionOptionService.setInitialSimpleVerification({
        promotionOptionId: promotionOption._id,
        loanId,
      });

      PromotionOptionService.baseUpdate(id, {
        $set: {
          status: PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
          reservationAgreement: {
            status: PROMOTION_OPTION_AGREEMENT_STATUS.WAITING,
            date: new Date(),
          },
          fullVerification: { date: new Date() },
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
      });

      const {
        loan: { _id: loanId },
      } = promotionOption;

      PromotionOptionService.baseUpdate(promotionOption._id, {
        $set: {
          status: PROMOTION_OPTION_STATUS.SOLD,
          reservationAgreement: {
            status: PROMOTION_OPTION_AGREEMENT_STATUS.WAITING,
            date: new Date(),
          },
          bank: {
            status: PROMOTION_OPTION_BANK_STATUS.VALIDATED,
            date: new Date(),
          },
          deposit: {
            date: new Date(),
            status: PROMOTION_OPTION_DEPOSIT_STATUS.PAID,
          },
          fullVerification: { date: new Date() },
        },
      });

      PromotionOptionService.setInitialSimpleVerification({
        promotionOptionId: promotionOption._id,
        loanId,
      });
    }
  }));
};

export const up = async () => {
  await handlePromotions();
  await handlePromotionOptions();
  await handleReservedLots();
  await handleSoldLots();
};

export const down = async () => {
  const promotionOptions = PromotionOptionService.fetch({
    simpleVerification: { status: 1 },
  });

  return Promise.all(promotionOptions.map((promotionOption) => {
    const { simpleVerification: { status } = {} } = promotionOption;
    return PromotionOptions.rawCollection().update(
      {},
      {
        $unset: {
          status: true,
          reservationAgreement: true,
          bank: true,
          deposit: true,
          simpleVerification: true,
          fullVerification: true,
        },
        $set: { solvency: status },
      },
      { multi: true },
    );
  }));
};

Migrations.add({
  version: 27,
  name: 'Add reservations on all promotions',
  up,
  down,
});
