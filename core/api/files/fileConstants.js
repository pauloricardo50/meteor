import { Meteor } from 'meteor/meteor';

export const FILE_STATUS = {
  UNVERIFIED: 'UNVERIFIED',
  VALID: 'VALID',
  ERROR: 'ERROR',
};

export const FILE_STEPS = {
  AUCTION: 'auction',
  CONTRACT: 'contract',
  CLOSING: 'closing',
  ALL: 'all',
};

export const ALLOWED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'application/pdf',
];

// 50 MB (use null for unlimited)
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

export const SLINGSHOT_DIRECTIVE_NAME = 'exoscale';

export const EXOSCALE_PATH = 'sos-ch-dk-2.exo.io';

export const BUCKET_NAME = Meteor.isServer
  ? Meteor.settings.storage.bucketName
  : '';

export const TEST_BUCKET_NAME = 'e-potek-test-bucket';

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
  PROPERTY_MARKETING_BROCHURE: 'PROPERTY_MARKETING_BROCHURE',
  PROPERTY_PICTURES: 'PROPERTY_PICTURES',
  PROPERTY_PLANS: 'PROPERTY_PLANS',
  PROPERTY_VOLUME: 'PROPERTY_VOLUME',
  PROPERTY_WORKS_QUOTE: 'PROPERTY_WORKS_QUOTE',
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
  CURRENT_MORTGAGES_INTERESTS_STATEMENT: 'CURRENT_MORTGAGE_INTERESTS_STATEMENT',
  CURRENT_MORTGAGES: 'CURRENT_MORTGAGES',
  DEBT_COLLECTION_REGISTER_EXTRACT: 'DEBT_COLLECTION_REGISTER_EXTRACT',
  DIVORCE_RULING: 'DIVORCE_RULING',
  EXPENSES_JUSTIFICATION: 'EXPENSES_JUSTIFICATION',
  IDENTITY: 'IDENTITY',
  LAST_SALARIES: 'LAST_SALARIES',
  OTHER_FORTUNE_JUSTIFICATION: 'OTHER_FORTUNE_JUSTIFICATION',
  OTHER_INCOME_JUSTIFICATION: 'OTHER_INCOME_JUSTIFICATION',
  OWN_COMPANY_COMMERCIAL_REGISTER: 'OWN_COMPANY_COMMERCIAL_REGISTER',
  OWN_COMPANY_FINANCIAL_STATEMENTS: 'OWN_COMPANY_FINANCIAL_STATEMENTS',
  OWN_FUNDS_JUSTIFICATION: 'OWN_FUND_JUSTIFICATION',
  PENSION_FUND_YEARLY_STATEMENT: 'PENSION_FUND_YEARLY_STATEMENT',
  PURCHASE_CONTRACT: 'PURCHASE_CONTRACT',
  RESIDENCY_PERMIT: 'RESIDENCY_PERMIT',
  SALARY_CERTIFICATE: 'SALARY_CERTIFICATE',
  TAX_STATEMENT: 'TAX_STATEMENT',
  TAXES: 'TAXES',
  THIRD_PILLAR_ACCOUNTS: 'THIRD_PILLAR_ACCOUNTS',
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

export const DOCUMENTS_WITH_TOOLTIP = [DOCUMENTS.BONUSES];

export const S3_ACLS = {
  PRIVATE: 'private',
  PUBLIC_READ: 'public-read',
  PUBLIC_READ_WRITE: 'public-read-write',
  AUTHENTICATED_READ: 'authenticated-read',
  BUCKET_OWNER_READ: 'bucket-owner-read',
  BUCKET_OWNER_FULL_CONTROL: 'bucket-owner-full-control',
  LOG_DELIVERY_WRITE: 'log-delivery-write',
};
