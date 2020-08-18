import React from 'react';
import { faAbacus } from '@fortawesome/pro-duotone-svg-icons/faAbacus';
import { faHandsHelping } from '@fortawesome/pro-duotone-svg-icons/faHandsHelping';
import { faTrophy } from '@fortawesome/pro-duotone-svg-icons/faTrophy';
import { faUserChart } from '@fortawesome/pro-duotone-svg-icons/faUserChart';

import FaIcon from 'core/components/Icon/FaIcon';
import T from 'core/components/Translation';
import colors from 'core/config/colors';

const items = [
  { id: '1', icon: faAbacus },
  { id: '2', icon: faUserChart },
  { id: '3', icon: faTrophy },
  { id: '4', icon: faHandsHelping },
];

const OnboardingMarketing = () => (
  <div className="onboarding-marketing">
    {items.map(({ id, icon }, index) => (
      <div
        key={id}
        className={`flex-col center-align text-center animated fadeInUp delay-${
          100 * (index + 1)
        }`}
      >
        <FaIcon
          icon={icon}
          size="4x"
          className="mb-16"
          color={colors.primaryLight}
        />
        <h3 className="font-size-5 mb-8 mt-0">
          <T id={`OnboardingMarketing.${index + 1}.title`} />
        </h3>
        <p className="secondary m-0">
          <T id={`OnboardingMarketing.${index + 1}.description`} />
        </p>
      </div>
    ))}
  </div>
);

export default OnboardingMarketing;
