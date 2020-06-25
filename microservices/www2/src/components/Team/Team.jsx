import './Team.scss';

import React from 'react';
import { RichText } from 'prismic-reactjs';

import IconButton from 'core/components/IconButton';

const EMAIL = 'team@e-potek.ch';

const getMailTo = (name) =>
  `mailto:${EMAIL}?subject=${encodeURI(`Contacter ${name}`)}`;

const Team = ({ primary, fields }) => (
  <div className="team container">
    <div className="team__heading">
      {RichText.asText(primary.section_heading)}
    </div>

    <div className="team__members">
      {fields &&
        fields.map((field, idx) => (
          <div key={idx} className="team-member">
            <div className="team-member__image center">
              <div className="outer-circle center">
                <div className="inner-circle center">
                  <img
                    className="profile-image"
                    src={field.portrait?.url}
                    alt={field.portrait?.alt}
                  />
                </div>
              </div>
            </div>

            <div className="team-member__content">
              <div className="team-member__name">
                {RichText.asText(field.member_name)}
              </div>

              <div className="team-member__position">
                {RichText.asText(field.position)}
              </div>

              <div className="team-member__contact">
                <a href={getMailTo(field.member_name)} className="email">
                  <IconButton size="small" type="mail" />
                </a>

                <a href={`tel:${field.phone || '+41225660110'}`}>
                  <IconButton size="small" type="phone" />
                </a>
              </div>
            </div>
          </div>
        ))}
    </div>
  </div>
);

export default Team;
