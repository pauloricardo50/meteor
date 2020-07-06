import React from 'react';
import Button from '../Button';
import { linkResolver } from '../../utils/linkResolver';
import './CTAButtons.scss';

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
            <a
              key={idx}
              href={button.cta_link.url || undefined}
              target={`${button.cta_text}-tab`}
            >
              <Button
                className="cta--button"
                raised={ctaStyle !== 'flat'}
                primary={ctaStyle === 'primary'}
                secondary={ctaStyle === 'secondary'}
              >
                {/* TODO: replace text with icon */}
                {button.cta_icon && <div>icon: {button.cta_icon}</div>}

                {button.cta_text}
              </Button>
            </a>
          );
        }

        return null;
      })}
    </div>
  );
};

export default CTAButtons;
