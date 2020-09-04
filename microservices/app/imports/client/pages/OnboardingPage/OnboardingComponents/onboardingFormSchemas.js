import React from 'react';
import SimpleSchema from 'simpl-schema';

import { OWN_FUNDS_TYPES } from 'core/api/borrowers/borrowerConstants';
import { borrowerSchemaObject } from 'core/api/borrowers/schemas/BorrowerSchema';
import { moneyField } from 'core/api/helpers/sharedSchemas';
import DatePicker from 'core/components/datePickers/DatePicker';

import { makeBorrowerFormHeader } from './BorrowerFormHeader';

const getBorrowerSchema = args => ({
  header: makeBorrowerFormHeader(args),
});

const getSchema = (schema, index) =>
  typeof schema === 'function' ? schema(index) : schema;

export const getBorrowersFormSchema = ({
  borrowerCount,
  schema,
  borrowerIds,
  loanId,
}) => {
  const borrowerSchemaProps = { borrowerCount, borrowerIds, loanId };

  if (borrowerCount > 1) {
    return new SimpleSchema({
      borrower1: {
        type: new SimpleSchema({
          ...getBorrowerSchema({ index: 0, ...borrowerSchemaProps }),
          ...getSchema(schema, 0),
        }),
        uniforms: { label: null },
        ignoreParentInLabel: true,
      },
      borrower2: {
        type: new SimpleSchema({
          ...getBorrowerSchema({ index: 1, ...borrowerSchemaProps }),
          ...getSchema(schema, 1),
        }),
        uniforms: { label: null },
        ignoreParentInLabel: true,
      },
    });
  }

  return new SimpleSchema({
    borrower1: {
      type: new SimpleSchema({
        ...getBorrowerSchema({ index: 0, ...borrowerSchemaProps }),
        ...getSchema(schema, 0),
      }),
      uniforms: { label: null },
      ignoreParentInLabel: true,
    },
  });
};

export const birthDateSchema = {
  birthDate: {
    type: Date,
    uniforms: {
      render: props => <DatePicker {...props} />,
    },
    optional: false,
  },
};

export const incomeSchema = index => ({
  salary: { ...borrowerSchemaObject.salary, optional: false },
  netSalary: borrowerSchemaObject.netSalary,
  ...Object.keys(borrowerSchemaObject)
    .filter(key => key.startsWith('bonus') && !key.endsWith('5')) // Avoid 2015
    .reduce(
      (obj, key) => ({
        ...obj,
        [key]: {
          ...borrowerSchemaObject[key],
          condition: key.startsWith('bonus20')
            ? model => model[`borrower${index + 1}`]?.bonusExists
            : undefined,
        },
      }),
      {},
    ),
  ...Object.keys(borrowerSchemaObject)
    .filter(key => key.startsWith('otherIncome') && !key.endsWith('comment'))
    .reduce((obj, key) => ({ ...obj, [key]: borrowerSchemaObject[key] }), {}),
  ...Object.keys(borrowerSchemaObject)
    .filter(key => key.startsWith('expenses') && !key.endsWith('comment'))
    .reduce((obj, key) => ({ ...obj, [key]: borrowerSchemaObject[key] }), {}),
});

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
