import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import './SideNavList.scss';

const SideNavList = ({ links }) => (
  <ul className="side-nav-list">
    {links.map(link => (
      <li key={link.link}>
        <NavLink exact to={link.link} activeClassName="active-link">
          {link.icon}
          <h5>{link.label}</h5>
        </NavLink>
      </li>
    ))}
  </ul>
);

SideNavList.propTypes = {
  links: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SideNavList;
