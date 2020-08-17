import React from 'react';
import { faBuilding } from '@fortawesome/pro-duotone-svg-icons/faBuilding';
import { faCommentDollar } from '@fortawesome/pro-duotone-svg-icons/faCommentDollar';
import { faHomeLg } from '@fortawesome/pro-duotone-svg-icons/faHomeLg';
import { faHouseDay } from '@fortawesome/pro-duotone-svg-icons/faHouseDay';
import { faSearchLocation } from '@fortawesome/pro-duotone-svg-icons/faSearchLocation';
import SimpleSchema from 'simpl-schema';

import {
  ACQUISITION_STATUS,
  PURCHASE_TYPE,
} from 'core/api/loans/loanConstants';
import {
  loanUpdate,
  upsertUserProperty,
} from 'core/api/loans/methodDefinitions';
import { propertyUpdate } from 'core/api/properties/methodDefinitions';
import { RESIDENCE_TYPE } from 'core/api/properties/propertyConstants';
import AcquisitionIcon from 'core/components/Icon/AcquisitionIcon';
import RefinancingIcon from 'core/components/Icon/RefinancingIcon';
import { refinancingPropertySchema } from 'core/components/PropertyForm/PropertyAdderDialog';
import { not, or } from 'core/utils/functional';

import { borrowerUpdate } from '../../../core/api/borrowers/methodDefinitions';
import { loanInsertBorrowers } from '../../../core/api/loans/methodDefinitions';

const always = () => true;
const isProFlow = loan => loan.hasPromotion || loan.hasProProperty;
const isRefinancing = loan => loan.purchaseType === PURCHASE_TYPE.REFINANCING;
const knowsProperty = loan =>
  loan.projectStatus && loan.projectStatus !== ACQUISITION_STATUS.SEARCHING;

const updateBorrowers = (loan, borrower1, borrower2) => {
  const promises = [];
  if (borrower1) {
    promises.push(
      borrowerUpdate.run({
        borrowerId: loan.borrowers[0]._id,
        object: borrower1,
      }),
    );
  }

  if (borrower2) {
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
  },
  {
    id: 'income',
    component: 'OnboardingForm',
    condition: always,
    props: { schema: new SimpleSchema({}) },
    isDone: loan => loan.borrowers?.some(({ salary }) => salary > 0),
    onSubmit: loan => ({ borrower1, borrower2 }) =>
      updateBorrowers(loan, borrower1, borrower2),
  },
  {
    id: 'ownFunds',
    component: 'OnboardingForm',
    condition: not(isRefinancing),
    props: { schema: new SimpleSchema({}) },
    isDone: loan =>
      loan.borrowers?.some(
        ({ bankFortune = [] }) =>
          bankFortune.reduce((t, { value }) => t + value, 0) > 0,
      ),
    onSubmit: loan => ({ borrower1, borrower2 }) =>
      updateBorrowers(loan, borrower1, borrower2),
  },

  {
    id: 'result',
    component: 'OnboardingResult',
    condition: always,
    isDone: loan => !!loan.maxPropertyValue?.date,
  },
];
