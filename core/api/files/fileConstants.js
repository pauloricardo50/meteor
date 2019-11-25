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
  INVESTMENT_PROPERTY_RENT_JUSTIFICATION:
    'INVESTMENT_PROPERTY_RENT_JUSTIFICATION',
  LAND_REGISTER_EXTRACT: 'LAND_REGISTER_EXTRACT',
  PROPERTY_FUTURE_WORKS: 'PROPERTY_FUTURE_WORKS',
  PROPERTY_MINERGIE_CERTIFICATE: 'PROPERTY_MINERGIE_CERTIFICATE',
  PROPERTY_MARKETING_BROCHURE: 'PROPERTY_MARKETING_BROCHURE',
  PROPERTY_PICTURES: 'PROPERTY_PICTURES',
  PROPERTY_PLANS: 'PROPERTY_PLANS',
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
  BONUSES: 'BONUSES',
  CURRENT_MORTGAGES: 'CURRENT_MORTGAGES',
  DEBT_COLLECTION_REGISTER_EXTRACT: 'DEBT_COLLECTION_REGISTER_EXTRACT',
  DIVORCE_RULING: 'DIVORCE_RULING',
  DONATION_JUSTIFICATION_CERTIFICATE: 'DONATION_JUSTIFICATION_CERTIFICATE',
  DONATION_JUSTIFICATION_IDENTITY: 'DONATION_JUSTIFICATION_IDENTITY',
  DONATION_JUSTIFICATION_STATEMENT: 'DONATION_JUSTIFICATION_STATEMENT',
  EXPENSES_JUSTIFICATION: 'EXPENSES_JUSTIFICATION',
  IDENTITY: 'IDENTITY',
  LAST_SALARIES: 'LAST_SALARIES',
  LEGITIMATION_CARD: 'LEGITIMATION_CARD',
  OTHER_FORTUNE_JUSTIFICATION: 'OTHER_FORTUNE_JUSTIFICATION',
  OTHER_INCOME_JUSTIFICATION: 'OTHER_INCOME_JUSTIFICATION',
  OWN_COMPANY_COMMERCIAL_REGISTER: 'OWN_COMPANY_COMMERCIAL_REGISTER',
  OWN_COMPANY_FINANCIAL_STATEMENTS: 'OWN_COMPANY_FINANCIAL_STATEMENTS',
  OWN_FUNDS_JUSTIFICATION: 'OWN_FUND_JUSTIFICATION',
  PENSION_FUND_YEARLY_STATEMENT: 'PENSION_FUND_YEARLY_STATEMENT',
  RESIDENCY_PERMIT: 'RESIDENCY_PERMIT',
  SALARY_CERTIFICATE: 'SALARY_CERTIFICATE',
  TAX_STATEMENT: 'TAX_STATEMENT',
  TAXES: 'TAXES',
  THIRD_PILLAR_ACCOUNTS: 'THIRD_PILLAR_ACCOUNTS',
  WITHDRAWAL_JUSTIFICATION: 'WITHDRAWAL_JUSTIFICATION',
};

export const LOAN_DOCUMENTS = {
  CONTRACT: 'CONTRACT',
  REIMBURSEMENT_STATEMENT: 'REIMBURSEMENT_STATEMENT',
  SIGNED_CONTRACT: 'SIGNED_CONTRACT',
  SIGNED_MANDATE: 'SIGNED_MANDATE',
};

export const DOCUMENTS = {
  ...PROPERTY_DOCUMENTS,
  ...BORROWER_DOCUMENTS,
  ...LOAN_DOCUMENTS,
  OTHER: 'OTHER',
};

export const DOCUMENTS_CATEGORIES = {
  PERSONAL_DOCUMENTS: [
    BORROWER_DOCUMENTS.IDENTITY,
    BORROWER_DOCUMENTS.RESIDENCY_PERMIT,
    BORROWER_DOCUMENTS.LEGITIMATION_CARD,
    BORROWER_DOCUMENTS.DEBT_COLLECTION_REGISTER_EXTRACT,
    BORROWER_DOCUMENTS.DIVORCE_RULING,
  ],
  INCOMES_AND_EXPENSES: [
    BORROWER_DOCUMENTS.TAXES,
    BORROWER_DOCUMENTS.SALARY_CERTIFICATE,
    BORROWER_DOCUMENTS.LAST_SALARIES,
    BORROWER_DOCUMENTS.BONUSES,
    BORROWER_DOCUMENTS.OTHER_INCOME_JUSTIFICATION,
    BORROWER_DOCUMENTS.EXPENSES_JUSTIFICATION,
    BORROWER_DOCUMENTS.CURRENT_MORTGAGES,
  ],
  FORTUNE_AND_OWN_FUNDS: [
    BORROWER_DOCUMENTS.OWN_FUNDS_JUSTIFICATION,
    BORROWER_DOCUMENTS.OTHER_FORTUNE_JUSTIFICATION,
    BORROWER_DOCUMENTS.OWN_COMPANY_FINANCIAL_STATEMENTS,
    BORROWER_DOCUMENTS.DONATION_JUSTIFICATION_CERTIFICATE,
    BORROWER_DOCUMENTS.DONATION_JUSTIFICATION_IDENTITY,
    BORROWER_DOCUMENTS.DONATION_JUSTIFICATION_STATEMENT,
  ],
  RETIREMENT: [
    BORROWER_DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT,
    BORROWER_DOCUMENTS.THIRD_PILLAR_ACCOUNTS,
    BORROWER_DOCUMENTS.WITHDRAWAL_JUSTIFICATION,
  ],
  HOUSING: [
    PROPERTY_DOCUMENTS.PROPERTY_MARKETING_BROCHURE,
    PROPERTY_DOCUMENTS.PROPERTY_PICTURES,
    PROPERTY_DOCUMENTS.PROPERTY_PLANS,
    PROPERTY_DOCUMENTS.PROPERTY_VOLUME,
    PROPERTY_DOCUMENTS.PROPERTY_MINERGIE_CERTIFICATE,
    PROPERTY_DOCUMENTS.FIRE_AND_WATER_INSURANCE,
    PROPERTY_DOCUMENTS.PROPERTY_WORKS_QUOTE,
    PROPERTY_DOCUMENTS.COOWNERSHIP_AGREEMENT,
    PROPERTY_DOCUMENTS.COOWNERSHIP_ALLOCATION_AGREEMENT,
    PROPERTY_DOCUMENTS.PROPERTY_FUTURE_WORKS,
    PROPERTY_DOCUMENTS.INVESTEMENT_PROPERTY_RENTAL_STATEMENT,
    PROPERTY_DOCUMENTS.INVESTEMENT_PROPERTY_SERVICE_CHARGE_SETTLEMENT,
    PROPERTY_DOCUMENTS.PURCHASE_CONTRACT,
    PROPERTY_DOCUMENTS.LAND_REGISTER_EXTRACT,
  ],
  SHARE: [
    PROPERTY_DOCUMENTS.SHARE_BUILDING_PERMIT,
    PROPERTY_DOCUMENTS.SHARE_EASEMENTS,
    PROPERTY_DOCUMENTS.SHARE_FINANCIAL_PLAN,
    PROPERTY_DOCUMENTS.SHARE_GC_CONTRACT,
    PROPERTY_DOCUMENTS.SHARE_GC_QUOTE_BY_BCC,
    PROPERTY_DOCUMENTS.SHARE_INSURANCE_CERTIFICATE,
    PROPERTY_DOCUMENTS.SHARE_PLANS,
    PROPERTY_DOCUMENTS.SHARE_WORKS,
  ],
};

export const DOCUMENTS_WITH_TOOLTIP = [
  DOCUMENTS.BONUSES,
  DOCUMENTS.COOWNERSHIP_AGREEMENT,
  DOCUMENTS.COOWNERSHIP_ALLOCATION_AGREEMENT,
  DOCUMENTS.CURRENT_MORTGAGES,
  DOCUMENTS.DEBT_COLLECTION_REGISTER_EXTRACT,
  DOCUMENTS.EXPENSES_JUSTIFICATION,
  DOCUMENTS.FIRE_AND_WATER_INSURANCE,
  DOCUMENTS.IDENTITY,
  DOCUMENTS.INVESTEMENT_PROPERTY_RENTAL_STATEMENT,
  DOCUMENTS.INVESTEMENT_PROPERTY_SERVICE_CHARGE_SETTLEMENT,
  DOCUMENTS.PURCHASE_CONTRACT,
  DOCUMENTS.LAST_SALARIES,
  DOCUMENTS.LEGITIMATION_CARD,
  DOCUMENTS.OTHER_INCOME_JUSTIFICATION,
  DOCUMENTS.OTHER_FORTUNE_JUSTIFICATION,
  DOCUMENTS.OWN_COMPANY_FINANCIAL_STATEMENTS,
  DOCUMENTS.OWN_FUNDS_JUSTIFICATION,
  DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT,
  DOCUMENTS.PROPERTY_MARKETING_BROCHURE,
  DOCUMENTS.PROPERTY_PICTURES,
  DOCUMENTS.PROPERTY_VOLUME,
  DOCUMENTS.PROPERTY_WORKS_QUOTE,
  DOCUMENTS.PROPERTY_FUTURE_WORKS,
  DOCUMENTS.REIMBURSEMENT_STATEMENT,
  DOCUMENTS.RESIDENCY_PERMIT,
  DOCUMENTS.SIGNED_CONTRACT,
  DOCUMENTS.TAXES,
  DOCUMENTS.THIRD_PILLAR_ACCOUNTS,
  DOCUMENTS.WITHDRAWAL_JUSTIFICATION,
  DOCUMENTS.DONATION_JUSTIFICATION_CERTIFICATE,
  DOCUMENTS.DONATION_JUSTIFICATION_IDENTITY,
  DOCUMENTS.DONATION_JUSTIFICATION_STATEMENT,
];

export const S3_ACLS = {
  PRIVATE: 'private',
  PUBLIC_READ: 'public-read',
  PUBLIC_READ_WRITE: 'public-read-write',
  AUTHENTICATED_READ: 'authenticated-read',
  BUCKET_OWNER_READ: 'bucket-owner-read',
  BUCKET_OWNER_FULL_CONTROL: 'bucket-owner-full-control',
  LOG_DELIVERY_WRITE: 'log-delivery-write',
};
