export const LOANS_COLLECTION = 'loans';

export const LOAN_STATUS = {
  LEAD: 'LEAD',
  QUALIFIED_LEAD: 'QUALIFIED_LEAD',
  ONGOING: 'ONGOING',
  CLOSING: 'CLOSING',
  BILLING: 'BILLING',
  FINALIZED: 'FINALIZED',
  PENDING: 'PENDING',
  UNSUCCESSFUL: 'UNSUCCESSFUL',
  TEST: 'TEST',
};

export const LOAN_STATUS_ORDER = [
  LOAN_STATUS.LEAD,
  LOAN_STATUS.QUALIFIED_LEAD,
  LOAN_STATUS.PENDING,
  LOAN_STATUS.ONGOING,
  LOAN_STATUS.CLOSING,
  LOAN_STATUS.BILLING,
  LOAN_STATUS.FINALIZED,
  LOAN_STATUS.UNSUCCESSFUL,
  LOAN_STATUS.TEST,
];

export const PURCHASE_TYPE = {
  ACQUISITION: 'ACQUISITION',
  REFINANCING: 'REFINANCING',
  // TODO: Figure out what needs to be changed for this
  // CONSTRUCTION: 'CONSTRUCTION',
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
  ANONYMOUS_LOAN: 'ANONYMOUS_LOAN',
  FULL_LOAN: 'FULL_LOAN',
  LOAN_FILES: 'LOAN_FILES',
  LOAN_SEARCH: 'LOAN_SEARCH',
  PRO_LOANS: 'PRO_LOANS',
  PRO_PROMOTION_LOANS: 'PRO_PROMOTION_LOANS',
  PRO_PROPERTY_LOANS: 'PRO_PROPERTY_LOANS',
  USER_LOANS: 'USER_LOANS',
  PRO_LOANS_AGGREGATE: 'PRO_LOANS_AGGREGATE',
};

export const OWN_FUNDS_USAGE_TYPES = {
  WITHDRAW: 'WITHDRAW',
  PLEDGE: 'PLEDGE',
};

export const STEPS = {
  SOLVENCY: 'SOLVENCY',
  REQUEST: 'REQUEST',
  OFFERS: 'OFFERS',
  CLOSING: 'CLOSING',
};

export const STEP_ORDER = [
  STEPS.SOLVENCY,
  STEPS.REQUEST,
  STEPS.OFFERS,
  STEPS.CLOSING,
];

export const SOLVENCY_TYPE = {
  SIMPLE: 'SIMPLE',
  FULL: 'FULL',
};

export const APPLICATION_TYPES = {
  SIMPLE: 'SIMPLE',
  FULL: 'FULL',
};

export const ORGANISATION_NAME_SEPARATOR = ' / ';

export const LOCAL_STORAGE_ANONYMOUS_LOAN = 'ANONYMOUS_LOAN_ID';

export const EMPTY_STRUCTURE = {
  ownFunds: [],
  loanTranches: [],
};

export const LOAN_CATEGORIES = {
  STANDARD: 'STANDARD',
  PREMIUM: 'PREMIUM',
};

export const UNSUCCESSFUL_LOAN_REASONS = {
  // LEAD_LOST
  LEAD_LOST_OTHER_LENDER: 'LEAD_LOST_OTHER_LENDER',
  LEAD_LOST_OTHER_BROKER: 'LEAD_LOST_OTHER_BROKER',
  // BAD OFFER
  BAD_OFFER_LOST_INTEREST: 'BAD_OFFER_LOST_INTEREST',
  BAD_OFFER_REFUSE_LOAN: 'BAD_OFFER_REFUSE_LOAN',
  BAD_OFFER_CONDEMNED_MANDATE: 'BAD_OFFER_CONDEMNED_MANDATE',
  // BAD CLIENT
  BAD_CLIENT_BAD_FAITH: 'BAD_CLIENT_BAD_FAITH',
  BAD_CLIENT_MANDATE_NOT_COMPLIED: 'BAD_CLIENT_MANDATE_NOT_COMPLIED',
  BAD_CLIENT_NOT_INTERESTED: 'BAD_CLIENT_NOT_INTERESTED',
  // NOT SOLVENT
  NOT_SOLVENT_OWN_FUNDS: 'NOT_SOLVENT_OWN_FUNDS',
  NOT_SOLVENT_REVENUES: 'NOT_SOLVENT_REVENUES',
  // PROJECT CHANGED
  PROJECT_CHANGED_GIVE_UP: 'PROJECT_CHANGED_GIVE_UP',
  PROJECT_CHANGED_PERSONAL_SITUATION: 'PROJECT_CHANGED_PERSONAL_SITUATION',
  PROJECT_CHANGED_PROFESSIONAL_SITUATION:
    'PROJECT_CHANGED_PROFESSIONAL_SITUATION',
  PROJECT_CHANGED_PROPERTY_NOT_AVAILABLE:
    'PROJECT_CHANGED_PROPERTY_NOT_AVAILABLE',
  PROJECT_CHANGED_PRICE_RAISED: 'PROJECT_CHANGED_PRICE_RAISED',
  // CONTACT LOSS
  CONTACT_LOSS_UNREACHABLE: 'CONTACT_LOSS_UNREACHABLE',
  CONTACT_LOSS_NO_ANSWER: 'CONTACT_LOSS_NO_ANSWER',
};

export const UNSUCCESSFUL_LOAN_REASON_CATEGORIES = {
  LEAD_LOST: [
    UNSUCCESSFUL_LOAN_REASONS.LEAD_LOST_OTHER_BROKER,
    UNSUCCESSFUL_LOAN_REASONS.LEAD_LOST_OTHER_LENDER,
  ],
  BAD_OFFER: [
    UNSUCCESSFUL_LOAN_REASONS.BAD_OFFER_CONDEMNED_MANDATE,
    UNSUCCESSFUL_LOAN_REASONS.BAD_OFFER_LOST_INTEREST,
    UNSUCCESSFUL_LOAN_REASONS.BAD_OFFER_REFUSE_LOAN,
  ],
  BAD_CLIENT: [
    UNSUCCESSFUL_LOAN_REASONS.BAD_CLIENT_BAD_FAITH,
    UNSUCCESSFUL_LOAN_REASONS.BAD_CLIENT_MANDATE_NOT_COMPLIED,
    UNSUCCESSFUL_LOAN_REASONS.BAD_CLIENT_NOT_INTERESTED,
  ],
  NOT_SOLVENT: [
    UNSUCCESSFUL_LOAN_REASONS.NOT_SOLVENT_OWN_FUNDS,
    UNSUCCESSFUL_LOAN_REASONS.NOT_SOLVENT_REVENUES,
  ],
  PROJECT_CHANGED: [
    UNSUCCESSFUL_LOAN_REASONS.PROJECT_CHANGED_GIVE_UP,
    UNSUCCESSFUL_LOAN_REASONS.PROJECT_CHANGED_PERSONAL_SITUATION,
    UNSUCCESSFUL_LOAN_REASONS.PROJECT_CHANGED_PRICE_RAISED,
    UNSUCCESSFUL_LOAN_REASONS.PROJECT_CHANGED_PROFESSIONAL_SITUATION,
    UNSUCCESSFUL_LOAN_REASONS.PROJECT_CHANGED_PROPERTY_NOT_AVAILABLE,
  ],
  CONTACT_LOSS: [
    UNSUCCESSFUL_LOAN_REASONS.CONTACT_LOSS_NO_ANSWER,
    UNSUCCESSFUL_LOAN_REASONS.CONTACT_LOSS_UNREACHABLE,
  ],
};

export const INSURANCE_POTENTIAL = {
  TRANSMITTED: 'TRANSMITTED',
  INSUFFICIENT: 'INSUFFICIENT',
  VALIDATED: 'VALIDATED',
};
