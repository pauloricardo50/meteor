import React from 'react';
import PropTypes from 'prop-types';

const AboutPageTeamMember = ({ name, src, title, email, phone }) => (
  <div className="about-page-team-member">
    <img src={src} alt={name} />
    <div className="about-page-team-member-info">
      <h3>{name}</h3>
      <h4>{title}</h4>
      {email && <p>{email}</p>}
      {phone && <p>{phone}</p>}
    </div>
  </div>
);

AboutPageTeamMember.propTypes = {
  name: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  email: PropTypes.string,
  phone: PropTypes.string,
};

AboutPageTeamMember.defaultProps = {
  email: '',
  phone: '',
};

export default AboutPageTeamMember;
