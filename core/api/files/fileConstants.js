import { Meteor } from 'meteor/meteor';

export const FILE_STATUS = {
  UNVERIFIED: 'UNVERIFIED',
  VALID: 'VALID',
  ERROR: 'ERROR',
};

export const ALLOWED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export const ALLOWED_FILE_TYPES_TEMP = [
  'image/png',
  'image/jpeg',
  'application/pdf',
];

export const ONE_KB = 1024;

// 16 MB (use null for unlimited), https://community.exoscale.com/api/sos/
export const MAX_FILE_SIZE = 16 * ONE_KB * ONE_KB;

export const SLINGSHOT_DIRECTIVE_NAME = 'exoscale';
export const SLINGSHOT_DIRECTIVE_NAME_TEMP = 'exoscale-temp';

export const EXOSCALE_PATH = 'sos-ch-dk-2.exo.io';

export const TEST_BUCKET_NAME = 'e-potek-test-bucket';

export const BUCKET_NAME = Meteor.isServer
  ? Meteor.isTest || Meteor.isAppTest
    ? TEST_BUCKET_NAME
    : Meteor.settings.storage.bucketName
  : '';

export const OBJECT_STORAGE_PATH = `https://${BUCKET_NAME}.${EXOSCALE_PATH}`;

export const OBJECT_STORAGE_REGION = 'CH-DK-2';

export const S3_ENDPOINT = 'https://sos-ch-dk-2.exo.io';

export const PROPERTY_DOCUMENTS = {
  COOWNERSHIP_AGREEMENT: 'COOWNERSHIP_AGREEMENT',
  COOWNERSHIP_ALLOCATION_AGREEMENT: 'COOWNERSHIP_ALLOCATION_AGREEMENT',
  FIRE_AND_WATER_INSURANCE: 'FIRE_AND_WATER_INSURANCE',
  INVESTEMENT_PROPERTY_RENTAL_STATEMENT: 'INVESTMENT_PROPERTY_RENTAL_STATEMENT',
  INVESTEMENT_PROPERTY_SERVICE_CHARGE_SETTLEMENT:
    'INVESTEMENT_PROPERTY_SERVICE_CHARGE_SETTLEMENT',
  INVESTEMENT_PROPERTY_WORKS_HISTORY: 'INVESTEMENT_PROPERTY_WORKS_HISTORY',
  INVESTMENT_PROPERTY_CONDOMINIUM_OWNERSHIP_DIVISION_REGISTER:
    'INVESTMENT_PROPERTY_CONDOMINIUM_OWNERSHIP_DIVISION_REGISTER',
  INVESTMENT_PROPERTY_CONDOMINIUM_REGULATION:
    'INVESTMENT_PROPERTY_CONDOMINIUM_REGULATION',
  LAND_REGISTER_EXTRACT: 'LAND_REGISTER_EXTRACT',
  PROPERTY_ADDITIONAL_WORK_STATEMENT: 'PROPERTY_ADDITIONAL_WORK_STATEMENT',
  PROPERTY_CURRENT_MORTGAGE: 'PROPERTY_CURRENT_MORTGAGE',
  PROPERTY_FUTURE_WORKS: 'PROPERTY_FUTURE_WORKS',
  PROPERTY_GC_CONTRACT: 'PROPERTY_GC_CONTRACT',
  PROPERTY_LAST_INTERESTS_SCHEDULE: 'PROPERTY_LAST_INTERESTS_SCHEDULE',
  PROPERTY_MINERGIE_CERTIFICATE: 'PROPERTY_MINERGIE_CERTIFICATE',
  PROPERTY_MARKETING_BROCHURE: 'PROPERTY_MARKETING_BROCHURE',
  PROPERTY_PICTURES: 'PROPERTY_PICTURES',
  PROPERTY_PLANS: 'PROPERTY_PLANS',
  PROPERTY_PURCHASE_DEED: 'PROPERTY_PURCHASE_DEED',
  PROPERTY_RENTAL_AGREEMENT: 'PROPERTY_RENTAL_AGREEMENT',
  PROPERTY_RENTAL_PROJECT: 'PROPERTY_RENTAL_PROJECT',
  PROPERTY_VOLUME: 'PROPERTY_VOLUME',
  PROPERTY_WORKS_QUOTE: 'PROPERTY_WORKS_QUOTE',
  PURCHASE_CONTRACT: 'PURCHASE_CONTRACT',
  SHARE_BUILDING_PERMIT: 'SHARE_BUILDING_PERMIT',
  SHARE_EASEMENTS: 'SHARE_EASEMENTS',
  SHARE_FINANCIAL_PLAN: 'SHARE_FINANCIAL_PLAN',
  SHARE_GC_CONTRACT: 'SHARE_GC_CONTRACT',
  SHARE_GC_QUOTE_BY_BCC: 'SHARE_GC_QUOTE_BY_BCC',
  SHARE_INSURANCE_CERTIFICATE: 'SHARE_INSURANCE_CERTIFICATE',
  SHARE_PLANS: 'SHARE_PLANS',
  SHARE_WORKS: 'SHARE_WORKS',
};

export const BORROWER_DOCUMENTS = {
  ABROAD_LOAN_CONTRACT_WITH_AMORTIZATION:
    'ABROAD_LOAN_CONTRACT_WITH_AMORTIZATION',
  BANK_ACCOUNT_STATEMENT: 'BANK_ACCOUNT_STATEMENT',
  BONUSES: 'BONUSES',
  COMMUNAL_TAXES: 'COMMUNAL_TAXES',
  CONSUMER_CREDIT_CONTRACT: 'CONSUMER_CREDIT_CONTRACT',
  CREDIT_CARD_LOAN: 'CREDIT_CARD_LOAN',
  CURRENT_MORTGAGES: 'CURRENT_MORTGAGES',
  DEBT_COLLECTION_REGISTER_EXTRACT: 'DEBT_COLLECTION_REGISTER_EXTRACT',
  DIVORCE_RULING: 'DIVORCE_RULING',
  DONATION_JUSTIFICATION_CERTIFICATE: 'DONATION_JUSTIFICATION_CERTIFICATE',
  DONATION_JUSTIFICATION_IDENTITY: 'DONATION_JUSTIFICATION_IDENTITY',
  DONATION_JUSTIFICATION_STATEMENT: 'DONATION_JUSTIFICATION_STATEMENT',
  EXPENSES_JUSTIFICATION: 'EXPENSES_JUSTIFICATION',
  FAMILY_RECORD_BOOK: 'FAMILY_RECORD_BOOK',
  FEDERAL_TAXES: 'FEDERAL_TAXES',
  IDENTITY: 'IDENTITY',
  INSURANCE_3A_STATEMENT: 'INSURANCE_3A_STATEMENT',
  INSURANCE_3B_STATEMENT: 'INSURANCE_3B_STATEMENT',
  // INSURANCE_BILLS: 'INSURANCE_BILLS',
  // INSURANCE_CORRESPONDENCE: 'INSURANCE_CORRESPONDENCE',
  // INSURANCE_MANDATE: 'INSURANCE_MANDATE',
  // INSURANCE_POLICY: 'INSURANCE_POLICY',
  // INSURANCE_SIGNED_PROPOSAL: 'INSURANCE_SIGNED_PROPOSAL',
  INVESTMENT_PROPERTY_RENT_JUSTIFICATION:
    'INVESTMENT_PROPERTY_RENT_JUSTIFICATION',
  LAST_SALARIES: 'LAST_SALARIES',
  LAST_12_SALARIES: 'LAST_12_SALARIES',
  LEASE_CONTRACT: 'LEASE_CONTRACT',
  LEGITIMATION_CARD: 'LEGITIMATION_CARD',
  OTHER_FORTUNE_JUSTIFICATION: 'OTHER_FORTUNE_JUSTIFICATION',
  OTHER_INCOME_JUSTIFICATION: 'OTHER_INCOME_JUSTIFICATION',
  OWN_COMPANY_COMMERCIAL_REGISTER: 'OWN_COMPANY_COMMERCIAL_REGISTER',
  OWN_COMPANY_FINANCIAL_STATEMENTS: 'OWN_COMPANY_FINANCIAL_STATEMENTS',
  OWN_FUND_JUSTIFICATION: 'OWN_FUND_JUSTIFICATION',
  PENSION_FUND_YEARLY_STATEMENT: 'PENSION_FUND_YEARLY_STATEMENT',
  PROBATIONARY_PERIOD_END_JUSTIFICATION:
    'PROBATIONARY_PERIOD_END_JUSTIFICATION',
  PROPERTY_DEED: 'PROPERTY_DEED',
  REMAINING_PENSION_FUND: 'REMAINING_PENSION_FUND',
  RESIDENCY_PERMIT: 'RESIDENCY_PERMIT',
  SALARY_CERTIFICATE: 'SALARY_CERTIFICATE',
  TAX_STATEMENT: 'TAX_STATEMENT',
  TAXES: 'TAXES',
  THIRD_PILLAR_ACCOUNTS: 'THIRD_PILLAR_ACCOUNTS',
  VESTED_BENEFITS_ACCOUNT_STATEMENT: 'VESTED_BENEFITS_ACCOUNT_STATEMENT',
  WITHDRAWAL_JUSTIFICATION: 'WITHDRAWAL_JUSTIFICATION',
  WORK_CONTRACT: 'WORK_CONTRACT',
  YEARLY_AVS_ANNUITY_JUSTIFICATION: 'YEARLY_AVS_ANNUITY_JUSTIFICATION',
  YEARLY_LPP_ANNUITY_JUSTIFICATION: 'YEARLY_LPP_ANNUITY_JUSTIFICATION',
};

export const LOAN_DOCUMENTS = {
  CONTRACT: 'CONTRACT',
  REIMBURSEMENT_STATEMENT: 'REIMBURSEMENT_STATEMENT',
  SIGNED_CONTRACT: 'SIGNED_CONTRACT',
  SIGNED_MANDATE: 'SIGNED_MANDATE',
};

export const INSURANCE_REQUEST_DOCUMENTS = {
  INSURANCE_MANDATE: 'INSURANCE_MANDATE',
};
export const INSURANCE_DOCUMENTS = {
  INSURANCE_BILLS: 'INSURANCE_BILLS',
  INSURANCE_CORRESPONDENCE: 'INSURANCE_CORRESPONDENCE',
  INSURANCE_POLICY: 'INSURANCE_POLICY',
  INSURANCE_SIGNED_PROPOSAL: 'INSURANCE_SIGNED_PROPOSAL',
};

export const DOCUMENTS = {
  ...PROPERTY_DOCUMENTS,
  ...BORROWER_DOCUMENTS,
  ...LOAN_DOCUMENTS,
  ...INSURANCE_REQUEST_DOCUMENTS,
  ...INSURANCE_DOCUMENTS,
  OTHER: 'OTHER',
};

export const DOCUMENTS_CATEGORIES = {
  PERSONAL_DOCUMENTS: [
    BORROWER_DOCUMENTS.IDENTITY,
    BORROWER_DOCUMENTS.RESIDENCY_PERMIT,
    BORROWER_DOCUMENTS.LEGITIMATION_CARD,
    BORROWER_DOCUMENTS.DEBT_COLLECTION_REGISTER_EXTRACT,
    BORROWER_DOCUMENTS.DIVORCE_RULING,
    BORROWER_DOCUMENTS.FAMILY_RECORD_BOOK,
  ],
  PROFESSION: [
    BORROWER_DOCUMENTS.OWN_COMPANY_COMMERCIAL_REGISTER,
    BORROWER_DOCUMENTS.WORK_CONTRACT,
    BORROWER_DOCUMENTS.SALARY_CERTIFICATE,
    BORROWER_DOCUMENTS.PROBATIONARY_PERIOD_END_JUSTIFICATION,
  ],
  INCOMES: [
    BORROWER_DOCUMENTS.TAXES,
    BORROWER_DOCUMENTS.FEDERAL_TAXES,
    BORROWER_DOCUMENTS.COMMUNAL_TAXES,
    BORROWER_DOCUMENTS.LAST_SALARIES,
    BORROWER_DOCUMENTS.LAST_12_SALARIES,
    BORROWER_DOCUMENTS.BONUSES,
    BORROWER_DOCUMENTS.OTHER_INCOME_JUSTIFICATION,
    BORROWER_DOCUMENTS.INVESTMENT_PROPERTY_RENT_JUSTIFICATION,
    BORROWER_DOCUMENTS.OWN_COMPANY_FINANCIAL_STATEMENTS,
    BORROWER_DOCUMENTS.YEARLY_AVS_ANNUITY_JUSTIFICATION,
    BORROWER_DOCUMENTS.YEARLY_LPP_ANNUITY_JUSTIFICATION,
  ],
  EXPENSES: [
    BORROWER_DOCUMENTS.LEASE_CONTRACT,
    BORROWER_DOCUMENTS.CONSUMER_CREDIT_CONTRACT,
    BORROWER_DOCUMENTS.ABROAD_LOAN_CONTRACT_WITH_AMORTIZATION,
    BORROWER_DOCUMENTS.CREDIT_CARD_LOAN,
    BORROWER_DOCUMENTS.EXPENSES_JUSTIFICATION,
    BORROWER_DOCUMENTS.CURRENT_MORTGAGES,
  ],
  INSURANCE: [
    INSURANCE_DOCUMENTS.INSURANCE_CORRESPONDENCE,
    INSURANCE_DOCUMENTS.INSURANCE_MANDATE,
    INSURANCE_DOCUMENTS.INSURANCE_POLICY,
    INSURANCE_DOCUMENTS.INSURANCE_SIGNED_PROPOSAL,
    INSURANCE_DOCUMENTS.INSURANCE_BILLS,
  ],
  OWN_FUNDS: [
    BORROWER_DOCUMENTS.OWN_FUND_JUSTIFICATION,
    BORROWER_DOCUMENTS.OTHER_FORTUNE_JUSTIFICATION,
    BORROWER_DOCUMENTS.DONATION_JUSTIFICATION_CERTIFICATE,
    BORROWER_DOCUMENTS.DONATION_JUSTIFICATION_IDENTITY,
    BORROWER_DOCUMENTS.DONATION_JUSTIFICATION_STATEMENT,
    BORROWER_DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT,
    BORROWER_DOCUMENTS.REMAINING_PENSION_FUND,
    BORROWER_DOCUMENTS.VESTED_BENEFITS_ACCOUNT_STATEMENT,
    BORROWER_DOCUMENTS.BANK_ACCOUNT_STATEMENT,
    BORROWER_DOCUMENTS.INSURANCE_3A_STATEMENT,
    BORROWER_DOCUMENTS.INSURANCE_3B_STATEMENT,
    BORROWER_DOCUMENTS.PROPERTY_DEED,
    BORROWER_DOCUMENTS.THIRD_PILLAR_ACCOUNTS,
    BORROWER_DOCUMENTS.WITHDRAWAL_JUSTIFICATION,
  ],
  PROPERTY: [
    PROPERTY_DOCUMENTS.PROPERTY_MARKETING_BROCHURE,
    PROPERTY_DOCUMENTS.PROPERTY_PICTURES,
    PROPERTY_DOCUMENTS.PROPERTY_PLANS,
    PROPERTY_DOCUMENTS.PROPERTY_VOLUME,
    PROPERTY_DOCUMENTS.PROPERTY_MINERGIE_CERTIFICATE,
    PROPERTY_DOCUMENTS.FIRE_AND_WATER_INSURANCE,
    PROPERTY_DOCUMENTS.PROPERTY_WORKS_QUOTE,
    PROPERTY_DOCUMENTS.PROPERTY_FUTURE_WORKS,
    PROPERTY_DOCUMENTS.PURCHASE_CONTRACT,
    PROPERTY_DOCUMENTS.LAND_REGISTER_EXTRACT,
    PROPERTY_DOCUMENTS.PROPERTY_ADDITIONAL_WORK_STATEMENT,
    PROPERTY_DOCUMENTS.PROPERTY_GC_CONTRACT,
    PROPERTY_DOCUMENTS.SHARE_BUILDING_PERMIT,
  ],
  COPROPERTY: [
    PROPERTY_DOCUMENTS.INVESTMENT_PROPERTY_CONDOMINIUM_OWNERSHIP_DIVISION_REGISTER,
    PROPERTY_DOCUMENTS.INVESTMENT_PROPERTY_CONDOMINIUM_REGULATION,
    PROPERTY_DOCUMENTS.COOWNERSHIP_AGREEMENT,
    PROPERTY_DOCUMENTS.COOWNERSHIP_ALLOCATION_AGREEMENT,
  ],
  INVESTMENT_BUILDING: [
    PROPERTY_DOCUMENTS.PROPERTY_PURCHASE_DEED,
    PROPERTY_DOCUMENTS.INVESTEMENT_PROPERTY_RENTAL_STATEMENT,
    PROPERTY_DOCUMENTS.PROPERTY_RENTAL_AGREEMENT,
    PROPERTY_DOCUMENTS.PROPERTY_RENTAL_PROJECT,
    PROPERTY_DOCUMENTS.INVESTEMENT_PROPERTY_SERVICE_CHARGE_SETTLEMENT,
  ],
  REFINANCING: [
    PROPERTY_DOCUMENTS.PROPERTY_CURRENT_MORTGAGE,
    PROPERTY_DOCUMENTS.PROPERTY_LAST_INTERESTS_SCHEDULE,
  ],
  SHARE: [
    PROPERTY_DOCUMENTS.SHARE_EASEMENTS,
    PROPERTY_DOCUMENTS.SHARE_FINANCIAL_PLAN,
    PROPERTY_DOCUMENTS.SHARE_GC_CONTRACT,
    PROPERTY_DOCUMENTS.SHARE_GC_QUOTE_BY_BCC,
    PROPERTY_DOCUMENTS.SHARE_INSURANCE_CERTIFICATE,
    PROPERTY_DOCUMENTS.SHARE_PLANS,
    PROPERTY_DOCUMENTS.SHARE_WORKS,
  ],
};

export const S3_ACLS = {
  PRIVATE: 'private',
  PUBLIC_READ: 'public-read',
  PUBLIC_READ_WRITE: 'public-read-write',
  AUTHENTICATED_READ: 'authenticated-read',
  BUCKET_OWNER_READ: 'bucket-owner-read',
  BUCKET_OWNER_FULL_CONTROL: 'bucket-owner-full-control',
  LOG_DELIVERY_WRITE: 'log-delivery-write',
};

export const BASIC_DOCUMENTS_LIST = [
  BORROWER_DOCUMENTS.BANK_ACCOUNT_STATEMENT,
  BORROWER_DOCUMENTS.IDENTITY,
  BORROWER_DOCUMENTS.TAXES,
  BORROWER_DOCUMENTS.LAST_SALARIES,
  BORROWER_DOCUMENTS.BONUSES,
  BORROWER_DOCUMENTS.SALARY_CERTIFICATE,
  BORROWER_DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT,
];

export const FILE_ROLES = {
  PUBLIC: 'public',
  USER: 'user',
  PRO: 'pro',
  ADMIN: 'admin',
};
