export const REQUEST_STATUS = {
  ACTIVE: 'ACTIVE',
  DONE: 'DONE',
};

export const PURCHASE_TYPE = {
  ACQUISITION: 'acquisition',
  REFINANCING: 'refinancing',
  CONSTRUCTION: 'construction',
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
};

export const OWNER = {
  FIRST: '0',
  SECOND: '1',
  BOTH: 'both',
  OTHER: 'other',
};

export const AUCTION_STATUS = {
  NONE: '',
  STARTED: 'started',
  ENDED: 'ended',
};

export const OFFER_TYPE = {
  STANDARD: 'standard',
  COUNTERPARTS: 'counterparts',
};

export const CLOSING_STEPS_TYPE = {
  TODO: 'todo',
  UPLOAD: 'upload',
};

export const CLOSING_STEPS_STATUS = {
  UNVERIFIED: 'unverified',
  VALID: 'valid',
  ERROR: 'error',
};

export const AUCTION_MOST_IMPORTANT = {
  SPEED: 'SPEED',
  PRICE: 'PRICE',
  NOTHING: 'NOTHING',
};
