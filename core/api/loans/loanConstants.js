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
  CONSTRUCTION: 'CONSTRUCTION',
};

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
};

export const OWNER = {
  FIRST: '0',
  SECOND: '1',
  BOTH: 'BOTH',
  OTHER: 'OTHER',
};

export const AUCTION_STATUS = {
  NONE: '',
  STARTED: 'STARTED',
  ENDED: 'ENDED',
};

export const CLOSING_STEPS_TYPE = {
  TODO: 'TODO',
  UPLOAD: 'UPLOAD',
};

export const CLOSING_STEPS_STATUS = {
  UNVERIFIED: 'UNVERIFIED',
  VALID: 'VALID',
  ERROR: 'ERROR',
};

export const AUCTION_MOST_IMPORTANT = {
  SPEED: 'SPEED',
  PRICE: 'PRICE',
  NOTHING: 'NOTHING',
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
  LOANS_ASSIGNED_TO: 'LOANS_ASSIGNED_TO',
  SIDENAV_LOANS: 'SIDENAV_LOANS',
  USER_LOANS_E2E: 'USER_LOANS_E2E',
  USER_LOAN: 'USER_LOAN',
  LOAN_FILES: 'LOAN_FILES',
  LOAN_SEARCH: 'LOAN_SEARCH',
  LOANS_ASSIGNED_TO_ADMIN: 'LOANS_ASSIGNED_TO_ADMIN',
  LOAN_WITH_NAME: 'LOAN_WITH_NAME',
  PRO_LOANS: 'PRO_LOANS',
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
