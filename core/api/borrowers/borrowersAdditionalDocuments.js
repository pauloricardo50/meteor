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
  },
  {
    id: DOCUMENTS.FAMILY_RECORD_BOOK,
    condition: ({ doc: { civilStatus, birthDate } }) =>
      civilStatus === borrowerConstants.CIVIL_STATUS.MARRIED &&
      moment().diff(moment(birthDate), 'days') > 54,
  },
  {
    id: DOCUMENTS.DIVORCE_RULING,
    condition: ({ doc: { civilStatus } }) =>
      civilStatus === borrowerConstants.CIVIL_STATUS.DIVORCED,
  },
  {
    id: DOCUMENTS.OWN_COMPANY_COMMERCIAL_REGISTER,
    condition: ({ doc: { activityType, hasOwnCompany } }) =>
      activityType ===
        borrowerConstants.BORROWER_ACTIVITY_TYPES.SELF_EMPLOYED ||
      hasOwnCompany,
  },
  {
    id: DOCUMENTS.LAST_SALARIES,
    condition: ({ doc: { activityType } }) =>
      activityType === borrowerConstants.BORROWER_ACTIVITY_TYPES.SALARIED,
  },
  {
    id: DOCUMENTS.BONUSES,
    condition: ({ doc: { bonusExists } }) => bonusExists === true,
  },

  {
    id: DOCUMENTS.OTHER_INCOME_JUSTIFICATION,
    condition: ({ doc: { otherIncome } }) =>
      otherIncome && otherIncome.length > 0,
  },
  {
    id: DOCUMENTS.WORK_CONTRACT,
    condition: ({ doc: { activityType, jobStartDate } }) =>
      activityType === borrowerConstants.BORROWER_ACTIVITY_TYPES.SALARIED &&
      moment().diff(moment(jobStartDate), 'months') < 13,
  },
  {
    id: DOCUMENTS.SALARY_CERTIFICATE,
    condition: ({ doc: { activityType } }) =>
      activityType === borrowerConstants.BORROWER_ACTIVITY_TYPES.SALARIED,
  },
  {
    id: DOCUMENTS.PROBATIONARY_PERIOD_END_JUSTIFICATION,
    condition: ({ doc: { activityType, jobStartDate } }) =>
      activityType === borrowerConstants.BORROWER_ACTIVITY_TYPES.SALARIED &&
      moment().diff(moment(jobStartDate), 'months') < 4,
  },
  {
    id: DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT,
    condition: ({ doc: { insurance2 } }) => insurance2 && insurance2.length > 0,
  },
  {
    id: DOCUMENTS.REMAINING_PENSION_FUND,
    condition: ({ doc: { insurance2 } }) => insurance2 && insurance2.length > 0,
  },
  {
    id: DOCUMENTS.VESTED_BENEFITS_ACCOUNT_STATEMENT,
    condition: ({ doc: { insurance2 } }) => insurance2 && insurance2.length > 0,
  },
  {
    id: DOCUMENTS.INVESTMENT_PROPERTY_RENT_JUSTIFICATION,
    condition: ({ doc: { realEstate = [] } }) => realEstate.length > 0,
  },
  {
    id: DOCUMENTS.PROPERTY_DEED,
    condition: ({ doc: { realEstate = [] } }) => realEstate.length > 0,
  },
  {
    id: DOCUMENTS.OWN_COMPANY_FINANCIAL_STATEMENTS,
    condition: ({ doc: { activityType } }) =>
      activityType === borrowerConstants.BORROWER_ACTIVITY_TYPES.SELF_EMPLOYED,
  },
  {
    id: DOCUMENTS.YEARLY_AVS_ANNUITY_JUSTIFICATION,
    condition: ({ doc: { activityType } }) =>
      activityType === borrowerConstants.BORROWER_ACTIVITY_TYPES.ANNUITANT,
  },
  {
    id: DOCUMENTS.YEARLY_LPP_ANNUITY_JUSTIFICATION,
    condition: ({ doc: { activityType } }) =>
      activityType === borrowerConstants.BORROWER_ACTIVITY_TYPES.ANNUITANT,
  },
  {
    id: DOCUMENTS.LEASE_CONTRACT,
    condition: ({ doc: { expenses = [] } }) =>
      expenses.some(
        ({ description }) => description === borrowerConstants.EXPENSES.LEASING,
      ),
  },
  {
    id: DOCUMENTS.CONSUMER_CREDIT_CONTRACT,
    condition: ({ doc: { expenses = [] } }) =>
      expenses.some(
        ({ description }) =>
          description === borrowerConstants.EXPENSES.PERSONAL_LOAN,
      ),
  },
  {
    id: DOCUMENTS.BANK_ACCOUNT_STATEMENT,
    condition: ({ doc: { bankFortune = [], bank3A = [] } }) =>
      bankFortune.length > 0 || bank3A.length > 0,
  },
  {
    id: DOCUMENTS.INSURANCE_3A_STATEMENT,
    condition: ({ doc: { insurance3A = [] } }) => insurance3A.length > 0,
  },
  {
    id: DOCUMENTS.INSURANCE_3B_STATEMENT,
    condition: ({ doc: { insurance3B = [] } }) => insurance3B.length > 0,
  },
  {
    id: DOCUMENTS.DONATION_JUSTIFICATION_CERTIFICATE,
    condition: ({ doc: { donation } }) => donation && donation.length > 0,
  },
  {
    id: DOCUMENTS.DONATION_JUSTIFICATION_IDENTITY,
    condition: ({ doc: { donation } }) => donation && donation.length > 0,
  },
  {
    id: DOCUMENTS.DONATION_JUSTIFICATION_STATEMENT,
    condition: ({ doc: { donation } }) => donation && donation.length > 0,
  },
];
