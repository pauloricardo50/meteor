import React from 'react';
import { faUniversity } from '@fortawesome/pro-duotone-svg-icons/faUniversity';
import LinearProgress from '@material-ui/core/LinearProgress';

import FaIcon from 'core/components/Icon/FaIcon';
import colors from 'core/config/colors';

import { useOnboarding } from '../../OnboardingContext';

const lines = [...Array(10)];

const OnboardingResultAnimation = () => {
  const { isMobile } = useOnboarding();
  const size = isMobile ? 300 : 600;

  return (
    <div className="flex center" style={{ width: size, height: size }}>
      <div style={{ width: 50, height: 50, position: 'relative' }}>
        {lines.map((_, index) => {
          const angle = index * (360 / lines.length) + Math.random() * 20;
          return (
            <div
              key={index}
              style={{
                width: size / 8 + Math.random() * (size / 3),
                position: 'absolute',
                top: 'calc(50% - 2px)',
                left: 'calc(50% - 2px)',
                zIndex: -1,
                transform: `rotate(${angle}deg)`,
                transformOrigin: '0 2px',
              }}
            >
              <div style={{ position: 'relative' }}>
                <LinearProgress style={{ width: '100%' }} />
                <div
                  style={{
                    position: 'absolute',
                    right: -13,
                    top: -13,
                    transform: `rotate(${-angle}deg)`,
                    backgroundColor: colors.backgroundColor,
                    borderRadius: '50%',
                    width: 30,
                    height: 30,
                    fontSize: 20,
                  }}
                  className="flex center"
                >
                  <FaIcon icon={faUniversity} color={colors.duotoneIconColor} />
                </div>
              </div>
            </div>
          );
        })}

        <img
          src="/img/logo_square_black.svg"
          alt="e-Potek"
          className="animated pulse infinite"
        />
      </div>
    </div>
  );
};

export default OnboardingResultAnimation;
