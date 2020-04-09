import { Migrations } from 'meteor/percolate:migrations';

import { asyncForEach } from '../../helpers';
import { PROMOTION_LOT_STATUS } from '../../promotionLots/promotionLotConstants';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';
import PromotionService from '../../promotions/server/PromotionService';
import { PROPERTY_STATUS } from '../../properties/propertyConstants';
import PropertyService from '../../properties/server/PropertyService';

const handleUpPromotionLots = async () =>
  PromotionLotService.rawCollection.update(
    { status: 'BOOKED' },
    { $set: { status: PROMOTION_LOT_STATUS.RESERVED } },
    { multi: true },
  );

const handleUpPromotionPermissions = async () => {
  const promotions = PromotionService.fetch({ users: { _id: 1 } });

  const handlePermissions = async () => {
    await asyncForEach(promotions, async promotion => {
      const { users = [], _id: promotionId } = promotion;

      const handleUsersPermissions = async () => {
        await asyncForEach(users, async user => {
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
          await PromotionService.setUserPermissions({
            promotionId,
            userId,
            permissions: newPermissions,
          });
        });
      };

      await handleUsersPermissions();
    });
  };

  await handlePermissions();
};

const handleUpProperties = async () =>
  PropertyService.rawCollection.update(
    { status: 'BOOKED' },
    { $set: { status: PROPERTY_STATUS.RESERVED } },
    { multi: true },
  );

const handleUpPropertiesPermissions = async () => {
  const properties = PropertyService.fetch({ users: { _id: 1 } });

  const handlePermissions = async () => {
    await asyncForEach(properties, async property => {
      const { users = [], _id: propertyId } = property;

      const handleUsersPermissions = async () => {
        await asyncForEach(users, async user => {
          const {
            $metadata: {
              permissions: {
                canBookProperty = false,
                displayCustomerNames = false,
                ...permissions
              },
            },
            _id: userId,
          } = user;
          const newPermissions = {
            ...permissions,
            canReserveProperty: canBookProperty,
          };
          const newDisplayCustomerNames = displayCustomerNames;
          if (displayCustomerNames) {
            const { forPropertyStatus = [] } = displayCustomerNames;
            if (forPropertyStatus.includes('BOOKED')) {
              newDisplayCustomerNames.forPropertyStatus = [
                ...forPropertyStatus.filter(status => status !== 'BOOKED'),
                PROPERTY_STATUS.RESERVED,
              ];
            }
          }
          newPermissions.displayCustomerNames = newDisplayCustomerNames;
          await PropertyService.setProUserPermissions({
            propertyId,
            userId,
            permissions: newPermissions,
          });
        });
      };

      await handleUsersPermissions();
    });
  };

  await handlePermissions();
};

const handleDownPromotionLots = async () =>
  PromotionLotService.rawCollection.update(
    { status: PROMOTION_LOT_STATUS.RESERVED },
    { $set: { status: 'BOOKED' } },
    { multi: true },
  );

const handleDownPromotionPermissions = async () => {
  const promotions = PromotionService.find().fetch();

  const handlePermissions = async () => {
    await asyncForEach(promotions, async promotion => {
      const { userLinks = [], _id: promotionId } = promotion;

      const newUserLinks = userLinks.map(user => {
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
              ...forLotStatus.filter(
                status => status !== PROMOTION_LOT_STATUS.RESERVED,
              ),
              'BOOKED',
            ];
          }
        }
        newPermissions.displayCustomerNames = newDisplayCustomerNames;

        return { _id: userId, permissions: newPermissions };
      });
      await PromotionService.rawCollection.update(
        { _id: promotionId },
        { $set: { userLinks: newUserLinks } },
      );
    });
  };

  await handlePermissions();
};

const handleDownProperties = async () =>
  PropertyService.rawCollection.update(
    { status: PROPERTY_STATUS.RESERVED },
    { $set: { status: 'BOOKED' } },
    { multi: true },
  );

const handleDownPropertiesPermissions = async () => {
  const properties = PropertyService.find().fetch();

  const handlePermissions = async () => {
    await asyncForEach(properties, async property => {
      const { userLinks = [], _id: propertyId } = property;

      const newUserLinks = userLinks.map(user => {
        const {
          permissions: {
            canReserveProperty = false,
            displayCustomerNames = false,
            ...permissions
          },
          _id: userId,
        } = user;
        const newPermissions = {
          ...permissions,
          canBookProperty: canReserveProperty,
        };
        const newDisplayCustomerNames = displayCustomerNames;
        if (displayCustomerNames) {
          const { forPropertyStatus = [] } = displayCustomerNames;
          if (forPropertyStatus.includes(PROPERTY_STATUS.RESERVED)) {
            newDisplayCustomerNames.forPropertyStatus = [
              ...forPropertyStatus.filter(
                status => status !== PROPERTY_STATUS.RESERVED,
              ),
              'BOOKED',
            ];
          }
        }
        newPermissions.displayCustomerNames = newDisplayCustomerNames;

        return { _id: userId, permissions: newPermissions };
      });
      await PropertyService.rawCollection.update(
        { _id: propertyId },
        { $set: { userLinks: newUserLinks } },
      );
    });
  };

  await handlePermissions();
};

export const up = async () => {
  await handleUpPromotionLots();
  await handleUpPromotionPermissions();
  await handleUpProperties();
  await handleUpPropertiesPermissions();
};

export const down = async () => {
  await handleDownPromotionLots();
  await handleDownPromotionPermissions();
  await handleDownProperties();
  await handleDownPropertiesPermissions();
};

Migrations.add({
  version: 26,
  name: 'Migrate BOOKED to RESERVED',
  up,
  down,
});
