import { DOCUMENTS } from '../files/fileConstants';
import * as borrowerConstants from './borrowerConstants';

export const initialDocuments = [
  { id: DOCUMENTS.IDENTITY },
  { id: DOCUMENTS.DEBT_COLLECTION_REGISTER_EXTRACT },
  { id: DOCUMENTS.TAXES },
  { id: DOCUMENTS.TAX_STATEMENT },
  { id: DOCUMENTS.SALARY_CERTIFICATE },
  { id: DOCUMENTS.LAST_SALARIES },
  { id: DOCUMENTS.OWN_FUNDS_JUSTIFICATION },
];

export const conditionalDocuments = [
  {
    id: DOCUMENTS.RESIDENCY_PERMIT,
    condition: ({ doc }) => doc.isSwiss === false,
  },
  {
    id: DOCUMENTS.BONUSES,
    condition: ({ doc }) => doc.bonusExists === true,
  },
  {
    id: DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT,
    condition: ({ doc }) => doc.insurance2 && doc.insurance2.length > 0,
  },
  {
    id: DOCUMENTS.THIRD_PILLAR_ACCOUNTS,
    condition: ({ doc }) => (
      (doc.insurance3A && doc.insurance3A.length > 0)
        || (doc.insurance3B && doc.insurance3B.length > 0)
        || (doc.bank3A && doc.bank3A.length > 0)
    ),
  },
  {
    id: DOCUMENTS.CURRENT_MORTGAGES,
    condition: ({ doc }) => (
      doc.expenses
        && doc.expenses.length > 0
        && doc.expenses.some(({ description }) =>
          description === borrowerConstants.EXPENSES.MORTGAGE_LOAN)
    ),
  },
  {
    id: DOCUMENTS.CURRENT_MORTGAGES_INTERESTS_STATEMENT,
    condition: ({ doc }) =>
      doc.expenses
      && doc.expenses.length > 0
      && doc.expenses.some(({ description }) =>
        description === borrowerConstants.EXPENSES.MORTGAGE_LOAN),
  },
  {
    id: DOCUMENTS.EXPENSES_JUSTIFICATION,
    condition: ({ doc }) => doc.expenses && doc.expenses.length > 0,
  },
  {
    id: DOCUMENTS.OTHER_FORTUNE_JUSTIFICATION,
    condition: ({ doc }) => doc.otherFortune && doc.otherFortune.length > 0,
  },
  {
    id: DOCUMENTS.OTHER_INCOME_JUSTIFICATION,
    condition: ({ doc }) => doc.otherIncome && doc.otherIncome.length > 0,
  },
];
