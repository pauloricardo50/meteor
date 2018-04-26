import React from 'react';
import PropTypes from 'prop-types';

const AboutPageTeamMember = ({ name, src, title, email, phone }) => (
  <div className="about-page-team-member">
    <img src={src} alt={name} />
    <div className="about-page-team-member-info">
      <h3>{name}</h3>
      <h4>{title}</h4>
      <p>{email}</p>
      <p>{phone}</p>
    </div>
  </div>
);

AboutPageTeamMember.propTypes = {};

export default AboutPageTeamMember;
