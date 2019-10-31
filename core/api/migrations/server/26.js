import { Migrations } from 'meteor/percolate:migrations';
import { PROMOTION_LOT_STATUS } from 'core/api/promotionLots/promotionLotConstants';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';
import PromotionService from '../../promotions/server/PromotionService';

const handleUpPromotionLots = async () => {
  const bookedPromotionLots = PromotionLotService.find({
    status: 'BOOKED',
  }).fetch();

  return Promise.all(bookedPromotionLots.map(({ _id: promotionLotId }) =>
    PromotionLotService.update({
      promotionLotId,
      object: { status: PROMOTION_LOT_STATUS.RESERVED },
    })));
};

const handleUpPromotionPermissions = async () => {
  const promotions = PromotionService.fetch({ users: { _id: 1 } });

  return Promise.all(promotions.map((promotion) => {
    const { users = [], _id: promotionId } = promotion;
    return Promise.all(users.map((user) => {
      const {
        $metadata: {
          permissions: {
            canBookLots = false,
            displayCustomerNames = false,
            ...permissions
          },
        },
        _id: userId,
      } = user;
      const newPermissions = {
        ...permissions,
        canReserveLots: canBookLots,
      };
      const newDisplayCustomerNames = displayCustomerNames;
      if (displayCustomerNames) {
        const { forLotStatus = [] } = displayCustomerNames;
        if (forLotStatus.includes('BOOKED')) {
          newDisplayCustomerNames.forLotStatus = [
            ...forLotStatus.filter(status => status !== 'BOOKED'),
            PROMOTION_LOT_STATUS.RESERVED,
          ];
        }
      }
      newPermissions.displayCustomerNames = newDisplayCustomerNames;
      return PromotionService.setUserPermissions({
        promotionId,
        userId,
        permissions: newPermissions,
      });
    }));
  }));
};

const handleDownPromotionLots = async () => {
  const reservedPromotionLots = PromotionLotService.find({
    status: PROMOTION_LOT_STATUS.RESERVED,
  }).fetch();

  return Promise.all(reservedPromotionLots.map(({ _id: promotionLotId }) =>
    PromotionLotService.rawCollection.update(
      {
        _id: promotionLotId,
      },
      { $set: { status: 'BOOKED' } },
    )));
};

const handleDownPromotionPermissions = async () => {
  const promotions = PromotionService.find().fetch();

  return Promise.all(promotions.map((promotion) => {
    const { userLinks = [], _id: promotionId } = promotion;

    const newUserLinks = userLinks.map((user) => {
      const {
        permissions: {
          canReserveLots = false,
          displayCustomerNames = false,
          ...permissions
        },
        _id: userId,
      } = user;
      const newPermissions = {
        ...permissions,
        canBookLots: canReserveLots,
      };
      const newDisplayCustomerNames = displayCustomerNames;
      if (displayCustomerNames) {
        const { forLotStatus = [] } = displayCustomerNames;
        if (forLotStatus.includes(PROMOTION_LOT_STATUS.RESERVED)) {
          newDisplayCustomerNames.forLotStatus = [
            ...forLotStatus.filter(status => status !== PROMOTION_LOT_STATUS.RESERVED),
            'BOOKED',
          ];
        }
      }
      newPermissions.displayCustomerNames = newDisplayCustomerNames;

      return { _id: userId, permissions: newPermissions };
    });
    return PromotionService.rawCollection.update(
      { _id: promotionId },
      { $set: { userLinks: newUserLinks } },
    );
  }));
};

export const up = async () => {
  await handleUpPromotionLots();
  await handleUpPromotionPermissions();
};

export const down = async () => {
  await handleDownPromotionLots();
  await handleDownPromotionPermissions();
};

Migrations.add({
  version: 26,
  name: 'Migrate BOOKED to RESERVED',
  up,
  down,
});
