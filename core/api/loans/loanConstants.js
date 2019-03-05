// @flow
export const LOANS_COLLECTION = 'loans';

export const LOAN_STATUS = {
  TEST: 'TEST',
  LEAD: 'LEAD',
  ONGOING: 'ONGOING',
  PENDING: 'PENDING',
  CLOSING: 'CLOSING',
  BILLING: 'BILLING',
  FINALIZED: 'FINALIZED',
  UNSUCCESSFUL: 'UNSUCCESSFUL',
};

export const PURCHASE_TYPE = {
  ACQUISITION: 'ACQUISITION',
  REFINANCING: 'REFINANCING',
  // TODO: Figure out what needs to be changed for this
  CONSTRUCTION: 'CONSTRUCTION',
};

// Keep these sorted alphabetically for zipcode search to work
export const CANTONS = {
  AG: 'Aargau',
  AR: 'Appenzell Ausserrhoden',
  AI: 'Appenzell Innerrhoden',
  BL: 'Basel-Land',
  BS: 'Basel-Stadt',
  BE: 'Bern',
  FR: 'Fribourg',
  GE: 'Genève',
  GL: 'Glarus',
  GR: 'Graubünden',
  JU: 'Jura',
  LU: 'Luzern',
  NE: 'Neuchâtel',
  NW: 'Nidwalden',
  OW: 'Obwalden',
  SG: 'St. Gallen',
  SH: 'Schaffhausen',
  SZ: 'Schwyz',
  SO: 'Solothurn',
  TG: 'Thurgau',
  TI: 'Ticino',
  UR: 'Uri',
  VD: 'Vaud',
  VS: 'Valais',
  ZG: 'Zug',
  ZH: 'Zürich',
  LI: 'Liechtenstein',
};

export const OWNER = {
  FIRST: '0',
  SECOND: '1',
  BOTH: 'BOTH',
  OTHER: 'OTHER',
};

export const INSURANCE_USE_PRESET = {
  WITHDRAWAL: 'WITHDRAWAL',
  COLLATERAL: 'COLLATERAL',
};

export const LOAN_STRATEGY_PRESET = {
  FIXED: 'FIXED',
  MANUAL: 'MANUAL',
};

export const AMORTIZATION_TYPE = {
  INDIRECT: 'INDIRECT',
  DIRECT: 'DIRECT',
};

export const PAYMENT_SCHEDULES = {
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
  SEMESTERLY: 'SEMESTERLY',
};

export const LOAN_QUERIES = {
  ADMIN_LOAN: 'ADMIN_LOAN',
  ADMIN_LOANS: 'ADMIN_LOANS',
  FULL_LOAN: 'FULL_LOAN',
  LOAN_FILES: 'LOAN_FILES',
  LOAN_SEARCH: 'LOAN_SEARCH',
  LOAN_WITH_NAME: 'LOAN_WITH_NAME',
  LOANS_ASSIGNED_TO_ADMIN: 'LOANS_ASSIGNED_TO_ADMIN',
  PRO_LOANS: 'PRO_LOANS',
  PRO_PROMOTION_LOANS: 'PRO_PROMOTION_LOANS',
  PRO_PROPERTY_LOANS: 'PRO_PROPERTY_LOANS',
  PRO_REFERRED_BY_LOANS: 'PRO_REFERRED_BY_LOANS',
  SIDENAV_LOANS: 'SIDENAV_LOANS',
  USER_LOAN: 'USER_LOAN',
  USER_LOANS_E2E: 'USER_LOANS_E2E',
};

export const OWN_FUNDS_USAGE_TYPES = {
  WITHDRAW: 'WITHDRAW',
  PLEDGE: 'PLEDGE',
};

export const STEPS = {
  PREPARATION: 'PREPARATION',
  FIND_LENDER: 'FIND_LENDER',
  GET_CONTRACT: 'GET_CONTRACT',
  CLOSING: 'CLOSING',
};

export const STEP_ORDER = [
  STEPS.PREPARATION,
  STEPS.FIND_LENDER,
  STEPS.GET_CONTRACT,
  STEPS.CLOSING,
];

export const LOAN_VERIFICATION_STATUS = {
  NONE: 'NONE',
  REQUESTED: 'REQUESTED',
  OK: 'OK',
  ERROR: 'ERROR',
};
