import moment from 'moment';

import {
  ORGANISATION_FEATURES,
  ORGANISATION_TYPES,
} from '../api/organisations/organisationConstants';
import {
  PROMOTION_PERMISSIONS,
  PROMOTION_STATUS,
  PROMOTION_TYPES,
} from '../api/promotions/promotionConstants';

export const DEMO_PROMOTION = {
  type: PROMOTION_TYPES.SHARE,
  status: PROMOTION_STATUS.OPEN,
  address1: 'Rue du Test 1',
  zipCode: 1201,
  city: 'Genève',
  contacts: [
    {
      name: 'Jean Dupont',
      title: 'Commercialisation',
      email: 'jean@test.com',
      phoneNumber: '+41 21 800 90 70',
    },
    {
      name: 'Jeanne Dubois',
      title: 'Architecte',
      email: 'jeanne@test.com',
      phoneNumber: '+41 58 999 21 21',
    },
  ],
  agreementDuration: 30,
  isTest: true,
  signingDate: moment().add(6, 'months').toDate(),
};

export const PERMISSIONS = {
  PROMOTER: {
    canAddLots: true,
    canModifyLots: true,
    canRemoveLots: true,
    canModifyPromotion: true,
    canManageDocuments: true,
    displayCustomerNames: {
      forLotStatus: Object.values(
        PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.FOR_LOT_STATUS,
      ),
      invitedBy: PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.INVITED_BY.ANY,
    },
    canInviteCustomers: true,
    canReserveLots: true,
    canSeeManagement: true,
  },
  NOTARY: {
    canAddLots: false,
    canModifyLots: false,
    canRemoveLots: false,
    canModifyPromotion: false,
    canManageDocuments: false,
    displayCustomerNames: {
      forLotStatus: [
        PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.FOR_LOT_STATUS.RESERVED,
        PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.FOR_LOT_STATUS.SOLD,
      ],
      invitedBy: PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.INVITED_BY.ANY,
    },
    canInviteCustomers: false,
    canReserveLots: false,
    canSeeManagement: false,
  },
  BROKER: {
    canAddLots: false,
    canModifyLots: false,
    canRemoveLots: false,
    canModifyPromotion: false,
    canManageDocuments: false,
    displayCustomerNames: {
      forLotStatus: Object.values(
        PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.FOR_LOT_STATUS,
      ),
      invitedBy:
        PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.INVITED_BY.ORGANISATION,
    },
    canInviteCustomers: true,
    canReserveLots: false,
    canSeeManagement: false,
  },
};

export const PROMOTER_ORGANISATION_NAME = 'Promoter organisation';

export const PROMOTER_ORGANISATION = {
  name: PROMOTER_ORGANISATION_NAME,
  type: ORGANISATION_TYPES.DEVELOPER,
  features: [ORGANISATION_FEATURES.PRO],
};

export const NOTARY_ORGANISATION_NAME = 'Notary organisation';

export const NOTARY_ORGANISATION = {
  name: NOTARY_ORGANISATION_NAME,
  type: ORGANISATION_TYPES.NOTARY_OFFICE,
  features: [ORGANISATION_FEATURES.PRO],
};
