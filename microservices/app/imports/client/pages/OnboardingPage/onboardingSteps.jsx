import React from 'react';
import { faBuilding } from '@fortawesome/pro-duotone-svg-icons/faBuilding';
import { faCommentDollar } from '@fortawesome/pro-duotone-svg-icons/faCommentDollar';
import { faEnvelopeOpenDollar } from '@fortawesome/pro-duotone-svg-icons/faEnvelopeOpenDollar';
import { faFileSignature } from '@fortawesome/pro-duotone-svg-icons/faFileSignature';
import { faHomeLg } from '@fortawesome/pro-duotone-svg-icons/faHomeLg';
import { faHouseDay } from '@fortawesome/pro-duotone-svg-icons/faHouseDay';
import { faLightbulbDollar } from '@fortawesome/pro-duotone-svg-icons/faLightbulbDollar';
import { faSearchLocation } from '@fortawesome/pro-duotone-svg-icons/faSearchLocation';
import { faUser } from '@fortawesome/pro-duotone-svg-icons/faUser';
import { faUserFriends } from '@fortawesome/pro-duotone-svg-icons/faUserFriends';
import { faUsers } from '@fortawesome/pro-duotone-svg-icons/faUsers';
import SimpleSchema from 'simpl-schema';

import { CTA_ID } from 'core/api/analytics/analyticsConstants';
import { borrowerUpdate } from 'core/api/borrowers/methodDefinitions';
import { moneyField } from 'core/api/helpers/sharedSchemas';
import {
  ACQUISITION_STATUS,
  PURCHASE_TYPE,
} from 'core/api/loans/loanConstants';
import {
  loanSetBorrowers,
  loanUpdate,
  upsertUserProperty,
} from 'core/api/loans/methodDefinitions';
import { propertyUpdate } from 'core/api/properties/methodDefinitions';
import { RESIDENCE_TYPE } from 'core/api/properties/propertyConstants';
import AcquisitionIcon from 'core/components/Icon/AcquisitionIcon';
import RefinancingIcon from 'core/components/Icon/RefinancingIcon';
import refinancingPropertySchema from 'core/components/PropertyForm/refinancingPropertySchema';
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
export const isProFlow = loan => loan.hasPromotion || loan.hasProProperty;
export const isRefinancing = loan =>
  loan.purchaseType === PURCHASE_TYPE.REFINANCING;
const knowsProperty = loan =>
  loan.acquisitionStatus &&
  loan.acquisitionStatus !== ACQUISITION_STATUS.SEARCHING;

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
    getValue: loan => loan.purchaseType,
    renderValue: value => <T id={`OnboardingWithoutLoan.${value}`} />,
  },
  {
    id: 'acquisitionStatus',
    component: 'OnboardingChoice',
    props: {
      choices: [
        { id: ACQUISITION_STATUS.SEARCHING, icon: faSearchLocation },
        { id: ACQUISITION_STATUS.PROPERTY_IDENTIFIED, icon: faLightbulbDollar },
        { id: ACQUISITION_STATUS.OFFER_MADE, icon: faCommentDollar },
        { id: ACQUISITION_STATUS.PROMISE_INCOMING, icon: faEnvelopeOpenDollar },
        { id: ACQUISITION_STATUS.PROMISE_SIGNED, icon: faFileSignature },
      ],
    },
    condition: not(or(isProFlow, isRefinancing)),
    isDone: loan => !!loan.acquisitionStatus,
    onSubmit: loan => acquisitionStatus =>
      loanUpdate.run({ loanId: loan._id, object: { acquisitionStatus } }),
    getValue: loan => loan.acquisitionStatus,
    renderValue: value => <T id={`Forms.acquisitionStatus.${value}`} />,
  },
  {
    id: 'residenceType',
    component: 'OnboardingChoice',
    props: {
      choices: [
        { id: RESIDENCE_TYPE.MAIN_RESIDENCE, icon: faHomeLg },
        { id: RESIDENCE_TYPE.SECOND_RESIDENCE, icon: faHouseDay },
        {
          id: RESIDENCE_TYPE.INVESTMENT,
          icon: faBuilding,
          modalId: 'OnboardingChoice.investment',
          ctaId: CTA_ID.CALENDLY_RESIDENCE_TYPE_STEP,
        },
      ],
    },
    condition: always,
    isDone: loan => !!loan.residenceType,
    onSubmit: loan => residenceType =>
      loanUpdate.run({ loanId: loan._id, object: { residenceType } }),
    getValue: loan => loan.residenceType,
    renderValue: value => <T id={`Forms.residenceType.${value}`} />,
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
        {
          id: 'other',
          label: <T id="general.other" />,
          modalId: 'OnboardingChoice.otherCanton',
          ctaId: CTA_ID.CALENDLY_CANTON_STEP,
        },
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

      return upsertUserProperty.run({ loanId: loan._id, property: { canton } });
    },
    getValue: loan => loan.properties?.[0]?.canton,
    renderValue: value => <T id={`Forms.canton.${value}`} />,
  },
  {
    id: 'propertyValue',
    component: 'OnboardingForm',
    condition: or(isRefinancing, knowsProperty),
    props: {
      schema: new SimpleSchema({ value: { ...moneyField, optional: false } }),
      getModel: loan => ({ value: loan.properties?.[0]?.value }),
    },
    isDone: loan => !!loan.properties?.[0]?.value,
    onSubmit: loan => values =>
      propertyUpdate.run({
        propertyId: loan.properties[0]._id,
        object: values,
      }),
    getValue: loan => loan.properties?.[0]?.value,
    renderValue: value => <Money value={value} />,
  },
  {
    id: 'refinancing',
    component: 'OnboardingForm',
    condition: isRefinancing,
    props: {
      schema: refinancingPropertySchema.pick('previousLoanTranches'),
      getModel: loan => ({ previousLoanTranches: loan.previousLoanTranches }),
    },
    isDone: loan => loan.previousLoanTranches?.length > 0,
    onSubmit: loan => values =>
      loanUpdate.run({ loanId: loan._id, object: values }),
    getValue: loan =>
      loan.previousLoanTranches?.reduce((t, { value }) => t + value, 0),
    renderValue: value => <Money value={value} />,
  },
  {
    id: 'borrowerCount',
    component: 'OnboardingChoice',
    props: {
      choices: [
        { id: 1, icon: faUser },
        { id: 2, icon: faUserFriends },
        {
          id: 'other',
          label: <T id="general.other" />,
          modalId: 'OnboardingChoice.manyBorrowers',
          ctaId: CTA_ID.CALENDLY_BORROWERS_STEP,
          icon: faUsers,
        },
      ],
    },
    condition: always,
    isDone: loan => loan.borrowers?.length > 0,
    onSubmit: loan => amount =>
      loanSetBorrowers.run({ loanId: loan._id, amount }),
    getValue: loan => loan.borrowers?.length,
    renderValue: value => <T id={`Forms.borrowerCount.${value}`} />,
  },
  {
    id: 'birthDate',
    component: 'OnboardingBorrowersForm',
    condition: always,
    props: { borrowerSchema: birthDateSchema },
    isDone: loan =>
      loan.borrowers.length > 0 &&
      loan.borrowers?.every(({ birthDate }) => !!birthDate),
    onSubmit: loan => ({ borrower1, borrower2 }) =>
      updateBorrowers(loan, borrower1, borrower2),
    getValue: loan => loan.borrowers?.map(({ age }) => age),
    renderValue: value => (
      <T
        id="OnboardingStep.birthDate.value"
        values={{ value: value.join(', ') }}
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
    getValue: loan => Calculator.getTotalIncome({ loan }),
    renderValue: value => <Money value={value} />,
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
    getValue: loan => Calculator.getTotalFunds({ loan }),
    renderValue: value => <Money value={value} />,
  },

  {
    id: 'result',
    component: 'OnboardingResult',
    condition: always,
    isDone: loan => !!loan.maxPropertyValue?.date,
    className: 'wide-form',
  },
];
