import './CTAButtons.scss';

import React from 'react';

import AcquisitionIcon from 'core/components/Icon/AcquisitionIcon';
import RefinancingIcon from 'core/components/Icon/RefinancingIcon';

import { linkResolver } from '../../utils/linkResolver';
import Button from '../Button';

const icons = {
  acquisition: <AcquisitionIcon />,
  refinancing: <RefinancingIcon />,
};

const CTAButtons = ({ buttons }) => {
  if (!buttons.length) return null;

  return (
    <div className="cta-buttons">
      {buttons.map(({ cta_link, cta_style, cta_icon, cta_text }, idx) => {
        const linkType = cta_link?._linkType;
        const ctaStyle = cta_style;

        const buttonProps = {
          className: 'cta--button',
          raised: ctaStyle !== 'flat',
          primary: ctaStyle === 'primary',
          secondary: ctaStyle === 'secondary',
          size: 'large',
        };

        if (linkType === 'Link.document') {
          const meta = cta_link._meta;
          if (!meta) return null;

          return (
            <Button
              key={idx}
              link
              to={linkResolver(meta)}
              icon={
                cta_icon && (icons[cta_icon] || <div>icon: {cta_icon}</div>)
              }
              {...buttonProps}
            >
              {cta_text}
            </Button>
          );
        }

        if (linkType === 'Link.web') {
          return (
            <Button
              component="a"
              key={idx}
              href={cta_link.url || undefined}
              target={`${cta_text}-tab`}
              icon={
                cta_icon && (icons[cta_icon] || <div>icon: {cta_icon}</div>)
              }
              {...buttonProps}
            >
              {cta_text}
            </Button>
          );
        }

        return null;
      })}
    </div>
  );
};

export default CTAButtons;
