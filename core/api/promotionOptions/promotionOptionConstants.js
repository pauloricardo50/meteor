export const PROMOTION_OPTIONS_COLLECTION = 'promotionOptions';

export const PROMOTION_OPTION_QUERIES = {
  APP_PROMOTION_OPTION: 'APP_PROMOTION_OPTION',
  PRO_PROMOTION_OPTIONS: 'PRO_PROMOTION_OPTIONS',
};

export const PROMOTION_OPTION_STATUS = {
  INTERESTED: 'INTERESTED',
  RESERVATION_REQUESTED: 'RESERVATION_REQUESTED',
  RESERVATION_CANCELED: 'RESERVATION_CANCELED',
  RESERVATION_EXPIRED: 'RESERVATION_EXPIRED',
  RESERVATION_ACTIVE: 'RESERVATION_ACTIVE',
  RESERVATION_WAITLIST: 'RESERVATION_WAITLIST',
  RESERVED: 'RESERVED',
  SOLD: 'SOLD',
};

export const AGREEMENT_STATUSES = {
  UNSIGNED: 'UNSIGNED',
  WAITING: 'WAITING',
  SIGNED: 'SIGNED',
};

export const DEPOSIT_STATUSES = {
  UNPAID: 'UNPAID',
  PAID: 'PAID',
};

export const PROMOTION_OPTION_BANK_STATUS = {
  NONE: 'NONE',
  WAITING: 'WAITING',
  REJECTED: 'REJECTED',
  VALIDATED: 'VALIDATED',
  VALIDATED_WITH_CONDITIONS: 'VALIDATED_WITH_CONDITIONS',
};

export const PROMOTION_OPTION_MORTGAGE_CERTIFICATION_STATUS = {
  TO_BE_VERIFIED: 'TO_BE_VERIFIED',
  UNDETERMINED: 'UNDETERMINED',
  SOLVENT: 'SOLVENT',
  INSOLVENT: 'INSOLVENT',
};

export const PROMOTION_OPTION_DOCUMENTS = {
  RESERVATION_AGREEMENT: 'RESERVATION_AGREEMENT',
  DEPOSIT_JUSTIFICATION: 'DEPOSIT_JUSTIFICATION',
  NOMINATIVE_PURCHASE_ACT: 'NOMINATIVE_PURCHASE_ACT',
  NOMINATIVE_SHARE_GC_CONTRACT: 'NOMINATIVE_SHARE_GC_CONTRACT',
};
