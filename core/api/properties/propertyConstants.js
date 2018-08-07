// @flow
export const PROPERTIES_COLLECTION = 'properties';

export const PROPERTY_STATUS = {
  SOLD: 'SOLD',
  FOR_SALE: 'FOR_SALE',
};

export const RESIDENCE_TYPE = {
  MAIN: 'MAIN_RESIDENCE',
  SECOND: 'SECOND_RESIDENCE',
  INVESTMENT: 'INVESTMENT',
};

export const PROPERTY_TYPE = {
  FLAT: 'FLAT',
  HOUSE: 'HOUSE',
};

export const VOLUME_NORM = {
  SIA_416: 'SIA_416',
  SIA_116: 'SIA_116',
  BIC: 'BIC',
};

export const EXPERTISE_RATING = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
};

export const PROPERTY_QUERIES = {
  PROPERTY_ASSIGNED_TO: 'PROPERTY_ASSIGNED_TO',
  SIDENAV_PROPERTIES: 'SIDENAV_PROPERTIES',
  PROPERTIES: 'PROPERTIES',
  USER_PROPERTY: 'USER_PROPERTY',
  ADMIN_PROPERTY: 'ADMIN_PROPERTY',
};

export const EXPERTISE_STATUS = {
  NONE: 'NONE',
  DONE: 'DONE',
  ERROR: 'ERROR',
};

export const HOUSE_TYPE = {
  DETACHED: 'DETACHED',
  ATTACHED_END: 'ATTACHED_END_BUILDING',
  ATTACHED_MID: 'ATTACHED_MID_TERRACE_BUILDING',
};

export const FLAT_TYPE = {
  SINGLE_FLOOR: 'SINGLE_FLOOR_APARTMENT',
  DUPLEX: 'DUPLEX_APARTMENT',
  PENTHOUSE: 'PENTHOUSE_APARTMENT',
  PENTHOUSE_DUPLEX: 'PENTHOUSE_MAISONETTE',
  GROUND_FLOOR: 'TERRACE_APARTMENT',
};

export const MINERGIE_CERTIFICATE = {
  WITHOUT: 'WITHOUT_CERTIFICATE',
  P: 'MINERGIE_P',
  ECO: 'MINERGIE_ECO',
  P_ECO: 'MINERGIE_P_ECO',
  OTHER: 'OTHER_CERTIFICATE',
};
