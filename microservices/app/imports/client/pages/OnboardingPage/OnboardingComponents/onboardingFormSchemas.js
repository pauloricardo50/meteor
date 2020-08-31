import SimpleSchema from 'simpl-schema';

import { OWN_FUNDS_TYPES } from 'core/api/borrowers/borrowerConstants';
import { borrowerSchemaObject } from 'core/api/borrowers/schemas/BorrowerSchema';
import { moneyField } from 'core/api/helpers/sharedSchemas';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/autoFormConstants';

import { makeBorrowerFormHeader } from './BorrowerFormHeader';

const getBorrowerSchema = index => ({
  header: makeBorrowerFormHeader(index),
});

const header0 = getBorrowerSchema(0);
const header1 = getBorrowerSchema(1);

export const getBorrowersFormSchema = (borrowerCount, schema) => {
  if (borrowerCount > 1) {
    return new SimpleSchema({
      borrower1: {
        type: new SimpleSchema({ ...header0, ...schema }),
        uniforms: { label: null },
        ignoreParentInLabel: true,
      },
      borrower2: {
        type: new SimpleSchema({ ...header1, ...schema }),
        uniforms: { label: null },
        ignoreParentInLabel: true,
      },
    });
  }

  return new SimpleSchema({
    borrower1: {
      type: new SimpleSchema({ ...header0, ...schema }),
      uniforms: { label: null },
      ignoreParentInLabel: true,
    },
  });
};

export const birthDateSchema = {
  birthDate: {
    type: Date,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
    optional: false,
  },
};

export const incomeSchema = {
  salary: { ...borrowerSchemaObject.salary, optional: false },
  netSalary: borrowerSchemaObject.netSalary,
};

export const ownFundsSchema = Object.values(OWN_FUNDS_TYPES).reduce(
  (obj, key) => ({
    ...obj,
    [key]:
      key === OWN_FUNDS_TYPES.BANK_FORTUNE
        ? { ...moneyField, optional: false }
        : moneyField,
  }),
  {},
);

export const simplifyField = field =>
  field.reduce((t, { value }) => (t ? t + value : value), undefined);

export const simplifyBorrowerOwnFunds = borrower => {
  if (!borrower) {
    return {};
  }

  return Object.values(OWN_FUNDS_TYPES).reduce(
    (obj, field) => ({
      ...obj,
      [field]: simplifyField(borrower[field]),
    }),
    {},
  );
};

export const complexifyBorrowerOwnFunds = borrower => {
  if (!borrower) {
    return {};
  }

  return Object.values(OWN_FUNDS_TYPES).reduce(
    (obj, field) => ({
      ...obj,
      [field]: borrower[field]
        ? [{ value: borrower[field], description: '' }]
        : undefined,
    }),
    {},
  );
};
