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
  PRO_PROMOTION_SIMPLE: 'PRO_PROMOTION_SIMPLE',
};

export const PROMOTION_INVITED_BY_TYPE = {
  ANY: 'ANY',
  USER: 'USER',
  ORGANISATION: 'ORGANISATION',
};

export const PROMOTION_PERMISSIONS = {
  DISPLAY_CUSTOMER_NAMES: {
    FOR_LOT_STATUS: { ...PROMOTION_LOT_STATUS },
    INVITED_BY: { ...PROMOTION_INVITED_BY_TYPE },
  },
};

export const PROMOTION_PERMISSIONS_BUNDLES = {
  INVITATION: (settings) => ({
    canInviteCustomers: true,
    displayCustomerNames: {
      forLotStatus: Object.values(PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.FOR_LOT_STATUS),
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
      displayCustomerNames: { forLotStatus, invitedBy },
    };
  },
  MODIFICATION: (settings) => ({
    canAddLots: true,
    canModifyLots: true,
    canRemoveLots: true,
    canModifyPromotion: true,
    canManageDocuments: true,
    canSeeManagement: true,
  }),
  RESERVATION: (settings) => ({ canReserveLots: true }),
};

export const PROMOTION_PERMISSIONS_FULL_ACCESS = () => {
  const settings = {
    consultation: {
      forLotStatus: Object.values(PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.FOR_LOT_STATUS),
      invitedBy: PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.INVITED_BY.ANY,
    },
  };

  return Object.keys(PROMOTION_PERMISSIONS_BUNDLES).reduce(
    (bundles, bundle) =>
      merge({}, bundles, PROMOTION_PERMISSIONS_BUNDLES[bundle](settings)),
    {},
  );
};

export const PROMOTION_AUTHORIZATION_STATUS = {
  NONE: 'NONE',
  PREPARATION: 'PREPARATION',
  FILED: 'FILED',
  PRE_APPROVED: 'PRE_APPROVED',
  APPROVED: 'APPROVED',
};

export const PROMOTION_USERS_ROLES = {
  PROMOTER: 'PROMOTER',
  BROKER: 'BROKER',
  NOTARY: 'NOTARY',
  VISITOR: 'VISITOR',
};

export const PROMOTION_EMAIL_RECIPIENTS = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  BROKER: 'BROKER',
  BROKERS: 'BROKERS',
  PROMOTER: 'PROMOTER',
  NOTARY: 'NOTARY',
};
