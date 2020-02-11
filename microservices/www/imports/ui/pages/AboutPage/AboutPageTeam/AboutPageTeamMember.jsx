import React from 'react';
import PropTypes from 'prop-types';

import IconButton from 'core/components/IconButton';
import T from 'core/components/Translation';

const EMAIL = 'info@e-potek.ch';

const getMailTo = name =>
  `mailto:${EMAIL}?subject=${encodeURI(`Contacter ${name}`)}`;

const extractFirstName = name => name.split(' ')[0];

const AboutPageTeamMember = ({ name, src, title }) => (
  <div className="about-page-team-member">
    <img src={src} alt={name} className="about-page-team-member-image" />
    <div className="about-page-team-member-info">
      <h4>{name}</h4>
      <h5>{title}</h5>
      <span className="about-page-team-member-contact">
        <a href={getMailTo(name)} className="email">
          <IconButton
            size="small"
            type="mail"
            tooltip={
              <T
                id="AboutPageTeamMember.emailTooltip"
                values={{ name: extractFirstName(name) }}
              />
            }
          />
        </a>
        <a href="tel:+41225660110">
          <IconButton
            size="small"
            type="phone"
            tooltip={
              <T
                id="AboutPageTeamMember.phoneTooltip"
                values={{ name: extractFirstName(name) }}
              />
            }
          />
        </a>
      </span>
    </div>
  </div>
);

AboutPageTeamMember.propTypes = {
  name: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default AboutPageTeamMember;
