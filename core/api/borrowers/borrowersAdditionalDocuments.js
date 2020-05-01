import moment from 'moment';

import { DOCUMENTS } from '../files/fileConstants';
import * as borrowerConstants from './borrowerConstants';

export const initialDocuments = [
  { id: DOCUMENTS.IDENTITY },
  { id: DOCUMENTS.DEBT_COLLECTION_REGISTER_EXTRACT },
  { id: DOCUMENTS.TAXES },
  { id: DOCUMENTS.FEDERAL_TAXES },
  { id: DOCUMENTS.COMMUNAL_TAXES },
];

export const conditionalDocuments = [
  {
    id: DOCUMENTS.RESIDENCY_PERMIT,
    condition: ({ doc: { isSwiss } }) => isSwiss === false,
    fieldsToWatch: ['isSwiss'],
  },
  {
    id: DOCUMENTS.FAMILY_RECORD_BOOK,
    condition: ({ doc: { civilStatus, birthDate } }) =>
      civilStatus === borrowerConstants.CIVIL_STATUS.MARRIED &&
      moment().diff(moment(birthDate), 'days') > 54,
    fieldsToWatch: ['civilStatus', 'birthDate'],
  },
  {
    id: DOCUMENTS.DIVORCE_RULING,
    condition: ({ doc: { civilStatus } }) =>
      civilStatus === borrowerConstants.CIVIL_STATUS.DIVORCED,
    fieldsToWatch: ['civilStatus'],
  },
  {
    id: DOCUMENTS.OWN_COMPANY_COMMERCIAL_REGISTER,
    condition: ({ doc: { activityType, hasOwnCompany } }) =>
      activityType ===
        borrowerConstants.BORROWER_ACTIVITY_TYPES.SELF_EMPLOYED ||
      hasOwnCompany,
    fieldsToWatch: ['activityType', 'hasOwnCompany'],
  },
  {
    id: DOCUMENTS.LAST_SALARIES,
    condition: ({ doc: { activityType } }) =>
      activityType === borrowerConstants.BORROWER_ACTIVITY_TYPES.SALARIED,
    fieldsToWatch: ['activityType'],
  },
  {
    id: DOCUMENTS.BONUSES,
    condition: ({ doc: { bonusExists } }) => bonusExists === true,
    fieldsToWatch: ['bonusExists'],
  },

  {
    id: DOCUMENTS.OTHER_INCOME_JUSTIFICATION,
    condition: ({ doc: { otherIncome } }) =>
      otherIncome && otherIncome.length > 0,
    fieldsToWatch: ['otherIncome'],
  },
  {
    id: DOCUMENTS.WORK_CONTRACT,
    condition: ({ doc: { activityType, jobStartDate } }) =>
      activityType === borrowerConstants.BORROWER_ACTIVITY_TYPES.SALARIED &&
      moment().diff(moment(jobStartDate), 'months') < 13,
    fieldsToWatch: ['activityType', 'jobStartDate'],
  },
  {
    id: DOCUMENTS.SALARY_CERTIFICATE,
    condition: ({ doc: { activityType } }) =>
      activityType === borrowerConstants.BORROWER_ACTIVITY_TYPES.SALARIED,
    fieldsToWatch: ['activityType'],
  },
  {
    id: DOCUMENTS.PROBATIONARY_PERIOD_END_JUSTIFICATION,
    condition: ({ doc: { activityType, jobStartDate } }) =>
      activityType === borrowerConstants.BORROWER_ACTIVITY_TYPES.SALARIED &&
      moment().diff(moment(jobStartDate), 'months') < 4,
    fieldsToWatch: ['activityType', 'jobStartDate'],
  },
  {
    id: DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT,
    condition: ({ doc: { insurance2 } }) => insurance2 && insurance2.length > 0,
    fieldsToWatch: ['insurance2'],
  },
  {
    id: DOCUMENTS.REMAINING_PENSION_FUND,
    condition: ({ doc: { insurance2 } }) => insurance2 && insurance2.length > 0,
    fieldsToWatch: ['insurance2'],
  },
  {
    id: DOCUMENTS.VESTED_BENEFITS_ACCOUNT_STATEMENT,
    condition: ({ doc: { insurance2 } }) => insurance2 && insurance2.length > 0,
    fieldsToWatch: ['insurance2'],
  },
  {
    id: DOCUMENTS.INVESTMENT_PROPERTY_RENT_JUSTIFICATION,
    condition: ({ doc: { realEstate = [] } }) => realEstate.length > 0,
    fieldsToWatch: ['realEstate'],
  },
  {
    id: DOCUMENTS.PROPERTY_DEED,
    condition: ({ doc: { realEstate = [] } }) => realEstate.length > 0,
    fieldsToWatch: ['realEstate'],
  },
  {
    id: DOCUMENTS.OWN_COMPANY_FINANCIAL_STATEMENTS,
    condition: ({ doc: { activityType } }) =>
      activityType === borrowerConstants.BORROWER_ACTIVITY_TYPES.SELF_EMPLOYED,
    fieldsToWatch: ['activityType'],
  },
  {
    id: DOCUMENTS.YEARLY_AVS_ANNUITY_JUSTIFICATION,
    condition: ({ doc: { activityType } }) =>
      activityType === borrowerConstants.BORROWER_ACTIVITY_TYPES.ANNUITANT,
    fieldsToWatch: ['activityType'],
  },
  {
    id: DOCUMENTS.YEARLY_LPP_ANNUITY_JUSTIFICATION,
    condition: ({ doc: { activityType } }) =>
      activityType === borrowerConstants.BORROWER_ACTIVITY_TYPES.ANNUITANT,
    fieldsToWatch: ['activityType'],
  },
  {
    id: DOCUMENTS.LEASE_CONTRACT,
    condition: ({ doc: { expenses = [] } }) =>
      expenses.some(
        ({ description }) => description === borrowerConstants.EXPENSES.LEASING,
      ),
    fieldsToWatch: ['expenses'],
  },
  {
    id: DOCUMENTS.CONSUMER_CREDIT_CONTRACT,
    condition: ({ doc: { expenses = [] } }) =>
      expenses.some(
        ({ description }) =>
          description === borrowerConstants.EXPENSES.PERSONAL_LOAN,
      ),
    fieldsToWatch: ['expenses'],
  },
  {
    id: DOCUMENTS.BANK_ACCOUNT_STATEMENT,
    condition: ({ doc: { bankFortune = [], bank3A = [] } }) =>
      bankFortune.length > 0 || bank3A.length > 0,
    fieldsToWatch: ['bankFortune', 'bank3A'],
  },
  {
    id: DOCUMENTS.INSURANCE_3A_STATEMENT,
    condition: ({ doc: { insurance3A = [] } }) => insurance3A.length > 0,
    fieldsToWatch: ['insurance3A'],
  },
  {
    id: DOCUMENTS.INSURANCE_3B_STATEMENT,
    condition: ({ doc: { insurance3B = [] } }) => insurance3B.length > 0,
    fieldsToWatch: ['insurance3B'],
  },
  {
    id: DOCUMENTS.DONATION_JUSTIFICATION_CERTIFICATE,
    condition: ({ doc: { donation } }) => donation && donation.length > 0,
    fieldsToWatch: ['donation'],
  },
  {
    id: DOCUMENTS.DONATION_JUSTIFICATION_IDENTITY,
    condition: ({ doc: { donation } }) => donation && donation.length > 0,
    fieldsToWatch: ['donation'],
  },
  {
    id: DOCUMENTS.DONATION_JUSTIFICATION_STATEMENT,
    condition: ({ doc: { donation } }) => donation && donation.length > 0,
    fieldsToWatch: ['donation'],
  },
];
