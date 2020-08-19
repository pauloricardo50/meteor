import React from 'react';
import { faBuilding } from '@fortawesome/pro-duotone-svg-icons/faBuilding';
import { faCommentDollar } from '@fortawesome/pro-duotone-svg-icons/faCommentDollar';
import { faHomeLg } from '@fortawesome/pro-duotone-svg-icons/faHomeLg';
import { faHouseDay } from '@fortawesome/pro-duotone-svg-icons/faHouseDay';
import { faSearchLocation } from '@fortawesome/pro-duotone-svg-icons/faSearchLocation';
import SimpleSchema from 'simpl-schema';

import { borrowerUpdate } from 'core/api/borrowers/methodDefinitions';
import {
  ACQUISITION_STATUS,
  PURCHASE_TYPE,
} from 'core/api/loans/loanConstants';
import {
  loanInsertBorrowers,
  loanUpdate,
  upsertUserProperty,
} from 'core/api/loans/methodDefinitions';
import { propertyUpdate } from 'core/api/properties/methodDefinitions';
import { RESIDENCE_TYPE } from 'core/api/properties/propertyConstants';
import AcquisitionIcon from 'core/components/Icon/AcquisitionIcon';
import RefinancingIcon from 'core/components/Icon/RefinancingIcon';
import { refinancingPropertySchema } from 'core/components/PropertyForm/PropertyAdderDialog';
import T, { Money } from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';
import { not, or } from 'core/utils/functional';

import {
  birthDateSchema,
  complexifyBorrowerOwnFunds,
  incomeSchema,
  ownFundsSchema,
  simplifyBorrowerOwnFunds,
} from './OnboardingComponents/onboardingFormSchemas';

const always = () => true;
const isProFlow = loan => loan.hasPromotion || loan.hasProProperty;
const isRefinancing = loan => loan.purchaseType === PURCHASE_TYPE.REFINANCING;
const knowsProperty = loan =>
  loan.projectStatus && loan.projectStatus !== ACQUISITION_STATUS.SEARCHING;

const updateBorrowers = (loan, borrower1, borrower2) => {
  const promises = [];
  if (loan.borrowers[0]?._id) {
    promises.push(
      borrowerUpdate.run({
        borrowerId: loan.borrowers[0]._id,
        object: borrower1,
      }),
    );
  }

  if (loan.borrowers[1]?._id) {
    promises.push(
      borrowerUpdate.run({
        borrowerId: loan.borrowers[1]._id,
        object: borrower2,
      }),
    );
  }

  return Promise.all(promises);
};

export const steps = [
  {
    id: 'purchaseType',
    component: 'OnboardingChoice',
    props: {
      choices: [
        {
          id: PURCHASE_TYPE.ACQUISITION,
          iconComponent: <AcquisitionIcon fontSize="3em" className="mb-16" />,
        },
        {
          id: PURCHASE_TYPE.REFINANCING,
          iconComponent: <RefinancingIcon fontSize="3em" className="mb-16" />,
        },
      ],
    },
    condition: not(isProFlow),
    isDone: loan => !!loan.purchaseType,
    onSubmit: loan => purchaseType =>
      loanUpdate.run({ loanId: loan._id, object: { purchaseType } }),
    renderValue: loan => (
      <T id={`OnboardingWithoutLoan.${loan.purchaseType}`} />
    ),
  },
  {
    id: 'acquisitionStatus',
    component: 'OnboardingChoice',
    props: {
      choices: [
        { id: ACQUISITION_STATUS.SEARCHING, icon: faSearchLocation },
        { id: ACQUISITION_STATUS.PROPERTY_IDENTIFIED, icon: faCommentDollar },
        { id: ACQUISITION_STATUS.OFFER_MADE, icon: faCommentDollar },
        { id: ACQUISITION_STATUS.PROMISE_INCOMING, icon: faCommentDollar },
        { id: ACQUISITION_STATUS.PROMISE_SIGNED, icon: faCommentDollar },
      ],
    },
    condition: not(or(isProFlow, isRefinancing)),
    isDone: loan => !!loan.acquisitionStatus,
    onSubmit: loan => acquisitionStatus =>
      loanUpdate.run({ loanId: loan._id, object: { acquisitionStatus } }),
    renderValue: loan => (
      <T id={`Forms.acquisitionStatus.${loan.acquisitionStatus}`} />
    ),
  },
  {
    id: 'residenceType',
    component: 'OnboardingChoice',
    props: {
      choices: [
        { id: RESIDENCE_TYPE.MAIN_RESIDENCE, icon: faHomeLg },
        { id: RESIDENCE_TYPE.SECOND_RESIDENCE, icon: faHouseDay },
        { id: RESIDENCE_TYPE.INVESTMENT, icon: faBuilding },
      ],
    },
    condition: always,
    isDone: loan => !!loan.residenceType,
    onSubmit: loan => residenceType =>
      loanUpdate.run({ loanId: loan._id, object: { residenceType } }),
    renderValue: loan => <T id={`Forms.residenceType.${loan.residenceType}`} />,
  },
  {
    id: 'canton',
    component: 'OnboardingChoice',
    condition: not(isProFlow),
    props: {
      choices: [
        { id: 'FR' },
        { id: 'GE' },
        { id: 'NE' },
        { id: 'VS' },
        { id: 'VD' },
      ],
    },
    isDone: loan => !!loan.properties?.[0]?.canton,
    onSubmit: loan => canton => {
      if (loan.properties?.[0]?._id) {
        return propertyUpdate.run({
          propertyId: loan.properties[0]._id,
          object: { canton },
        });
      }

      return upsertUserProperty.run({
        loanId: loan._id,
        property: { canton },
      });
    },
    renderValue: loan => <T id={`Forms.canton.${loan.properties[0].canton}`} />,
  },
  {
    id: 'propertyValue',
    component: 'OnboardingForm',
    condition: or(isRefinancing, knowsProperty),
    props: {
      schema: new SimpleSchema({ value: Number }),
    },
    isDone: loan => !!loan.properties?.[0]?.value,
    onSubmit: loan => values =>
      propertyUpdate.run({
        propertyId: loan.properties[0]._id,
        object: values,
      }),
    renderValue: loan => <Money value={loan.properties[0].value} />,
  },
  {
    id: 'refinancing',
    component: 'OnboardingForm',
    condition: isRefinancing,
    props: {
      schema: refinancingPropertySchema.pick('previousLoanTranches'),
    },
    isDone: loan => loan.previousLoanTranches?.length > 0,
    onSubmit: loan => values =>
      loanUpdate.run({ loanId: loan._id, object: values }),
    renderValue: loan => (
      <Money
        value={loan.previousLoanTranches.reduce((t, { value }) => t + value, 0)}
      />
    ),
  },
  {
    id: 'borrowerCount',
    component: 'OnboardingChoice',
    props: {
      choices: [{ id: 1 }, { id: 2 }],
    },
    condition: always,
    isDone: loan => loan.borrowers?.length > 0,
    onSubmit: loan => amount =>
      loanInsertBorrowers.run({ loanId: loan._id, amount }),
    renderValue: loan => (
      <T id={`Forms.borrowerCount.${loan.borrowers.length}`} />
    ),
  },
  {
    id: 'birthDate',
    component: 'OnboardingBorrowersForm',
    condition: always,
    props: { borrowerSchema: birthDateSchema },
    isDone: loan => loan.borrowers?.every(({ birthDate }) => !!birthDate),
    onSubmit: loan => ({ borrower1, borrower2 }) =>
      updateBorrowers(loan, borrower1, borrower2),
    renderValue: loan => (
      <T
        id="OnboardingStep.birthDate.value"
        values={{ value: loan.borrowers.map(({ age }) => age).join(', ') }}
      />
    ),
  },
  {
    id: 'income',
    component: 'OnboardingBorrowersForm',
    condition: always,
    props: { borrowerSchema: incomeSchema },
    isDone: loan => loan.borrowers?.some(({ salary }) => salary > 0),
    onSubmit: loan => ({ borrower1, borrower2 }) =>
      updateBorrowers(loan, borrower1, borrower2),
    renderValue: loan => <Money value={Calculator.getTotalIncome({ loan })} />,
  },
  {
    id: 'ownFunds',
    component: 'OnboardingBorrowersForm',
    condition: not(isRefinancing),
    props: {
      borrowerSchema: ownFundsSchema,
      getModel: ({ borrowers }) => ({
        borrower1: simplifyBorrowerOwnFunds(borrowers[0]),
        borrower2: simplifyBorrowerOwnFunds(borrowers[1]),
      }),
    },
    isDone: loan =>
      loan.borrowers?.some(
        ({ bankFortune = [] }) =>
          bankFortune.reduce((t, { value }) => t + value, 0) > 0,
      ),
    onSubmit: loan => ({ borrower1, borrower2 }) =>
      updateBorrowers(
        loan,
        complexifyBorrowerOwnFunds(borrower1),
        complexifyBorrowerOwnFunds(borrower2),
      ),
    renderValue: loan => <Money value={Calculator.getTotalFunds({ loan })} />,
  },

  {
    id: 'result',
    component: 'OnboardingResult',
    condition: always,
    isDone: loan => !!loan.maxPropertyValue?.date,
    className: 'wide-form',
  },
];
