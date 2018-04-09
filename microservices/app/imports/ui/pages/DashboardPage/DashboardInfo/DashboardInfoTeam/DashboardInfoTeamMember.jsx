import React from 'react';
import PropTypes from 'prop-types';

import IconButton from 'core/components/IconButton';

const DashboardInfoTeamMember = ({ src, name, title, email, phone }) => (
  <div className="dashboard-info-team-company-member">
    {src && <img src={src} alt={name} />}
    <div className="person">
      <h4>{name}</h4>
      <p>{title}</p>
    </div>
    <div className="contact">
      <a href={`mailto:${email}`}>
        <IconButton type="mail" />
      </a>
      <a href={`tel:${phone}`}>
        <IconButton type="phone" />
      </a>
    </div>
  </div>
);

DashboardInfoTeamMember.propTypes = {
  src: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
};

export default DashboardInfoTeamMember;
