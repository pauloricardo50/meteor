// @flow
export const LOANS_COLLECTION = 'loans';

export const LOAN_STATUS = {
  ACTIVE: 'ACTIVE',
  DONE: 'DONE',
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

export const INTEREST_RATES = {
  LIBOR: 'interestLibor',
  YEARS_1: 'interest1',
  YEARS_2: 'interest2',
  YEARS_5: 'interest5',
  YEARS_10: 'interest10',
  YEARS_15: 'interest15',
  YEARS_20: 'interest20',
  YEARS_25: 'interest25',
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
};

export const OWN_FUNDS_USAGE_TYPES = {
  WITHDRAW: 'WITHDRAW',
  PLEDGE: 'PLEDGE',
};
