import React from 'react';
import { faBuilding } from '@fortawesome/pro-duotone-svg-icons/faBuilding';
import { faCommentDollar } from '@fortawesome/pro-duotone-svg-icons/faCommentDollar';
import { faHomeLg } from '@fortawesome/pro-duotone-svg-icons/faHomeLg';
import { faHouseDay } from '@fortawesome/pro-duotone-svg-icons/faHouseDay';
import { faSearchLocation } from '@fortawesome/pro-duotone-svg-icons/faSearchLocation';

import { PURCHASE_TYPE } from 'core/api/loans/loanConstants';
import AcquisitionIcon from 'core/components/Icon/AcquisitionIcon';
import RefinancingIcon from 'core/components/Icon/RefinancingIcon';

import { RESIDENCE_TYPE } from '../../../core/api/properties/propertyConstants';

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
  },
  {
    id: 'projectStatus',
    component: 'OnboardingChoice',
    props: {
      choices: [
        { id: 'SEARCHING', icon: faSearchLocation },
        { id: 'OFFER', icon: faCommentDollar },
      ],
    },
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
  },

  { id: 'result', component: 'OnboardingResult' },
];
