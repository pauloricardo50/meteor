export const PROPERTIES_COLLECTION = 'properties';

export const PROPERTY_STATUS = {
  FOR_SALE: 'FOR_SALE',
  RESERVED: 'RESERVED',
  SOLD: 'SOLD',
};

export const RESIDENCE_TYPE = {
  MAIN_RESIDENCE: 'MAIN_RESIDENCE',
  SECOND_RESIDENCE: 'SECOND_RESIDENCE',
  INVESTMENT: 'INVESTMENT',
  COMMERCE: 'COMMERCE',
};

export const PROPERTY_TYPE = {
  FLAT: 'FLAT',
  HOUSE: 'HOUSE',
  TERRAIN: 'TERRAIN',
  COMMERCIAL: 'COMMERCIAL',
  INVESTMENT_BUILDING: 'INVESTMENT_BUILDING',
};

export const VOLUME_NORM = {
  ECA: 'ECA',
  SIA_416: 'SIA_416',
  SIA_116: 'SIA_116',
  BIC: 'BIC',
};

export const AREA_NORM = {
  NIA: 'NIA',
  NLS: 'NLS',
};

export const PROPERTY_QUERIES = {
  ADMIN_PROPERTIES: 'ADMIN_PROPERTIES',
  ANONYMOUS_PROPERTY: 'ANONYMOUS_PROPERTY',
  PRO_PROPERTIES: 'PRO_PROPERTIES',
  PRO_PROPERTY_USERS: 'PRO_PROPERTY_USERS',
  PROPERTY_FILES: 'PROPERTY_FILES',
  PROPERTY_SEARCH: 'PROPERTY_SEARCH',
  USER_PROPERTY: 'USER_PROPERTY',
};

export const HOUSE_TYPE = {
  DETACHED: 'DETACHED',
  ATTACHED_END_BUILDING: 'ATTACHED_END_BUILDING',
  ATTACHED_MID_TERRACE_BUILDING: 'ATTACHED_MID_TERRACE_BUILDING',
};

export const FLAT_TYPE = {
  SINGLE_FLOOR_APARTMENT: 'SINGLE_FLOOR_APARTMENT',
  DUPLEX_APARTMENT: 'DUPLEX_APARTMENT',
  PENTHOUSE_APARTMENT: 'PENTHOUSE_APARTMENT',
  PENTHOUSE_MAISONETTE: 'PENTHOUSE_MAISONETTE',
  TERRACE_APARTMENT: 'TERRACE_APARTMENT',
};

export const MINERGIE_CERTIFICATE = {
  WITHOUT_CERTIFICATE: 'WITHOUT_CERTIFICATE',
  MINERGIE_P: 'MINERGIE_P',
  MINERGIE_ECO: 'MINERGIE_ECO',
  MINERGIE_P_ECO: 'MINERGIE_P_ECO',
  OTHER_CERTIFICATE: 'OTHER_CERTIFICATE',
};

export const PROPERTY_CATEGORY = {
  USER: 'USER',
  PRO: 'PRO',
  PROMOTION: 'PROMOTION',
};

export const PROPERTY_REFERRED_BY_TYPE = {
  ANY: 'ANY',
  USER: 'USER',
  ORGANISATION: 'ORGANISATION',
};

export const PROPERTY_PERMISSIONS = {
  DISPLAY_CUSTOMER_NAMES: {
    FOR_PROPERTY_STATUS: PROPERTY_STATUS,
    REFERRED_BY: PROPERTY_REFERRED_BY_TYPE,
  },
};

export const PROPERTY_PERMISSIONS_FULL_ACCESS = {
  canInviteCustomers: true,
  canInviteProUsers: true,
  canModifyProperty: true,
  canManagePermissions: true,
  canSellProperty: true,
  canReserveProperty: true,
  displayCustomerNames: {
    forPropertyStatus: Object.values(PROPERTY_STATUS),
    referredBy: PROPERTY_REFERRED_BY_TYPE.ANY,
  },
};

export const PROPERTY_SOLVENCY = {
  UNDETERMINED: 'UNDETERMINED',
  NOT_SHARED: 'NOT_SHARED',
  SOLVENT: 'SOLVENT',
  INSOLVENT: 'INSOLVENT',
  PICK_RESIDENCE_TYPE: 'PICK_RESIDENCE_TYPE',
};
