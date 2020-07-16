export const INSURANCE_REQUESTS_COLLECTION = 'insuranceRequests';

export const INSURANCE_REQUEST_STATUS = {
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

export const INSURANCE_REQUEST_STATUS_ORDER = [
  INSURANCE_REQUEST_STATUS.LEAD,
  INSURANCE_REQUEST_STATUS.QUALIFIED_LEAD,
  INSURANCE_REQUEST_STATUS.PENDING,
  INSURANCE_REQUEST_STATUS.ONGOING,
  INSURANCE_REQUEST_STATUS.CLOSING,
  INSURANCE_REQUEST_STATUS.BILLING,
  INSURANCE_REQUEST_STATUS.FINALIZED,
  INSURANCE_REQUEST_STATUS.UNSUCCESSFUL,
  INSURANCE_REQUEST_STATUS.TEST,
];

export const INSURANCE_REQUEST_QUERIES = {
  INSURANCE_REQUEST_SEARCH: 'INSURANCE_REQUEST_SEARCH',
};

export const UNSUCCESSFUL_INSURANCE_REQUESTS_REASONS = {
  NO_ANSWER: 'NO_ANSWER',
  NOT_INTERESTED_IN_PLANNING: 'NOT_INTERESTED_IN_PLANNING',
  NOT_INTERESTED_IN_3A: 'NOT_INTERESTED_IN_3A',
  NOT_INTERESTED_IN_THIRD_PILLAR_RAISE: 'NOT_INTERESTED_IN_THIRD_PILLAR_RAISE',
  PROPERTY_NOT_AVAILABLE: 'PROPERTY_NOT_AVAILABLE',
  OTHER_BROKER: 'OTHER_BROKER',
  INTERESTED_IN_BANK_3A: 'INTERESTED_IN_BANK_3A',
  ADVISED_IN_BANK_3A_FOR_HEALTH_REASONS:
    'ADVISED_IN_BANK_3A_FOR_HEALTH_REASONS',
  WANTS_DIRECT_AMORTIZATION: 'WANTS_DIRECT_AMORTIZATION',
  NO_WITHDRAWAL_TAXES_REDUCTION_LIMIT_REACHED:
    'NO_WITHDRAWAL_TAXES_REDUCTION_LIMIT_REACHED',
};
