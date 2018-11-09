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

const getBorrowerArrayFieldCondition = ({
  context,
  borrower,
  arrayField,
  description = null,
}) => {
  const currentArrayField = borrower[arrayField];
  if (currentArrayField && currentArrayField.length > 1) {
    if (description) {
      const currentFields = currentArrayField.filter(field => field.description === description);
      const fields = [...Array(currentArrayField.length + 1).keys()].map(index => ({
        currentDescription:
            currentArrayField[index] && currentArrayField[index].description,
        pop:
            context.field(`${arrayField}`).operator === '$pop'
            && index === currentArrayField.length - 1,
        description: context.field(`${arrayField}.${index}.description`)
          .value,
      }));
      const isPoping = fields.some(({ currentDescription, pop }) =>
        currentDescription === description && pop);
      const isUpdating = fields.some(field =>
        field.currentDescription === description
          && field.description
          && field.description !== description);
      const isInserting = fields.some(field => field.description === description);

      return (
        (currentFields.length > 0
          && !(isPoping && currentFields.length === 1)
          && !isUpdating)
        || isInserting
      );
    }
    return true;
  }

  if (!currentArrayField || currentArrayField.length === 0) {
    if (description) {
      return (
        context.field(`${arrayField}.0.description`).isSet === true
        && context.field(`${arrayField}.0.description`).value === description
      );
    }
    return context.field(`${arrayField}.0.description`).isSet === true;
  }

  if (currentArrayField && currentArrayField.length === 1) {
    if (description) {
      return (
        (currentArrayField[0].description === description
          || context.field(`${arrayField}.0.description`).value === description)
        && !(
          context.field(`${arrayField}.0`).isSet
          && context.field(`${arrayField}.0`).operator === '$pop'
        )
      );
    }
    return !(
      context.field(`${arrayField}.0`).isSet
      && context.field(`${arrayField}.0`).operator === '$pop'
    );
  }
};

export const conditionalDocuments = [
  {
    id: DOCUMENTS.RESIDENCY_PERMIT,
    relatedFields: ['isSwiss'],
    condition: ({ context }) => context.field('isSwiss').value === false,
  },
  {
    id: DOCUMENTS.BONUSES,
    relatedFields: ['bonusExists'],
    condition: ({ context }) => context.field('bonusExists').value === true,
  },
  {
    id: DOCUMENTS.PENSION_FUND_YEARLY_STATEMENT,
    condition: ({ context, doc: borrower }) =>
      getBorrowerArrayFieldCondition({
        context,
        borrower,
        arrayField: 'insurance2',
      }),
  },
  {
    id: DOCUMENTS.THIRD_PILLAR_ACCOUNTS,
    condition: ({ context, doc: borrower }) =>
      getBorrowerArrayFieldCondition({
        context,
        borrower,
        arrayField: borrowerConstants.OWN_FUNDS_TYPES.INSURANCE_3A,
      })
      || getBorrowerArrayFieldCondition({
        context,
        borrower,
        arrayField: borrowerConstants.OWN_FUNDS_TYPES.INSURANCE_3B,
      })
      || getBorrowerArrayFieldCondition({
        context,
        borrower,
        arrayField: borrowerConstants.OWN_FUNDS_TYPES.BANK_3A,
      }),
  },
  {
    id: DOCUMENTS.CURRENT_MORTGAGES,
    condition: ({ context, doc: borrower }) =>
      getBorrowerArrayFieldCondition({
        context,
        borrower,
        arrayField: 'expenses',
        description: borrowerConstants.EXPENSES.MORTGAGE_LOAN,
      }),
  },
  {
    id: DOCUMENTS.CURRENT_MORTGAGES_INTERESTS_STATEMENT,
    condition: ({ context, doc: borrower }) =>
      getBorrowerArrayFieldCondition({
        context,
        borrower,
        arrayField: 'expenses',
        description: borrowerConstants.EXPENSES.MORTGAGE_LOAN,
      }),
  },
  {
    id: DOCUMENTS.EXPENSES_JUSTIFICATION,
    condition: ({ context, doc: borrower }) =>
      getBorrowerArrayFieldCondition({
        context,
        borrower,
        arrayField: 'expenses',
      }),
  },
  {
    id: DOCUMENTS.OTHER_FORTUNE_JUSTIFICATION,
    condition: ({ context, doc: borrower }) =>
      getBorrowerArrayFieldCondition({
        context,
        borrower,
        arrayField: 'otherFortune',
      }),
  },
  {
    id: DOCUMENTS.OTHER_INCOME_JUSTIFICATION,
    condition: ({ context, doc: borrower }) =>
      getBorrowerArrayFieldCondition({
        context,
        borrower,
        arrayField: 'otherIncome',
      }),
  },
];
