import merge from 'lodash/merge';
import { PROMOTION_LOT_STATUS } from '../promotionLots/promotionLotConstants';

export const PROMOTIONS_COLLECTION = 'promotions';

export const PROMOTION_TYPES = {
  CREDIT: 'CREDIT',
  SHARE: 'SHARE',
};

export const PROMOTION_STATUS = {
  CANCELLED: 'CANCELLED',
  FINISHED: 'FINISHED',
  OPEN: 'OPEN',
  PREPARATION: 'PREPARATION',
};

export const PROMOTION_QUERIES = {
  ADMIN_PROMOTIONS: 'ADMIN_PROMOTIONS',
  APP_PROMOTION: 'APP_PROMOTION',
  PRO_PROMOTION: 'PRO_PROMOTION',
  PRO_PROMOTIONS: 'PRO_PROMOTIONS',
  PRO_PROMOTION_USERS: 'PRO_PROMOTION_USERS',
  PROMOTION_FILES: 'PROMOTION_FILES',
  PROMOTION_SEARCH: 'PROMOTION_SEARCH',
};

export const PROMOTION_PERMISSIONS = {
  DISPLAY_CUSTOMER_NAMES: {
    FOR_LOT_STATUS: {
      ...PROMOTION_LOT_STATUS,
    },
    INVITED_BY: {
      ANY: 'ANY',
      USER: 'USER',
      ORGANISATION: 'ORGANISATION',
    },
  },
};

export const PROMOTION_PERMISSIONS_PACKAGES = {
  INVITATION: settings => ({
    canInviteCustomers: true,
    canSeeCustomers: true,
    canPreBookLots: true,
    displayCustomerNames: {
      forLotStatus: Object.values(
        PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.FOR_LOT_STATUS,
      ),
      invitedBy:
        PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.INVITED_BY.ORGANISATION,
    },
  }),
  CONSULTATION: ({ consultation = {} } = {}) => {
    const {
      forLotStatus = [],
      invitedBy = PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.INVITED_BY.ANY,
    } = consultation;
    return {
      canSeeCustomers: true,
      displayCustomerNames: { forLotStatus, invitedBy },
    };
  },
  MODIFICATION: settings => ({
    canAddLots: true,
    canModifyLots: true,
    canRemoveLots: true,
    canModifyPromotion: true,
    canManageDocuments: true,
  }),
  BOOKING: settings => ({
    canBookLots: true,
  }),
};

export const PROMOTION_PERMISSIONS_FULL_ACCESS = () => {
  const settings = {
    consultation: {
      forLotStatus: Object.values(
        PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.FOR_LOT_STATUS,
      ),
      invitedBy: PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.INVITED_BY.ANY,
    },
  };

  return Object.keys(PROMOTION_PERMISSIONS_PACKAGES).reduce(
    (packages, package) =>
      merge({}, packages, PROMOTION_PERMISSIONS_PACKAGES[package](settings)),
    {},
  );
};
