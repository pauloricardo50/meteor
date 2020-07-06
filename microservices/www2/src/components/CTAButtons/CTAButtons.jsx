import './CTAButtons.scss';

import React from 'react';

import { linkResolver } from '../../utils/linkResolver';
import Button from '../Button';

const CTAButtons = ({ buttons }) => {
  if (!buttons.length) return null;

  return (
    <div className="cta-buttons">
      {buttons.map((button, idx) => {
        const linkType = button.cta_link?._linkType;
        const ctaStyle = button.cta_style;

        if (linkType === 'Link.document') {
          const meta = button.cta_link._meta;
          if (!meta) return null;

          return (
            <Button
              key={idx}
              className="cta--button"
              raised={ctaStyle !== 'flat'}
              primary={ctaStyle === 'primary'}
              secondary={ctaStyle === 'secondary'}
              link
              to={linkResolver(meta)}
            >
              {/* TODO: replace text with icon */}
              {button.cta_icon && <div>icon: {button.cta_icon}</div>}

              {button.cta_text}
            </Button>
          );
        }

        if (linkType === 'Link.web') {
          return (
            <Button
              component="a"
              className="cta--button"
              raised={ctaStyle !== 'flat'}
              primary={ctaStyle === 'primary'}
              secondary={ctaStyle === 'secondary'}
              key={idx}
              href={button.cta_link.url || undefined}
              target={`${button.cta_text}-tab`}
            >
              {/* TODO: replace text with icon */}
              {button.cta_icon && <div>icon: {button.cta_icon}</div>}

              {button.cta_text}
            </Button>
          );
        }

        return null;
      })}
    </div>
  );
};

export default CTAButtons;
