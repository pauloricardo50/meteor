import React from 'react';
import { faAbacus } from '@fortawesome/pro-duotone-svg-icons/faAbacus';
import { faHandsHelping } from '@fortawesome/pro-duotone-svg-icons/faHandsHelping';
import { faTrophy } from '@fortawesome/pro-duotone-svg-icons/faTrophy';
import { faUserChart } from '@fortawesome/pro-duotone-svg-icons/faUserChart';

import FaIcon from 'core/components/Icon/FaIcon';
import T from 'core/components/Translation';

const items = [
  { id: '1', icon: faAbacus },
  { id: '2', icon: faUserChart },
  { id: '3', icon: faTrophy },
  { id: '4', icon: faHandsHelping },
];

const OnboardingMarketing = props => (
  <div className="onboarding-marketing">
    {items.map(({ id, icon }) => (
      <div key={id} className="flex-col center-align">
        <FaIcon icon={icon} size="4x" className="mb-16" />
        <h3 className="font-size-5">
          <T id="OnboardingMarketing.1.title" />
        </h3>
        <p className="secondary">
          <T id="OnboardingMarketing.1.description" />
        </p>
      </div>
    ))}
  </div>
);

export default OnboardingMarketing;
