import { Migrations } from 'meteor/percolate:migrations';
import { PROMOTION_LOT_STATUS } from 'core/api/promotionLots/promotionLotConstants';
import { PROPERTY_STATUS } from 'core/api/properties/propertyConstants';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';
import PromotionService from '../../promotions/server/PromotionService';
import PropertyService from '../../properties/server/PropertyService';

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

const handleUpProperties = async () => {
  const bookedProperties = PropertyService.find({
    status: 'BOOKED',
  }).fetch();

  return Promise.all(bookedProperties.map(({ _id: propertyId }) =>
    PropertyService.update({
      propertyId,
      object: { status: PROPERTY_STATUS.RESERVED },
    })));
};

const handleUpPropertiesPermissions = async () => {
  const properties = PropertyService.fetch({ users: { _id: 1 } });

  return Promise.all(properties.map((property) => {
    const { users = [], _id: propertyId } = property;
    return Promise.all(users.map((user) => {
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
      return PropertyService.setProUserPermissions({
        propertyId,
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

const handleDownProperties = async () => {
  const reservedProperties = PropertyService.find({
    status: PROPERTY_STATUS.RESERVED,
  }).fetch();

  return Promise.all(reservedProperties.map(({ _id: propertyId }) =>
    PropertyService.rawCollection.update(
      {
        _id: propertyId,
      },
      { $set: { status: 'BOOKED' } },
    )));
};

const handleDownPropertiesPermissions = async () => {
  const properties = PropertyService.find().fetch();

  return Promise.all(properties.map((property) => {
    const { userLinks = [], _id: propertyId } = property;

    const newUserLinks = userLinks.map((user) => {
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
            ...forPropertyStatus.filter(status => status !== PROPERTY_STATUS.RESERVED),
            'BOOKED',
          ];
        }
      }
      newPermissions.displayCustomerNames = newDisplayCustomerNames;

      return { _id: userId, permissions: newPermissions };
    });
    return PropertyService.rawCollection.update(
      { _id: propertyId },
      { $set: { userLinks: newUserLinks } },
    );
  }));
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
