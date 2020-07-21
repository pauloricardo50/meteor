import './CTAButtons.scss';

import React from 'react';
import { faCalendarPlus } from '@fortawesome/pro-light-svg-icons/faCalendarPlus';

import AcquisitionIcon from 'core/components/Icon/AcquisitionIcon';
import FaIcon from 'core/components/Icon/FaIcon';
import RefinancingIcon from 'core/components/Icon/RefinancingIcon';
import useMedia from 'core/hooks/useMedia';

import { trackCTA } from '../../utils/tracking';
import Button from '../Button';
import { useLayoutContext } from '../Layout/LayoutContext';

const icons = {
  acquisition: <AcquisitionIcon />,
  refinancing: <RefinancingIcon />,
  calendar: <FaIcon icon={faCalendarPlus} />,
};

const CTAButtons = ({ buttons }) => {
  const { tracking_id: pageTrackingId } = useLayoutContext();
  const isMobile = useMedia({ maxWidth: 768 });
  if (!buttons?.length) return null;

  return (
    <div className="cta-buttons">
      {buttons.map(
        ({ cta_link, cta_style, cta_icon, cta_text, cta_tracking_id }, idx) => {
          const ctaStyle = cta_style;

          const buttonProps = {
            className: 'cta--button',
            raised: ctaStyle !== 'flat',
            primary: ctaStyle === 'primary',
            secondary: ctaStyle === 'secondary',
            size: isMobile ? 'small' : 'large',
          };

          return (
            <Button
              key={idx}
              link
              icon={
                cta_icon && (icons[cta_icon] || <div>icon: {cta_icon}</div>)
              }
              prismicLink={cta_link}
              onTrack={
                cta_tracking_id
                  ? ({ toPath }) =>
                      trackCTA({
                        buttonTrackingId: cta_tracking_id,
                        toPath,
                        pageTrackingId,
                      })
                  : undefined
              }
              {...buttonProps}
            >
              {cta_text}
            </Button>
          );
        },
      )}
    </div>
  );
};

export default CTAButtons;
