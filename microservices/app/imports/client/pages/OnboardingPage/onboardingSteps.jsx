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
import { RESIDENCE_TYPE } from 'core/api/properties/propertyConstants';
import AcquisitionIcon from 'core/components/Icon/AcquisitionIcon';
import RefinancingIcon from 'core/components/Icon/RefinancingIcon';
import { refinancingPropertySchema } from 'core/components/PropertyForm/PropertyAdderDialog';
import { not, or } from 'core/utils/functional';

const always = () => true;
const isProFlow = loan => loan.hasPromotion || loan.hasProProperty;
const isRefinancing = loan => loan.purchaseType === PURCHASE_TYPE.REFINANCING;
const knowsProperty = loan =>
  loan.projectStatus && loan.projectStatus !== ACQUISITION_STATUS.SEARCHING;

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
  },
  {
    id: 'propertyValue',
    component: 'OnboardingForm',
    condition: or(isRefinancing, knowsProperty),
    props: {
      schema: new SimpleSchema({ value: Number }),
    },
  },
  {
    id: 'refinancing',
    component: 'OnboardingForm',
    condition: isRefinancing,
    props: {
      schema: refinancingPropertySchema.pick('previousLoanTranches'),
    },
  },
  {
    id: 'borrowerCount',
    component: 'OnboardingChoice',
    props: {
      choices: [{ id: 1 }, { id: 2 }],
    },
    condition: always,
  },
  {
    id: 'income',
    component: 'OnboardingForm',
    condition: always,
    props: { schema: new SimpleSchema({}) },
  },
  {
    id: 'ownFunds',
    component: 'OnboardingForm',
    condition: not(isRefinancing),
    props: { schema: new SimpleSchema({}) },
  },

  {
    id: 'result',
    component: 'OnboardingResult',
    condition: always,
  },
];
