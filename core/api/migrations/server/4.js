import { Migrations } from 'meteor/percolate:migrations';

import Promotions from '../../promotions/index';

export const PERMISSIONS = {
  canSellLots: false,
  canModifyLots: false,
  canRemoveLots: false,
  canModifyPromotion: false,
  canManageDocuments: false,
  canReserveLots: false,
  canInviteCustomers: false,
  canAddLots: false,
  displayCustomerNames: false,
};

export const up = () => {
  const allPromotions = Promotions.find().fetch();

  return Promise.all(
    allPromotions.map(promotion => {
      const { _id, userLinks = [] } = promotion;
      const newUserLinks = userLinks.map(({ permissions, ...user }) => ({
        permissions: PERMISSIONS,
        ...user,
      }));
      return Promotions.rawCollection().update(
        { _id },
        { $set: { userLinks: newUserLinks } },
      );
    }),
  );
};

export const down = () => {
  const allPromotions = Promotions.find().fetch();

  return Promise.all(
    allPromotions.map(promotion => {
      const { _id, userLinks = [] } = promotion;
      const oldUserLinks = userLinks.map(({ permissions, ...user }) => ({
        permissions: 'READ',
        ...user,
      }));
      return Promotions.rawCollection().update(
        { _id },
        { $set: { userLinks: oldUserLinks } },
      );
    }),
  );
};

Migrations.add({
  version: 4,
  name: 'Modify user promotion permissions',
  up,
  down,
});
