import { DOCUMENTS } from '../files/fileConstants';
import * as borrowerConstants from './borrowerConstants';

export const initialDocuments = [
  { id: DOCUMENTS.IDENTITY },
  { id: DOCUMENTS.DEBT_COLLECTION_REGISTER_EXTRACT },
  { id: DOCUMENTS.TAXES },
  { id: DOCUMENTS.SALARY_CERTIFICATE },
  { id: DOCUMENTS.LAST_SALARIES },
  { id: DOCUMENTS.OWN_FUNDS_JUSTIFICATION },
];

export const conditionalDocuments = [
  {
    id: DOCUMENTS.RESIDENCY_PERMIT,
    condition: ({ doc: { isSwiss } }) => isSwiss === false,
  },
  {
    id: DOCUMENTS.DIVORCE_RULING,
    condition: ({ doc: { civilStatus } }) =>
      civilStatus === borrowerConstants.CIVIL_STATUS.DIVORCED,
  },
  {
    id: DOCUMENTS.BONUSES,
    condition: ({ doc: { bonusExists } }) => bonusExists === true,
  },
  {
    id: DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT,
    condition: ({ doc: { insurance2 } }) => insurance2 && insurance2.length > 0,
  },
  {
    id: DOCUMENTS.THIRD_PILLAR_ACCOUNTS,
    condition: ({ doc: { insurance3A, insurance3B, bank3A } }) =>
      (insurance3A && insurance3A.length > 0)
      || (insurance3B && insurance3B.length > 0)
      || (bank3A && bank3A.length > 0),
  },
  {
    id: DOCUMENTS.CURRENT_MORTGAGES,
    condition: ({ doc: { realEstate } }) =>
      realEstate
      && realEstate.length > 0
      && realEstate.some(({ loan }) => loan > 0),
  },
  {
    id: DOCUMENTS.EXPENSES_JUSTIFICATION,
    condition: ({ doc: { expenses } }) => expenses && expenses.length > 0,
  },
  {
    id: DOCUMENTS.OTHER_FORTUNE_JUSTIFICATION,
    condition: ({ doc: { otherFortune } }) =>
      otherFortune && otherFortune.length > 0,
  },
  {
    id: DOCUMENTS.OTHER_INCOME_JUSTIFICATION,
    condition: ({ doc: { otherIncome } }) =>
      otherIncome && otherIncome.length > 0,
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
