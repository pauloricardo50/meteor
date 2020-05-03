import React from 'react';
import { RichText } from 'prismic-reactjs';
import IconButton from 'core/components/IconButton';
import './Team.scss';

const EMAIL = 'team@e-potek.ch';

const getMailTo = name =>
  `mailto:${EMAIL}?subject=${encodeURI(`Contacter ${name}`)}`;

const Team = ({ primary, fields }) => (
  <div className="team container">
    <div className="team__heading">{RichText.render(primary.team_section)}</div>

    {fields &&
      fields.map((field, idx) => (
        <div key={idx} className="team-member">
          <div className="team-member__image">
            <img
              className="profile-image"
              src={field.portrait.url}
              alt={field.portrait.alt}
            />
          </div>

          <div className="team-member__content">
            <div className="team-member__customer">
              {RichText.render(field.member_name)}
              {RichText.render(field.position)}
              <span className="team-member__contact">
                <a href={getMailTo(field.member_name)} className="email">
                  <IconButton
                    size="small"
                    type="mail"
                    // tooltip={field.member_name}
                  />
                </a>
                <a href="tel:+41225660110">
                  <IconButton
                    size="small"
                    type="phone"
                    // tooltip={field.member_name}
                  />
                </a>
              </span>
            </div>
          </div>
        </div>
      ))}
  </div>
);

export default Team;
