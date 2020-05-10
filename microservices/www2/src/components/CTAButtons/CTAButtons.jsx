import React from 'react';
import { RichText } from 'prismic-reactjs';
import Button from '../Button';
import { linkResolver } from '../../utils/linkResolver';
import './CTAButtons.scss';

const CTAButtons = ({ buttons }) => (
  <div className="cta-buttons">
    {buttons.length > 0 &&
      buttons.map((button, idx) => {
        const linkType = button.cta_link?._linkType;

        if (!linkType) return null;

        let to = '';

        if (linkType === 'Link.document') {
          const meta = button.cta_link._meta;
          if (!meta) return null;
          to = linkResolver(meta);
        } else if (linkType === 'Link.web') {
          to = button.cta_link.url;
        }

        if (!to) return null;

        return (
          <Button
            key={idx}
            className="cta--button"
            raised
            primary={idx === 0}
            link
            to={to}
          >
            {button.cta_text}
          </Button>
        );
      })}
  </div>
);

export default CTAButtons;
