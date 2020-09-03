import React from 'react';
import { faEngineWarning } from '@fortawesome/pro-duotone-svg-icons/faEngineWarning';

import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import FaIcon from 'core/components/Icon/FaIcon';
import T from 'core/components/Translation';
import colors from 'core/config/colors';

import { useOnboarding } from '../../OnboardingContext';

const OnboardingResultUnfinished = () => {
  const { resetPosition } = useOnboarding();

  return (
    <div>
      <FaIcon
        icon={faEngineWarning}
        size="3x"
        color={colors.duotoneIconColor}
      />
      <h1>
        <T id="OnboardingResultUnfinished.title" />
      </h1>

      <p className="description">
        <T id="OnboardingResultUnfinished.description" />
      </p>

      <Button
        raised
        primary
        onClick={() => resetPosition()}
        icon={<Icon type="right" />}
        iconAfter
      >
        <T id="OnboardingResultUnfinished.cta" />
      </Button>
    </div>
  );
};

export default OnboardingResultUnfinished;
